import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "export",
    images: {
        unoptimized: true,
    },
    productionBrowserSourceMaps: false,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.map$/,
            use: "ignore-loader",
        });
        return config;
    },
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
            "*.map": {
                loaders: ["ignore-loader"],
            },
        },
    },
};

export default withMDX(nextConfig);
