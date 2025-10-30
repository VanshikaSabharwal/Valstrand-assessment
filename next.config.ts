import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// 👇 Define __dirname manually (for ESM support)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
