import fs from "node:fs/promises";
import path from "node:path";
import {openapiSource} from "fumadocs-openapi/server";
import {openapi} from "../../src/lib/openapi";
import {openApiPagesOptions} from "../../src/lib/openapi-pages";

export interface DocsPrerenderPages {
  docs: string[];
  og: string[];
  llmsFull: string[];
}

interface CollectDocsPrerenderPagesOptions {
  contentDir: string;
  supportedLanguages: readonly string[];
}

export async function collectDocsPrerenderPages({
  contentDir,
  supportedLanguages,
}: CollectDocsPrerenderPagesOptions): Promise<DocsPrerenderPages> {
  const docsPages = new Set<string>();
  const langs = new Set<string>();
  const supportedLanguageSet = new Set(supportedLanguages);

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, {withFileTypes: true});

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".mdx") && !entry.name.endsWith(".md")) continue;

      const relativePath = path.relative(contentDir, fullPath).replaceAll(path.sep, "/");
      const noExt = relativePath.replace(/\.(mdx|md)$/u, "");
      const [lang, ...segments] = noExt.split("/");
      if (!lang || !supportedLanguageSet.has(lang) || segments.length === 0) continue;

      const leaf = segments.at(-1);
      const routeSegments = leaf === "index" ? segments.slice(0, -1) : segments;
      if (routeSegments.length === 0) continue;

      langs.add(lang);
      docsPages.add(`/${lang}/${routeSegments.join("/")}`);
    }
  }

  await walk(contentDir);
  await collectOpenApiPages(docsPages, langs, supportedLanguageSet);

  const ogPages = new Set<string>();
  for (const pagePath of docsPages) {
    const [, lang, ...slugSegments] = pagePath.split("/");
    if (!lang || slugSegments.length === 0) continue;
    ogPages.add(`/${lang}/og/${slugSegments.join("/")}/image.png`);
  }

  const llmsFullPages = new Set<string>();
  for (const lang of langs) {
    llmsFullPages.add(`/${lang}/llms-full.txt`);
  }

  const sort = (value: Set<string>) => Array.from(value).sort((a, b) => a.localeCompare(b));
  return {
    docs: sort(docsPages),
    og: sort(ogPages),
    llmsFull: sort(llmsFullPages),
  };
}

async function collectOpenApiPages(docsPages: Set<string>, langs: Set<string>, supportedLanguageSet: Set<string>) {
  // Build once, then localize to every supported language path.
  const openApiPages = await openapiSource(openapi, {
    ...openApiPagesOptions,
    baseDir: "__lang__/api",
  });

  for (const file of openApiPages.files) {
    if (file.type !== "page") continue;
    const noExt = file.path.replace(/\.(mdx|md)$/u, "");

    for (const language of supportedLanguageSet) {
      const localized = noExt.replace(/^__lang__/u, language);
      langs.add(language);
      docsPages.add(`/${localized}`);
    }
  }
}

export function toStaticPages(paths: string[]) {
  return paths.map((pagePath) => ({path: pagePath}));
}

interface CreateOgPrerenderPagesOptions {
  ogPaths: string[];
  outputDir: string;
}

export function createOgPrerenderPages({ogPaths, outputDir}: CreateOgPrerenderPagesOptions) {
  return ogPaths.map((pagePath) => ({
    path: pagePath,
    prerender: {
      crawlLinks: false,
      headers: {
        "x-og-prerender": "base64",
      },
      onSuccess: async ({page, html}: {page: {path: string}; html: string}) => {
        const outputPath = path.join(outputDir, page.path.replace(/^\//, ""));
        await fs.mkdir(path.dirname(outputPath), {recursive: true});
        await fs.writeFile(outputPath, Buffer.from(html.trim(), "base64"));
      },
    },
  }));
}
