import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";
const isGithubPages = process.env.GITHUB_ACTIONS === "true" && !isVercel;
const isStaticExport = isGithubPages || process.env.STATIC_EXPORT === "1";

const basePath = isGithubPages ? "/HoldTranslate-web" : (process.env.NEXT_PUBLIC_BASE_PATH || "");

const nextConfig: NextConfig = {
  // Use static export for GitHub Pages, native serverless/edge mode on Vercel
  output: isStaticExport ? "export" : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: isStaticExport,
  },
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isStaticExport,
};

export default nextConfig;
