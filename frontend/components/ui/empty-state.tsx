import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-surface-elevated px-6 py-14 text-center shadow-panel",
        className,
      )}
    >
      <Icon
        className="size-8 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="font-medium text-foreground text-sm">{title}</p>
      {description ? (
        <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
