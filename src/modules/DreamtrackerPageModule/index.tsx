"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StatsBar } from "./sections/StatsBar";
import { Sidebar } from "./sections/Sidebar";
import { UniversityDetail } from "./sections/UniversityDetail";
import { FundingDetail } from "./sections/FundingDetail";
import {
  getDreamTrackerSummary,
  getDreamTrackersGrouped,
  getDreamTrackerById,
} from "@/features/dreamtracker/services/dreamtracker.service";
import type {
  DreamTrackerDashboardSummary,
  DreamTrackerGroupedResponse,
} from "@/lib/api-types";
import type { ActiveView } from "./types";

const fetchSummary = getDreamTrackerSummary;
const fetchGrouped = getDreamTrackersGrouped;
const fetchTrackerById = getDreamTrackerById;

export const DreamtrackerPageModule = () => {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<DreamTrackerDashboardSummary | null>(null);
  const [grouped, setGrouped] = useState<DreamTrackerGroupedResponse | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      const selectedTrackerId = searchParams.get("tracker");
      const selectedFundingId = searchParams.get("funding");
      const selectedView = searchParams.get("view");

      const [summaryResult, groupedResult] = await Promise.allSettled([
        fetchSummary(),
        fetchGrouped({
          include_default_detail: !selectedTrackerId,
          selected_dream_tracker_id: selectedTrackerId ?? undefined,
        }),
      ]);

      if (summaryResult.status === "fulfilled") setSummary(summaryResult.value);
      if (groupedResult.status === "fulfilled") {
        const g = groupedResult.value;
        setGrouped(g);

        if (selectedTrackerId) {
          try {
            const detail = await fetchTrackerById(selectedTrackerId);
            if (selectedView === "funding" && selectedFundingId) {
              setActiveView({ type: "funding", fundingId: selectedFundingId, tracker: detail });
            } else {
              setActiveView({ type: "university", tracker: detail });
            }
          } catch {
            // fall back to backend defaults when the requested tracker is unavailable
          }
        }

        if (!selectedTrackerId) {
          if (g.default_detail) {
            setActiveView({ type: "university", tracker: g.default_detail });
          } else if (g.default_selected_dream_tracker_id) {
            try {
              const detail = await fetchTrackerById(g.default_selected_dream_tracker_id);
              setActiveView({ type: "university", tracker: detail });
            } catch {
              // no default detail available
            }
          }
        }
      }

      setIsLoading(false);
    }

    fetchInitialData();
  }, [searchParams]);

  async function handleSelectUniversity(trackerId: string) {
    try {
      const detail = await fetchTrackerById(trackerId);
      setActiveView({ type: "university", tracker: detail });
    } catch {
      // keep current view
    }
  }

  async function handleUploadSuccess() {
    if (!activeView) return;
    try {
      const detail = await fetchTrackerById(activeView.tracker.dream_tracker_id);
      if (activeView.type === "university") {
        setActiveView({ type: "university", tracker: detail });
      } else {
        setActiveView({ type: "funding", fundingId: activeView.fundingId, tracker: detail });
      }
    } catch {
      // keep current view
    }
  }

  async function handleSelectFunding(fundingId: string, trackerId: string) {
    try {
      const detail = await fetchTrackerById(trackerId);
      setActiveView({ type: "funding", fundingId, tracker: detail });
    } catch {
      // keep current view
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <StatsBar summary={summary} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f58a1f] border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="w-full lg:w-56 shrink-0">
              {grouped && (
                <Sidebar
                  grouped={grouped}
                  activeView={activeView}
                  onSelectUniversity={handleSelectUniversity}
                  onSelectFunding={handleSelectFunding}
                />
              )}
            </aside>

            <div className="flex-1 min-w-0">
              {activeView?.type === "university" && (
                <UniversityDetail
                  tracker={activeView.tracker}
                  onSelectFunding={(funding, tracker) =>
                    setActiveView({ type: "funding", fundingId: funding.funding_id, tracker })
                  }
                  onUploadSuccess={handleUploadSuccess}
                />
              )}
              {activeView?.type === "funding" && (
                <FundingDetail
                  fundingId={activeView.fundingId}
                  tracker={activeView.tracker}
                  onBack={() =>
                    setActiveView({ type: "university", tracker: activeView.tracker })
                  }
                  onUploadSuccess={handleUploadSuccess}
                />
              )}
              {!activeView && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
                  <p className="text-base font-medium text-gray-400">Belum ada dream tracker.</p>
                  <p className="mt-1 text-sm text-gray-300">
                    Tambahkan program impianmu untuk mulai melacak progress.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
