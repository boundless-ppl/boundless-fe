"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth-context";

export function AuthHydrationGate({ children }: Readonly<{ children: ReactNode }>) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f58a1f] border-t-transparent" />
      </main>
    );
  }

  return <>{children}</>;
}
