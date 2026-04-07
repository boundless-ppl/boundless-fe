"use client";

import { useState } from "react";
import {
  Award,
  ChevronRight,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { DreamFunding, DreamTrackerItem, MilestoneStatus, SubmitRequirementResponse } from "@/lib/api-types";
import { RequirementCard } from "./RequirementCard";

type Props = {
  tracker: DreamTrackerItem;
  onSelectFunding: (funding: DreamFunding, tracker: DreamTrackerItem) => void;
  onUploadSuccess?: (response: SubmitRequirementResponse) => void;
};

function milestoneStyle(status: MilestoneStatus) {
  if (status === "DONE") return { circle: "bg-[#f58a1f] border-[#f58a1f] text-white", label: "text-[#f58a1f]" };
  if (status === "MISSED") return { circle: "bg-red-100 border-red-300 text-red-400", label: "text-red-400" };
  return { circle: "bg-white border-gray-200 text-gray-400", label: "text-gray-400" };
}

export const UniversityDetail = ({ tracker, onSelectFunding, onUploadSuccess }: Props) => {
  const [showAllDocs, setShowAllDocs] = useState(false);

  const { program, requirements, milestones, fundings } = tracker;
  const completedAdmissionReqs = requirements.filter(
    (r) => r.status === "VERIFIED" || r.status === "UPLOADED" || r.status === "REUSED"
  ).length;
  const visibleReqs = showAllDocs ? requirements : requirements.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* University Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Universitas
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{program.university_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{program.program_name}</p>
            <button className="mt-1 flex items-center gap-1 text-sm text-[#f58a1f] hover:underline">
              Detail <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50">
            <Award className="h-6 w-6 text-[#f58a1f]" />
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
            {/* base line */}
            <div className="absolute top-4 left-0 right-0 h-px bg-gray-200" />
            {/* progress line */}
            {(() => {
              const doneCount = milestones.filter((m) => m.status === "DONE").length;
              const pct = milestones.length > 1
                ? (doneCount / (milestones.length - 1)) * 100
                : 0;
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
                  <span className={`text-xs font-medium text-center leading-tight ${style.label}`}>
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
            {completedAdmissionReqs} dari {requirements.length}
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
          {program.admission_url ? (
            <a
              href={program.admission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-gradient-to-b from-[#6A6FD4] to-[#4A4FB8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity text-center"
            >
              Submit Application
            </a>
          ) : (
            <button
              disabled
              className="shrink-0 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
              title="Fitur Auto-Fill akan segera hadir"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>

      {/* Pendanaan Tersedia */}
      {fundings.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Pendanaan Tersedia
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fundings.map((f) => (
              <button
                key={f.funding_id}
                onClick={() => onSelectFunding(f, tracker)}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-orange-200 hover:bg-orange-50 transition-colors group text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.nama_beasiswa}</p>
                  <p className="text-xs font-medium mt-0.5 text-orange-500">
                    {f.status === "SELECTED" ? "Dipilih" : "Tersedia"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#f58a1f] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
