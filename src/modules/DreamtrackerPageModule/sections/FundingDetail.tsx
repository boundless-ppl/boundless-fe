"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileText,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type {
  DreamFunding,
  DreamRequirement,
  DreamRequirementStatus,
  DreamTrackerItem,
  FundingType,
  MilestoneStatus,
} from "@/lib/api-types";

type Props = {
  funding: DreamFunding;
  tracker: DreamTrackerItem;
  onBack: () => void;
};

const FUNDING_TYPE_LABEL: Record<FundingType, string> = {
  SCHOLARSHIP: "Beasiswa",
  SELF_FUNDED: "Mandiri",
  ASSISTANTSHIP: "Assistantship",
  LOAN: "Pinjaman",
  SPONSORSHIP: "Sponsorship",
};

const FUNDING_TYPE_STYLE: Record<FundingType, string> = {
  SCHOLARSHIP: "bg-green-50 text-green-600 border-green-100",
  SELF_FUNDED: "bg-gray-50 text-gray-500 border-gray-200",
  ASSISTANTSHIP: "bg-blue-50 text-blue-600 border-blue-100",
  LOAN: "bg-yellow-50 text-yellow-600 border-yellow-100",
  SPONSORSHIP: "bg-purple-50 text-purple-600 border-purple-100",
};

function reqStatusIcon(status: DreamRequirementStatus) {
  if (status === "VERIFIED") return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
  if (status === "UPLOADED") return <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />;
  if (status === "REJECTED") return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
  return <FileText className="h-4 w-4 text-gray-300 shrink-0" />;
}

function reqStatusBg(status: DreamRequirementStatus) {
  if (status === "VERIFIED") return "bg-green-50 border-green-100";
  if (status === "UPLOADED") return "bg-blue-50 border-blue-100";
  if (status === "REJECTED") return "bg-red-50 border-red-100";
  return "bg-gray-50 border-gray-100";
}

function milestoneStyle(status: MilestoneStatus) {
  if (status === "DONE")
    return { circle: "bg-[#f58a1f] border-[#f58a1f] text-white", label: "text-[#f58a1f]" };
  if (status === "MISSED")
    return { circle: "bg-red-100 border-red-300 text-red-400", label: "text-red-400" };
  return { circle: "bg-white border-gray-200 text-gray-400", label: "text-gray-400" };
}

function reqNote(req: DreamRequirement): string | null {
  if (req.notes) return req.notes;
  if (req.message) return req.message;
  if (req.status_label) return req.status_label;
  return null;
}

export const FundingDetail = ({ funding, tracker, onBack }: Props) => {
  const [showAllDocs, setShowAllDocs] = useState(false);

  const { requirements, milestones, summary } = tracker;
  const visibleReqs = showAllDocs ? requirements : requirements.slice(0, 2);

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

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${FUNDING_TYPE_STYLE[funding.tipe_pembiayaan]}`}
              >
                {FUNDING_TYPE_LABEL[funding.tipe_pembiayaan]}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  funding.status === "SELECTED"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {funding.status === "SELECTED" ? "Dipilih" : "Tersedia"}
              </span>
            </div>

            {funding.deskripsi && (
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{funding.deskripsi}</p>
            )}
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
            <BookOpen className="h-6 w-6 text-green-500" />
          </div>
        </div>

        {funding.website && (
          <a
            href={funding.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#f58a1f] hover:underline"
          >
            Lihat Info Beasiswa <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
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
            {summary.completed_requirements} of {summary.total_requirements}
          </span>
        </div>

        {requirements.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">Tidak ada dokumen yang diperlukan.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleReqs.map((req) => (
                <div
                  key={req.dream_req_status_id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${reqStatusBg(req.status)}`}
                >
                  {reqStatusIcon(req.status)}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {req.label || req.requirement_label}
                    </p>
                    {reqNote(req) && (
                      <p className="text-xs text-gray-400 truncate">{reqNote(req)}</p>
                    )}
                  </div>
                  {req.can_upload && (
                    <button className="ml-auto shrink-0 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-orange-300 hover:text-[#f58a1f] transition-colors">
                      {req.action_label}
                    </button>
                  )}
                </div>
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

      {/* Submit to scholarship */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
              <BookOpen className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Submit Beasiswa</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Daftarkan beasiswa {funding.nama_beasiswa} melalui portal resminya.
              </p>
            </div>
          </div>
          {funding.website ? (
            <a
              href={funding.website}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-gradient-to-b from-[#4CAF7C] to-[#388E5E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity text-center"
            >
              Daftar Sekarang
            </a>
          ) : (
            <button
              disabled
              className="shrink-0 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
            >
              Daftar Sekarang
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
