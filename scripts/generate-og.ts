import fs from "node:fs/promises";
import path from "node:path";
import {generateOGImage} from "../src/lib/og";
import {i18n} from "../src/lib/i18n";

interface PageEntry {
  filePath: string;
  lang: string;
  slugs: string[];
}

function toTitle(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatter(raw: string): {title?: string; description?: string} {
  if (!raw.startsWith("---\n")) return {};
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return {};

  const frontmatter: {title?: string; description?: string} = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim();
    if (key !== "title" && key !== "description") continue;

    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value) {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

async function collectPages(contentDir: string): Promise<PageEntry[]> {
  const supportedLanguages = new Set(i18n.languages);
  const pages: PageEntry[] = [];

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
      const relative = path.relative(contentDir, fullPath).replaceAll(path.sep, "/");
      const noExt = relative.replace(/\.(mdx|md)$/u, "");
      const [lang, ...segments] = noExt.split("/");
      if (!lang || !supportedLanguages.has(lang) || segments.length === 0) continue;

      const leaf = segments.at(-1);
      const slugs = leaf === "index" ? segments.slice(0, -1) : segments;
      if (slugs.length === 0) continue;

      pages.push({filePath: fullPath, lang, slugs});
    }
  }

  await walk(contentDir);
  return pages;
}

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const contentDir = path.join(rootDir, "content");
  const outDir = path.join(rootDir, "dist/client");
  const pages = await collectPages(contentDir);

  for (const page of pages) {
    const raw = await fs.readFile(page.filePath, "utf8");
    const frontmatter = parseFrontmatter(raw);
    const title = frontmatter.title ?? toTitle(page.slugs.at(-1) ?? "page");
    const description = frontmatter.description;
    const image = await generateOGImage({
      data: {
        title,
        description,
      },
    } as never);
    const buffer = Buffer.from(await image.arrayBuffer());
    const targetPath = path.join(outDir, page.lang, "og", ...page.slugs, "image.png");
    await fs.mkdir(path.dirname(targetPath), {recursive: true});
    await fs.writeFile(targetPath, buffer);
  }

  console.log(`[og] generated ${pages.length} PNG files into dist/client`);
}

void main();
