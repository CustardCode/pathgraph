import type { NextConfig } from "next";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = configuredBasePath && configuredBasePath !== "/"
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  // Keep SEO metadata in the initial <head> for search and social crawlers.
  // Human browsers can still use Next's normal streamed metadata path.
  htmlLimitedBots: /bot|crawler|spider|crawling/i,
};

export default nextConfig;
