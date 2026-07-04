import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت LMS روانشناسی",
  description: "سیستم مدیریت یادگیری و دوره‌های آموزشی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-background antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
