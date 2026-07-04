"use client";

import { Bell, Search } from "lucide-react";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex w-full items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="-mr-1" />
        <Separator orientation="vertical" className="h-5" />

        <div className="min-w-0 flex-1">
          <div className="hidden md:block">
            <AdminBreadcrumb />
          </div>

          <div className="md:hidden">
            <h1 className="truncate text-sm font-semibold">{title}</h1>
          </div>
        </div>

        <div className="hidden w-full max-w-xs items-center md:flex">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2" />
            <Input placeholder="جستجو..." className="pr-9" />
          </div>
        </div>

        <Button variant="ghost" size="icon" className="shrink-0">
          <Bell className="size-4" />
          <span className="sr-only">اعلان ها</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="size-7 rounded-lg">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="rounded-lg">MR</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:inline-flex">محمد رضوانی</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>پروفایل</DropdownMenuItem>
            <DropdownMenuItem>تنظیمات حساب</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
