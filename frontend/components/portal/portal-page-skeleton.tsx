import { Skeleton } from "@/components/ui/skeleton";

export function PortalPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:py-12">
      <section className="max-w-3xl space-y-3">
        <Skeleton className="h-9 w-full max-w-lg" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10">
        <Skeleton className="h-[420px] rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-[360px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
