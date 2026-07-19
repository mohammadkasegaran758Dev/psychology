// src/components/layout/header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            پلتفرم LMS روانشناسی
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link
              href="/courses"
              className="text-muted-foreground hover:text-foreground"
            >
              دوره‌ها
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="w-4 h-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    داشبورد من
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-500 cursor-pointer gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline">ورود</Button>
              </Link>
              <Link href="/register">
                <Button>ثبت‌نام</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
