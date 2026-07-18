// src/app/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { AppProvider } from "@/providers/app-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.defaultLocale} dir={siteConfig.direction}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
