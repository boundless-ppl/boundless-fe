"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  FileText,
} from "lucide-react";
import type {
  DreamFunding,
  DreamTrackerItem,
  MilestoneStatus,
} from "@/lib/api-types";
import { RequirementCard } from "./RequirementCard";

type Props = {
  funding: DreamFunding;
  tracker: DreamTrackerItem;
  onBack: () => void;
};

function milestoneStyle(status: MilestoneStatus) {
  if (status === "DONE")
    return { circle: "bg-[#f58a1f] border-[#f58a1f] text-white", label: "text-[#f58a1f]" };
  if (status === "MISSED")
    return { circle: "bg-red-100 border-red-300 text-red-400", label: "text-red-400" };
  return { circle: "bg-white border-gray-200 text-gray-400", label: "text-gray-400" };
}

export const FundingDetail = ({ funding, tracker, onBack }: Props) => {
  const [showAllDocs, setShowAllDocs] = useState(false);

  const { requirements, milestones, summary } = tracker;
  const fundingReqs = requirements.some((r) => r.source_type)
    ? requirements.filter((r) => r.source_type === "FUNDING")
    : requirements;
  const completedFundingReqs = fundingReqs.filter((r) => r.status === "VERIFIED" || r.status === "UPLOADED").length;
  const visibleReqs = showAllDocs ? fundingReqs : fundingReqs.slice(0, 2);

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

            {funding.website && (
              <a
                href={funding.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#f58a1f] hover:underline"
              >
                Lihat Info Beasiswa <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
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
            {completedFundingReqs} dari {fundingReqs.length}
          </span>
        </div>

        {fundingReqs.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">Tidak ada dokumen yang diperlukan.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleReqs.map((req) => (
                <RequirementCard key={req.dream_req_status_id} req={req} />
              ))}
            </div>

            {fundingReqs.length > 2 && (
              <button
                onClick={() => setShowAllDocs((v) => !v)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100 hover:border-orange-300"
              >
                {showAllDocs ? (
                  <>Sembunyikan <ChevronUp className="h-3.5 w-3.5" /></>
                ) : (
                  <>Lihat Semua Dokumen ({fundingReqs.length}) <ChevronDown className="h-3.5 w-3.5" /></>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Submit Beasiswa */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Submit Beasiswa</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Kamu bisa unduh{" "}
                <span className="font-medium text-gray-500">Auto-Fill Extension</span>{" "}
                (Chrome) untuk mengisi form otomatis menggunakan data yang sudah kamu input di Boundless.
              </p>
            </div>
          </div>
          {funding.website ? (
            <a
              href={funding.website}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-gradient-to-b from-[#6A6FD4] to-[#4A4FB8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity text-center"
            >
              Submit Sekarang
            </a>
          ) : (
            <button
              disabled
              className="shrink-0 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
            >
              Submit Sekarang
            </button>
          )}
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

      {/* Deadline notice */}
      {summary.is_deadline_near && !summary.is_overdue && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
            Deadline Mendekat
          </p>
          <p className="text-sm text-orange-600">
            Deadline beasiswa {funding.nama_beasiswa} semakin dekat. Segera lengkapi semua dokumen.
          </p>
        </div>
      )}
      {summary.is_overdue && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">
                Lewat Deadline
              </p>
              <p className="text-sm text-red-600">
                Deadline beasiswa {funding.nama_beasiswa} sudah terlewat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
