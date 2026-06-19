import { Skeleton } from "@/components/ui/skeleton";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";

export default function SallesLoading() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 lg:py-12">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-[480px] rounded-xl" />
      </main>
      <PortalFooter />
    </div>
  );
}
