import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  generateBuildId: () => 'build'
};

export default nextConfig;
