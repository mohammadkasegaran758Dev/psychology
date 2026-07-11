"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAdminMe } from "../hooks/use-admin-me";
import { getAdminToken, removeAdminToken } from "../lib/admin-auth-storage";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = getAdminToken();

  const { data, isLoading, isError } = useAdminMe();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (!isLoading && (isError || !data)) {
      removeAdminToken();
      router.replace("/admin/login");
    }
  }, [pathname, token, isLoading, isError, data, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!token || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return <>{children}</>;
}
