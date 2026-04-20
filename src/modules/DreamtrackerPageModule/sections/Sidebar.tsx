"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DreamTrackerGroupedResponse } from "@/lib/api-types";
import type { ActiveView } from "../types";

type SidebarProps = {
  grouped: DreamTrackerGroupedResponse;
  activeView: ActiveView;
  onSelectUniversity: (trackerId: string) => void;
  onSelectFunding: (fundingId: string, trackerId: string) => void;
};

export const Sidebar = ({
  grouped,
  activeView,
  onSelectUniversity,
  onSelectFunding,
}: SidebarProps) => {
  const [uniOpen, setUniOpen] = useState(true);
  const [scholarOpen, setScholarOpen] = useState(true);

  const activeTrackerId =
    activeView?.type === "university" || activeView?.type === "funding"
      ? activeView.tracker.dream_tracker_id
      : activeView?.type === "funding-info"
        ? activeView.baseTracker.dream_tracker_id
        : null;
  const activeFundingId = activeView?.type === "funding" ? activeView.fundingId : null;

  function isUniversityGroupActive(trackerIds: string[]): boolean {
    return activeView?.type === "university" && activeTrackerId !== null && trackerIds.includes(activeTrackerId);
  }

  function isFundingGroupActive(fundingId: string, trackerIds: string[]): boolean {
    return activeView?.type === "funding" && activeFundingId === fundingId && activeTrackerId !== null && trackerIds.includes(activeTrackerId);
  }

  function pickUniversityTracker(
    items: DreamTrackerGroupedResponse["universities"][number]["items"]
  ) {
    return items.find((item) => item.is_selected) ?? items[0];
  }

  function pickFundingTracker(
    items: DreamTrackerGroupedResponse["fundings"][number]["items"]
  ) {
    return items.find((item) => item.is_selected) ?? items[0];
  }

  // Find which funding_name a tracker belongs to (for university sub-items)
  const trackerFundingName = new Map<string, string>();
  grouped.fundings.forEach((f) => {
    f.items.forEach((item) => {
      trackerFundingName.set(item.dream_tracker_id, f.funding_name);
    });
  });

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
        <ul className="mb-1 space-y-1">
          {grouped.universities.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">Belum ada tracker</li>
          )}
          {grouped.universities.map((university, index) => (
            <li key={`${university.university_id || university.university_name || "university"}-${index}`}>
              {(() => {
                const tracker = pickUniversityTracker(university.items);
                const trackerIds = university.items.map((item) => item.dream_tracker_id);
                const fundingLabel = trackerFundingName.get(tracker.dream_tracker_id);
                const active = isUniversityGroupActive(trackerIds);

                return (
                  <button
                    onClick={() => onSelectUniversity(tracker.dream_tracker_id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-150 ${
                      active
                        ? "bg-[#f58a1f] text-white"
                        : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="block text-sm font-semibold truncate">
                      {university.university_name}
                    </span>
                    <span className={`mt-0.5 block text-xs truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                      {tracker.program_name}
                    </span>
                    <span className={`block text-[10px] truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                      {fundingLabel ? `Pendanaan aktif: ${fundingLabel}` : `${tracker.completion_percentage}% selesai`}
                    </span>
                  </button>
                );
              })()}
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
        <ul className="space-y-1">
          {grouped.fundings.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">Belum ada beasiswa</li>
          )}
          {grouped.fundings.map((funding, index) => (
            <li key={`${funding.funding_id || funding.funding_name || "funding"}-${index}`}>
              {(() => {
                const tracker = pickFundingTracker(funding.items);
                const trackerIds = funding.items.map((item) => item.dream_tracker_id);
                const active = isFundingGroupActive(funding.funding_id, trackerIds);

                return (
                  <button
                    onClick={() => onSelectFunding(funding.funding_id, tracker.dream_tracker_id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-150 ${
                      active
                        ? "bg-[#f58a1f] text-white"
                        : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="block text-sm font-semibold truncate">
                      {funding.funding_name}
                    </span>
                    <span className={`mt-0.5 block text-xs truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                      {tracker.university_name}
                    </span>
                    <span className={`block text-[10px] truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                      {tracker.completion_percentage}% selesai
                    </span>
                  </button>
                );
              })()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
