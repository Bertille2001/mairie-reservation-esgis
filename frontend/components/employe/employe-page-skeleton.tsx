import { Skeleton } from "@/components/ui/skeleton";

export function EmployePageSkeleton() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="border-b border-border/60 bg-surface-elevated px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-11 w-full rounded-lg sm:w-48" />
          <Skeleton className="h-11 w-full rounded-lg sm:w-48" />
        </div>
        <Skeleton className="h-[420px] rounded-xl" />
      </main>
    </div>
  );
}
