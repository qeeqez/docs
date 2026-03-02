import fs from "node:fs/promises";
import path from "node:path";
import {i18n} from "../src/lib/i18n";

interface MarkdownEntry {
  filePath: string;
  outputPath: string;
}

async function collectMarkdown(contentDir: string): Promise<MarkdownEntry[]> {
  const supportedLanguages = new Set(i18n.languages);
  const entries: MarkdownEntry[] = [];

  async function walk(dir: string) {
    const children = await fs.readdir(dir, {withFileTypes: true});

    for (const child of children) {
      const fullPath = path.join(dir, child.name);
      if (child.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (!child.isFile()) continue;
      if (!child.name.endsWith(".mdx") && !child.name.endsWith(".md")) continue;

      const relative = path.relative(contentDir, fullPath).replaceAll(path.sep, "/");
      const noExt = relative.replace(/\.(mdx|md)$/u, "");
      const [lang, ...segments] = noExt.split("/");
      if (!lang || !supportedLanguages.has(lang) || segments.length === 0) continue;

      const leaf = segments.at(-1);
      const slugs = leaf === "index" ? segments.slice(0, -1) : segments;
      if (slugs.length === 0) continue;

      entries.push({
        filePath: fullPath,
        outputPath: path.join(lang, ...slugs) + ".md",
      });
    }
  }

  await walk(contentDir);
  return entries;
}

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const contentDir = path.join(rootDir, "content");
  const outDir = path.join(rootDir, "dist/client");
  const entries = await collectMarkdown(contentDir);

  for (const entry of entries) {
    const raw = await fs.readFile(entry.filePath, "utf8");
    const target = path.join(outDir, entry.outputPath);
    await fs.mkdir(path.dirname(target), {recursive: true});
    await fs.writeFile(target, raw);
  }

  console.log(`[md] generated ${entries.length} Markdown files into dist/client`);
}

void main();
