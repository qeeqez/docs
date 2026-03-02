import fs from "node:fs/promises";
import path from "node:path";
import {defineConfig} from "vite";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";
import mdx from "fumadocs-mdx/vite";
import {extractIconsPlugin} from "./plugins/vite-plugin-extract-icons";
import {i18n} from "./src/lib/i18n";

// import { nitro } from 'nitro/vite'

interface DocsPrerenderPages {
  docs: string[];
  og: string[];
  llmsFull: string[];
}

async function getDocsPrerenderPages(): Promise<DocsPrerenderPages> {
  const contentDir = path.resolve(__dirname, "content");
  const docsPages = new Set<string>();
  const langs = new Set<string>();
  const supportedLanguages = new Set(i18n.languages);

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
      const noExt = relativePath.replace(/\.(mdx|md)$/, "");
      const [lang, ...segments] = noExt.split("/");
      if (!lang || !supportedLanguages.has(lang) || segments.length === 0) continue;

      const leaf = segments.at(-1);
      const routeSegments = leaf === "index" ? segments.slice(0, -1) : segments;
      if (routeSegments.length === 0) continue;

      langs.add(lang);
      docsPages.add(`/${lang}/${routeSegments.join("/")}`);
    }
  }

  await walk(contentDir);

  const og = new Set<string>();

  for (const pagePath of docsPages) {
    const [, lang, ...slugSegments] = pagePath.split("/");
    if (!lang || slugSegments.length === 0) continue;
    og.add(`/${lang}/og/${slugSegments.join("/")}/image.png`);
  }

  const llmsFull = new Set<string>();
  for (const lang of langs) {
    llmsFull.add(`/${lang}/llms-full.txt`);
  }

  const sort = (value: Set<string>) => Array.from(value).sort((a, b) => a.localeCompare(b));

  return {
    docs: sort(docsPages),
    og: sort(og),
    llmsFull: sort(llmsFull),
  };
}

const docsPrerenderPages = await getDocsPrerenderPages();
const ogOutputDir = path.resolve(__dirname, "dist/client");

const ogPrerenderPages = docsPrerenderPages.og.map((pagePath) => ({
  path: pagePath,
  prerender: {
    crawlLinks: false,
    headers: {
      "x-og-prerender": "base64",
    },
    onSuccess: async ({page, html}: {page: {path: string}; html: string}) => {
      const outputPath = path.join(ogOutputDir, page.path.replace(/^\//, ""));
      await fs.mkdir(path.dirname(outputPath), {recursive: true});
      await fs.writeFile(outputPath, Buffer.from(html.trim(), "base64"));
    },
  },
}));

const staticDocsPages = docsPrerenderPages.docs.map((pagePath) => ({path: pagePath}));
const staticLLMSPages = docsPrerenderPages.llmsFull.map((pagePath) => ({path: pagePath}));

export default defineConfig({
  plugins: [
    extractIconsPlugin(),
    mdx(await import("./source.config")),
    tailwindcss(),
    tsConfigPaths({projects: ["./tsconfig.json"]}),
    svgr(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          outputPath: "index.html",
          enabled: true,
          crawlLinks: false,
        },
      },
      prerender: {
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: false,
      },
      router: {
        quoteStyle: "double",
      },
      pages: [
        {
          path: "/",
        },
        {
          path: "/api/search",
        },
        {
          path: "/robots.txt",
        },
        {
          path: "/sitemap.xml",
        },
        ...staticDocsPages,
        ...ogPrerenderPages,
        ...staticLLMSPages,
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@/snippets": `${__dirname}/src/components/mdx`,
    },
  },
});
