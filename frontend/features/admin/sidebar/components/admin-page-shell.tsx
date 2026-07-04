import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function AdminPageShell({
  children,
  title,
  description,
  action,
  className,
}: AdminPageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6",
        className,
      )}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            ) : null}
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}

      {children}
    </div>
  );
}
