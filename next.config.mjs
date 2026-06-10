/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output for self-hosted Docker / Coolify deployments:
  // produces a self-contained server in `.next/standalone` that the
  // Dockerfile copies. The image ends up ~150 MB instead of ~500 MB
  // because only the runtime deps make it in.
  output: "standalone",
  experimental: {
    // Don't bundle these into the server bundle — let Node resolve
    // them from the runtime node_modules. pdfjs-dist (used by
    // `unpdf`) ships a worker file and conditional requires that
    // don't survive bundling.
    serverComponentsExternalPackages: ["unpdf"],
  },
};

export default nextConfig;
