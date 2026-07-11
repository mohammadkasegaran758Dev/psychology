"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/sidebar/components/app-sidebar";
import { AdminHeader } from "@/features/admin/sidebar";
import { getAdminToken } from "../auth/lib/admin-auth-storage";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const token = getAdminToken();
  if (pathname === "/admin/login") {
    return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
  }

  return (
    <>
      {token && (
        <TooltipProvider delayDuration={0}>
          <SidebarProvider defaultOpen>
            <AppSidebar />
            <SidebarInset>
              <AdminHeader title="پنل مدیریت" />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      )}
    </>
  );
}
