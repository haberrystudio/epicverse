import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { workerThreads: true, cpus: 3 },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
