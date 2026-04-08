"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileText,
} from "lucide-react";
import type {
  DreamTrackerItem,
  MilestoneStatus,
  SubmitRequirementResponse,
} from "@/lib/api-types";
import { RequirementCard } from "./RequirementCard";

type Props = {
  fundingId: string;
  tracker: DreamTrackerItem;
  onBack: () => void;
  onUploadSuccess?: (response: SubmitRequirementResponse) => void;
};

function milestoneStyle(status: MilestoneStatus) {
  if (status === "DONE")
    return { circle: "bg-[#f58a1f] border-[#f58a1f] text-white", label: "text-[#f58a1f]" };
  if (status === "MISSED")
    return { circle: "bg-red-100 border-red-300 text-red-400", label: "text-red-400" };
  return { circle: "bg-white border-gray-200 text-gray-400", label: "text-gray-400" };
}

export const FundingDetail = ({ fundingId, tracker, onBack, onUploadSuccess }: Props) => {
  const [showAllDocs, setShowAllDocs] = useState(false);

  const { requirements, milestones } = tracker;
  const funding = tracker.fundings.find((f) => f.funding_id === fundingId);

  const completedReqs = requirements.filter(
    (r) =>
      r.status === "VERIFIED" ||
      r.status === "VERIFIED_WITH_WARNING" ||
      r.status === "UPLOADED" ||
      r.status === "REUSED"
  ).length;
  const visibleReqs = showAllDocs ? requirements : requirements.slice(0, 2);

  if (!funding) return null;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke {tracker.program.university_name}
      </button>

      {/* Funding Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Beasiswa
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{funding.nama_beasiswa}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{funding.provider}</p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
            <BookOpen className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      {milestones.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Timeline
          </p>
          <div className="relative flex items-start justify-between">
            <div className="absolute top-4 left-0 right-0 h-px bg-gray-200" />
            {(() => {
              const doneCount = milestones.filter((m) => m.status === "DONE").length;
              const pct =
                milestones.length > 1 ? (doneCount / (milestones.length - 1)) * 100 : 0;
              return (
                <div
                  className="absolute top-4 left-0 h-px bg-[#f58a1f] transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              );
            })()}
            {milestones.map((milestone, idx) => {
              const style = milestoneStyle(milestone.status);
              return (
                <div
                  key={milestone.dream_milestone_id}
                  className="relative flex flex-col items-center gap-2"
                  style={{ width: `${100 / milestones.length}%` }}
                >
                  <div
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${style.circle}`}
                  >
                    {milestone.status === "DONE" ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium text-center leading-tight ${style.label}`}
                  >
                    {milestone.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Dokumen yang Diperlukan
          </p>
          <span className="text-xs font-medium text-gray-400">
            {completedReqs} dari {requirements.length}
          </span>
        </div>

        {requirements.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">Tidak ada dokumen yang diperlukan.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleReqs.map((req) => (
                <RequirementCard key={req.dream_req_status_id} req={req} onUploadSuccess={onUploadSuccess} />
              ))}
            </div>

            {requirements.length > 2 && (
              <button
                onClick={() => setShowAllDocs((v) => !v)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100 hover:border-orange-300"
              >
                {showAllDocs ? (
                  <>Sembunyikan <ChevronUp className="h-3.5 w-3.5" /></>
                ) : (
                  <>Lihat Semua Dokumen ({requirements.length}) <ChevronDown className="h-3.5 w-3.5" /></>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Submit Application */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Submit Application</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Fitur <span className="font-medium text-gray-500">Auto-Fill</span> akan segera hadir untuk membantu kamu mengisi form pendaftaran secara otomatis.
              </p>
            </div>
          </div>
          <button
            disabled
            className="shrink-0 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
            title="Fitur Auto-Fill akan segera hadir"
          >
            Submit Application
          </button>
        </div>
      </div>

      {/* Related university */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Universitas Terkait
        </p>
        <button
          onClick={onBack}
          className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              {tracker.program.university_name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{tracker.program.program_name}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#f58a1f] transition-colors" />
        </button>
      </div>
    </div>
  );
};
