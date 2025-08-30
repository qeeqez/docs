import {createMDX} from 'fumadocs-mdx/next';
import type {NextConfig} from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
};

export default withMDX(nextConfig);