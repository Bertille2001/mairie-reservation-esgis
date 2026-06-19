import { Skeleton } from "@/components/ui/skeleton";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";

export default function SalleDetailLoading() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10 lg:py-12">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-2/3 max-w-lg" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </main>
      <PortalFooter />
    </div>
  );
}
