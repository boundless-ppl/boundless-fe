"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StatsBar } from "./sections/StatsBar";
import { Sidebar } from "./sections/Sidebar";
import { UniversityDetail } from "./sections/UniversityDetail";
import { FundingDetail } from "./sections/FundingDetail";
import { FundingInfoView } from "./sections/FundingInfoView";
import { useUserData } from "@/hooks/useUserData";
import {
  createDreamTracker,
  getDreamTrackerSummary,
  getDreamTrackersGrouped,
  getDreamTrackerById,
} from "@/features/dreamtracker/services/dreamtracker.service";
import type {
  DreamFunding,
  DreamTrackerDashboardSummary,
  DreamTrackerGroupedResponse,
} from "@/lib/api-types";
import type { ActiveView } from "./types";

const fetchSummary = getDreamTrackerSummary;
const fetchGrouped = getDreamTrackersGrouped;
const fetchTrackerById = getDreamTrackerById;

export const DreamtrackerPageModule = () => {
  const { isPremium, isAuthenticated } = useUserData();
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<DreamTrackerDashboardSummary | null>(null);
  const [grouped, setGrouped] = useState<DreamTrackerGroupedResponse | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitialData() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
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

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
      } else {
        setErrorMessage("Gagal memuat ringkasan dream tracker. Coba refresh halaman.");
      }

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
  }, [isAuthenticated, searchParams]);

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
      if (activeView.type === "university") {
        const detail = await fetchTrackerById(activeView.tracker.dream_tracker_id);
        setActiveView({ type: "university", tracker: detail });
      } else if (activeView.type === "funding") {
        const detail = await fetchTrackerById(activeView.tracker.dream_tracker_id);
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

  async function handleAddFunding(baseTrackerId: string, funding: DreamFunding) {
    try {
      const baseTracker = await fetchTrackerById(baseTrackerId);
      const response = await createDreamTracker({
        program_id: baseTracker.program.program_id,
        funding_id: funding.funding_id,
        scholarship_name: funding.nama_beasiswa,
        source_type: "DREAMTRACKER",
      });

      const [detail, refreshedGrouped, refreshedSummary] = await Promise.all([
        fetchTrackerById(response.dream_tracker_id),
        fetchGrouped({ selected_dream_tracker_id: response.dream_tracker_id }),
        fetchSummary(),
      ]);

      setGrouped(refreshedGrouped);
      setSummary(refreshedSummary);
      setActiveView({ type: "funding", fundingId: funding.funding_id, tracker: detail });
      setErrorMessage(null);
    } catch {
      setErrorMessage("Gagal menambahkan beasiswa ke Dreamtracker. Coba lagi.");
    }
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#faf8f4] px-4 py-10 md:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_40px_rgba(31,31,31,0.06)]">
          <h1 className="text-2xl font-semibold text-[#1f2937]">
            Dreamtracker hanya untuk pengguna premium
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#6b7280]">
            Upgrade ke premium untuk membuka fitur Dreamtracker dan memantau progress
            aplikasi Anda secara lengkap.
          </p>
          <Link
            href="/payment"
            className="mt-6 inline-flex rounded-2xl bg-[#f58a1f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#dd7611]"
          >
            Subscribe Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <StatsBar summary={summary} isLoading={isLoading} />
      {errorMessage && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        </div>
      )}

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
                  onSelectFunding={(funding, baseTracker) => {
                    if (funding.status === "SELECTED" && grouped) {
                      const fundingGroup = grouped.fundings.find(
                        (f) => f.funding_id === funding.funding_id
                      );
                      if (fundingGroup?.items.length) {
                        void handleSelectFunding(
                          funding.funding_id,
                          fundingGroup.items[0].dream_tracker_id
                        );
                        return;
                      }
                    }
                    setActiveView({ type: "funding-info", funding, baseTracker });
                  }}
                  onAddFunding={handleAddFunding}
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
              {activeView?.type === "funding-info" && (
                <FundingInfoView
                  funding={activeView.funding}
                  baseTracker={activeView.baseTracker}
                  onBack={() =>
                    setActiveView({ type: "university", tracker: activeView.baseTracker })
                  }
                  onAddFunding={handleAddFunding}
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
