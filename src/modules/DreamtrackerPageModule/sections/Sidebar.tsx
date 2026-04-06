"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DreamFunding, DreamTrackerItem } from "@/lib/api-types";
import type { ActiveView } from "../types";

type SidebarProps = {
  trackers: DreamTrackerItem[];
  activeView: ActiveView;
  onSelectUniversity: (tracker: DreamTrackerItem) => void;
  onSelectFunding: (funding: DreamFunding, tracker: DreamTrackerItem) => void;
};

export const Sidebar = ({
  trackers,
  activeView,
  onSelectUniversity,
  onSelectFunding,
}: SidebarProps) => {
  const [uniOpen, setUniOpen] = useState(true);
  const [scholarOpen, setScholarOpen] = useState(true);

  // Deduplicate universities — one entry per unique university name
  const universities = Array.from(
    new Map(trackers.map((t) => [t.program.university_name, t])).values()
  );

  // All unique fundings across all trackers
  const allFundings = Array.from(
    new Map(
      trackers.flatMap((t) =>
        t.fundings.map((f) => [f.funding_id, { funding: f, tracker: t }])
      )
    ).values()
  );

  // Relationship maps for cross-highlight
  const uniToFundingIds = new Map<string, Set<string>>();
  const fundingToUniNames = new Map<string, Set<string>>();
  trackers.forEach((t) => {
    const uniName = t.program.university_name;
    if (!uniToFundingIds.has(uniName)) uniToFundingIds.set(uniName, new Set());
    t.fundings.forEach((f) => {
      uniToFundingIds.get(uniName)!.add(f.funding_id);
      if (!fundingToUniNames.has(f.funding_id)) fundingToUniNames.set(f.funding_id, new Set());
      fundingToUniNames.get(f.funding_id)!.add(uniName);
    });
  });

  // Derive active IDs from activeView
  const activeUniName =
    activeView?.type === "university"
      ? activeView.tracker.program.university_name
      : activeView?.type === "funding"
      ? activeView.tracker.program.university_name  // still highlight related uni subtly
      : null;

  const activeFundingId =
    activeView?.type === "funding" ? activeView.funding.funding_id : null;

  function getUniStyle(uniName: string) {
    // Exact active university
    if (activeView?.type === "university" && activeUniName === uniName) {
      return "bg-[#f58a1f] text-white";
    }
    // Related university when a funding is active
    if (activeView?.type === "funding" && activeFundingId) {
      const linked = fundingToUniNames.get(activeFundingId);
      if (linked?.has(uniName)) {
        return "bg-orange-50 text-orange-600 hover:bg-orange-100";
      }
    }
    return "text-gray-600 hover:bg-orange-50 hover:text-orange-600";
  }

  function getFundingStyle(fundingId: string) {
    // Exact active funding
    if (activeView?.type === "funding" && activeFundingId === fundingId) {
      return "bg-[#f58a1f] text-white";
    }
    // Related funding when a university is active
    if (activeView?.type === "university" && activeUniName) {
      const linked = uniToFundingIds.get(activeUniName);
      if (linked?.has(fundingId)) {
        return "bg-orange-50 text-orange-600 hover:bg-orange-100";
      }
    }
    return "text-gray-600 hover:bg-orange-50 hover:text-orange-600";
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      {/* Universities */}
      <button
        onClick={() => setUniOpen((v) => !v)}
        className="flex w-full items-center justify-between mb-2 group"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">
          Universitas
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
            uniOpen ? "" : "-rotate-90"
          }`}
        />
      </button>

      {uniOpen && (
        <ul className="mb-1 space-y-0.5">
          {universities.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">Belum ada tracker</li>
          )}
          {universities.map((tracker) => (
            <li key={tracker.dream_tracker_id}>
              <button
                onClick={() => onSelectUniversity(tracker)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ${getUniStyle(
                  tracker.program.university_name
                )}`}
              >
                {tracker.program.university_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="my-3 border-t border-gray-100" />

      {/* Scholarships */}
      <button
        onClick={() => setScholarOpen((v) => !v)}
        className="flex w-full items-center justify-between mb-2 group"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors">
          Beasiswa
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
            scholarOpen ? "" : "-rotate-90"
          }`}
        />
      </button>

      {scholarOpen && (
        <ul className="space-y-0.5">
          {allFundings.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">Belum ada beasiswa</li>
          )}
          {allFundings.map(({ funding, tracker }) => (
            <li key={funding.funding_id}>
              <button
                onClick={() => onSelectFunding(funding, tracker)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ${getFundingStyle(
                  funding.funding_id
                )}`}
              >
                {funding.nama_beasiswa}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
