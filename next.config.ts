import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Si estás en una versión que usa experimental, o directamente en la raíz:
  },
  allowedDevOrigins: ['192.168.56.1', 'localhost:3000'],
};

export default nextConfig;