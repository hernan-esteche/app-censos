import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		// Si estás en una versión que usa experimental, o directamente en la raíz:
	},
	allowedDevOrigins: [
		"192.168.56.1",
		"localhost:3000",
		"192.168.0.13",
		"192.168.0.19",
		"192.168.100.7",
		"192.168.0.11:3000",
		"192.168.0.*:3000",
		"192.168.0.11",
	],
};

export default nextConfig;
