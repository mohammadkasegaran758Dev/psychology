// import type { ReactNode } from "react";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/features/admin/sidebar/components/app-sidebar";
// import { AdminHeader } from "@/features/admin/sidebar";
// import { AdminAuthGuard } from "@/features/admin/auth/components/admin-auth-guard";
// import { getAdminToken } from "@/features/admin/auth/lib/admin-auth-storage";

// export default function AdminLayout({ children }: { children: ReactNode }) {
//   return (
//     <AdminAuthGuard>
//       <TooltipProvider delayDuration={0}>
//         <SidebarProvider defaultOpen>
//           <AppSidebar />

//           <SidebarInset>
//             <AdminHeader title="پنل مدیریت" />
//             {children}
//           </SidebarInset>
//         </SidebarProvider>
//       </TooltipProvider>
//     </AdminAuthGuard>
//   );
// }
import type { ReactNode } from "react";
import { AdminAuthGuard } from "@/features/admin/auth/components/admin-auth-guard";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}
