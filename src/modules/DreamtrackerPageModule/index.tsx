"use client";

import { useEffect, useState } from "react";
import { StatsBar } from "./sections/StatsBar";
import { Sidebar } from "./sections/Sidebar";
import { UniversityDetail } from "./sections/UniversityDetail";
import { FundingDetail } from "./sections/FundingDetail";
import {
  getDreamTrackerSummary,
  getDreamTrackers,
  getDreamTrackerById,
} from "@/features/dreamtracker/services/dreamtracker.service";
import {
  getMockSummary,
  getMockTrackers,
  getMockTrackerById,
} from "./mock/dreamtracker.mock";
import type { DreamFunding, DreamTrackerDashboardSummary, DreamTrackerItem } from "@/lib/api-types";
import type { ActiveView } from "./types";

// ✅ Ganti ke `false` kalau BE sudah siap
const USE_MOCK = true;

const fetchSummary = USE_MOCK ? getMockSummary : getDreamTrackerSummary;
const fetchTrackers = USE_MOCK ? getMockTrackers : getDreamTrackers;
const fetchTrackerById = USE_MOCK ? getMockTrackerById : getDreamTrackerById;

export const DreamtrackerPageModule = () => {
  const [summary, setSummary] = useState<DreamTrackerDashboardSummary | null>(null);
  const [trackers, setTrackers] = useState<DreamTrackerItem[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);

      try {
        const summaryData = await fetchSummary();
        setSummary(summaryData);
      } catch {
        setSummary(null);
      }

      try {
        const listData = await fetchTrackers();
        const items = listData.items ?? [];
        setTrackers(items);

        if (items.length > 0) {
          try {
            const detail = await fetchTrackerById(items[0].dream_tracker_id);
            setActiveView({ type: "university", tracker: detail });
          } catch {
            setActiveView({ type: "university", tracker: items[0] });
          }
        }
      } catch {
        setTrackers([]);
      }

      setIsLoading(false);
    }

    fetchInitialData();
  }, []);

  async function handleSelectUniversity(tracker: DreamTrackerItem) {
    try {
      const detail = await fetchTrackerById(tracker.dream_tracker_id);
      setActiveView({ type: "university", tracker: detail });
    } catch {
      setActiveView({ type: "university", tracker });
    }
  }

  async function handleSelectFunding(funding: DreamFunding, tracker: DreamTrackerItem) {
    try {
      const detail = await fetchTrackerById(tracker.dream_tracker_id);
      setActiveView({ type: "funding", funding, tracker: detail });
    } catch {
      setActiveView({ type: "funding", funding, tracker });
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
              <Sidebar
                trackers={trackers}
                activeView={activeView}
                onSelectUniversity={handleSelectUniversity}
                onSelectFunding={handleSelectFunding}
              />
            </aside>

            <div className="flex-1 min-w-0">
              {activeView?.type === "university" && (
                <UniversityDetail
                  tracker={activeView.tracker}
                  onSelectFunding={handleSelectFunding}
                />
              )}
              {activeView?.type === "funding" && (
                <FundingDetail
                  funding={activeView.funding}
                  tracker={activeView.tracker}
                  onBack={() =>
                    setActiveView({ type: "university", tracker: activeView.tracker })
                  }
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
