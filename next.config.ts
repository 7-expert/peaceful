import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile devices on local network to access dev resources
  // Without this, JS/CSS are blocked and nothing works on mobile
  allowedDevOrigins: [
    '192.168.100.130',
    '192.168.100.*',
    '192.168.*.*',
  ],
};

export default nextConfig;
