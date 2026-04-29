import { Suspense } from "react";
import { DreamtrackerPageModule } from "@/modules/DreamtrackerPageModule";

export default function DreamtrackerPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf8f4]">
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f58a1f] border-t-transparent" />
          </div>
        </main>
      }
    >
      <DreamtrackerPageModule />
    </Suspense>
  );
}
