import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ハイドレーションエラー対策
  reactStrictMode: true,
  
  // 実験的な機能でハイドレーション改善
  experimental: {
    optimizeCss: false, // CSS最適化を無効化してハイドレーション問題を回避
  },
  
  // 開発環境でのエラー表示を詳細化
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
