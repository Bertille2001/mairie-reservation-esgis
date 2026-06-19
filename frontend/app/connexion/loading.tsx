import { Skeleton } from "@/components/ui/skeleton";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";

export default function ConnexionLoading() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-lg space-y-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-[320px] max-w-lg rounded-xl" />
      </main>
      <PortalFooter />
    </div>
  );
}
