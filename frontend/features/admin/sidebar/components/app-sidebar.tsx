import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpenText } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { getAdminToken } from "../../auth/lib/admin-auth-storage";

const user = {
  name: "محمد رضوانی",
  email: "mohammad@example.com",
  avatar: "",
};

const token = getAdminToken();
console.log("token", token);
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="right" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenText className="size-4" />
          </div>

          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">LMS Admin</span>
            <span className="truncate text-xs text-muted-foreground">
              پنل مدیریت
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
