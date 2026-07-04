import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/sidebar/components/app-sidebar";
import { AdminHeader } from "@/features/admin/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen>
        <AppSidebar />

        <SidebarInset>
          <AdminHeader title="پنل مدیریت" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
