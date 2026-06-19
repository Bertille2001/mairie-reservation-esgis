import { Skeleton } from "@/components/ui/skeleton";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";

export default function DemandeLoading() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10 lg:py-12">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-[720px] rounded-xl" />
      </main>
      <PortalFooter />
    </div>
  );
}
