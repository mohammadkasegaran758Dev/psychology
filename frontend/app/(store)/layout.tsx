// app/(store)/layout.tsx
import type { ReactNode } from "react";

import { Header } from "@/components/layout/header"; // اگر مسیر دیگری دارد، اصلاح کن
// import { Footer } from "@/components/layout/footer"; // اگر Footer نداری، این import و JSX را حذف کن
import { AppProvider } from "@/providers/app-provider"; // اگر در Providers ریشه‌ای هست، این را هم می‌توانی حذف کنی

type StoreLayoutProps = {
  children: ReactNode;
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        {/* Header عمومی فروشگاه */}
        <Header />

        {/* محتوای صفحه‌ها */}
        <main className="flex-1">{children}</main>

        {/* Footer فروشگاه - در صورت وجود */}
        {/* <Footer /> */}
      </div>
    </AppProvider>
  );
}
