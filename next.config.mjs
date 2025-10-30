// next.config.mjs
import path from "path";
import { fileURLToPath } from "url";

/* 👇 Recreate __dirname for ESM compatibility */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
