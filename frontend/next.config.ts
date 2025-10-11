import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Disable optional native dependencies not available in browsers
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

export default nextConfig;
