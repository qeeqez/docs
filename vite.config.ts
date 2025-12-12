import {defineConfig} from "vite";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";
import mdx from "fumadocs-mdx/vite";
import {extractIconsPlugin} from "./plugins/vite-plugin-extract-icons";

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
          crawlLinks: true,
        },
      },
      pages: [
        {
          path: "/",
        },
        {
          path: "/api/search",
        },
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
