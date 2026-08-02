import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Evita que Turbopack rompa el native binding de sharp (lib/index.js vs dist/).
  serverExternalPackages: ["sharp", "@img/sharp-win32-x64"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
