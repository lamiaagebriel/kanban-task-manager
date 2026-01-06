import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

const nextConfig: NextConfig = {
  images: { remotePatterns },
  reactCompiler: true,
};

export default nextConfig;
