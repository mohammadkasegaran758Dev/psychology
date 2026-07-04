// src/components/admin/layout/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/config/admin-nav";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-l bg-card text-card-foreground h-screen sticky top-0">
      {/* هدر سایدبار / لوگو */}
      <div className="h-16 flex items-center gap-2 px-6 border-b">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg tracking-tight">پنل مدیریت LMS</span>
      </div>

      {/* منوی ناوبری */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/95"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* بخش پایین سایدبار / اطلاعات پروفایل ادمین */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            م‌ر
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">محمد رضوانی</span>
            <span className="text-xs text-muted-foreground">مدیر سیستم</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
