import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // ⚠️ Necesario para usar `next export`
};

export default nextConfig;
