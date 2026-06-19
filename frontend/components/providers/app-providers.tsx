"use client";

import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider position="top-center" timeout={5000}>
      {children}
    </ToastProvider>
  );
}
