"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  User,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MyLayoutProps = {
  children: ReactNode;
};

const navItems = [
  {
    title: "دوره‌های من",
    href: "/my/courses",
    icon: BookOpen,
  },
  {
    title: "سفارش‌ها",
    href: "/my/orders",
    icon: ShoppingBag,
  },
  {
    title: "پرداخت‌ها",
    href: "/my/payments",
    icon: CreditCard,
  },
];

export default function MyLayout({ children }: MyLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-l bg-card text-card-foreground">
          <div className="h-16 border-b px-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-none">حساب کاربری من</span>
              <span className="text-xs text-muted-foreground">
                {user?.name ?? "کاربر"}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 px-3 font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/95"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                      {user?.name ?? "کاربر"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      مشاهده حساب
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    داشبورد
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Top Bar */}
          <div className="md:hidden sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="h-16 px-4 flex items-center justify-between">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80">
                  <SheetHeader className="text-right">
                    <SheetTitle>حساب کاربری من</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                      return (
                        <Button
                          key={item.href}
                          asChild
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-11 px-3",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <Link href={item.href}>
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        </Button>
                      );
                    })}

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => logout()}
                      >
                        <LogOut className="h-5 w-5" />
                        خروج
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/my/courses" className="font-bold">
                پنل کاربری
              </Link>

              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
