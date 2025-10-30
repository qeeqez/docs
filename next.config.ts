import {createMDX} from "fumadocs-mdx/next";
import type {NextConfig} from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.map": {
        loaders: ["raw-loader"],
      },
    },
  },
};

export default withMDX(nextConfig);
