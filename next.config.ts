import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 👈 El comodín: acepta imágenes de cualquier dominio
      },
    ],
  },
};

export default nextConfig;
