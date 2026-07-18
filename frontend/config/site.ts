// src/config/site.ts
export const siteConfig = {
  name: "LMS Storefront",
  description: "Online courses storefront built with Next.js",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultLocale: "fa",
  direction: "rtl" as const,
};

export type SiteConfig = typeof siteConfig;
