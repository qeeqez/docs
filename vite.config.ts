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

async function getDocsPrerenderPages() {
  const contentDir = path.resolve(__dirname, "content");
  const pages = new Set<string>();

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
      if (fullPath.includes(`${path.sep}includes${path.sep}`)) continue;

      const relativePath = path.relative(contentDir, fullPath).replaceAll(path.sep, "/");
      const noExt = relativePath.replace(/\.(mdx|md)$/, "");
      const [lang, ...segments] = noExt.split("/");
      if (!lang || segments.length === 0) continue;
      if (lang !== "en") continue;

      const leaf = segments.at(-1);
      const routeSegments = leaf === "index" ? segments.slice(0, -1) : segments;
      if (routeSegments.length === 0) continue;

      pages.add(`/${lang}/${routeSegments.join("/")}`);
    }
  }

  await walk(contentDir);

  return Array.from(pages)
    .sort((a, b) => a.localeCompare(b))
    .map((pagePath) => ({path: pagePath}));
}

const docsPrerenderPages = await getDocsPrerenderPages();

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
        ...docsPrerenderPages,
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
