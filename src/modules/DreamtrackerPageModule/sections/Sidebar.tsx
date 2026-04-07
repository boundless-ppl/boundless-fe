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

  const activeTrackerId = activeView?.tracker.dream_tracker_id ?? null;
  const activeFundingId = activeView?.type === "funding" ? activeView.fundingId : null;

  function isTrackerActive(trackerId: string): boolean {
    return activeTrackerId === trackerId && activeView?.type === "university";
  }

  function isFundingItemActive(fundingId: string, trackerId: string): boolean {
    return activeFundingId === fundingId && activeTrackerId === trackerId;
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
          {grouped.universities.map((university) => (
            <li key={university.university_id}>
              {/* University group label */}
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 truncate">
                {university.university_name}
              </p>
              {/* Sub-items: one per tracker (funding pair) */}
              <ul className="space-y-0.5 ml-2">
                {university.items.map((item) => {
                  const fundingLabel = trackerFundingName.get(item.dream_tracker_id);
                  const active = isTrackerActive(item.dream_tracker_id);
                  return (
                    <li key={item.dream_tracker_id}>
                      <button
                        onClick={() => onSelectUniversity(item.dream_tracker_id)}
                        className={`w-full rounded-lg px-3 py-1.5 text-left transition-colors duration-150 ${
                          active
                            ? "bg-[#f58a1f] text-white"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        <span className="block text-xs font-medium truncate">
                          {fundingLabel ?? item.program_name}
                        </span>
                        <span className={`block text-[10px] truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                          {item.completion_percentage}% selesai
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
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
          {grouped.fundings.map((funding) => (
            <li key={funding.funding_id}>
              {/* Funding group label */}
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 truncate">
                {funding.funding_name}
              </p>
              {/* Sub-items: one per tracker (university pair) */}
              <ul className="space-y-0.5 ml-2">
                {funding.items.map((item) => {
                  const active = isFundingItemActive(funding.funding_id, item.dream_tracker_id);
                  return (
                    <li key={item.dream_tracker_id}>
                      <button
                        onClick={() => onSelectFunding(funding.funding_id, item.dream_tracker_id)}
                        className={`w-full rounded-lg px-3 py-1.5 text-left transition-colors duration-150 ${
                          active
                            ? "bg-[#f58a1f] text-white"
                            : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        <span className="block text-xs font-medium truncate">
                          {item.university_name}
                        </span>
                        <span className={`block text-[10px] truncate ${active ? "text-orange-100" : "text-gray-400"}`}>
                          {item.completion_percentage}% selesai
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
