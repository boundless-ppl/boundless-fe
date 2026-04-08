"use client";

import { useState } from "react";
import { CheckCircle2, FileText, XCircle, Eye, Sparkles, AlertCircle } from "lucide-react";
import type { DreamRequirement, DreamRequirementStatus, SubmitRequirementResponse } from "@/lib/api-types";
import { UploadModal } from "./UploadModal";
import { PreviewModal } from "./PreviewModal";

function isWarningRequirement(req: DreamRequirement) {
  const aiMessage = req.review?.ai_message?.toLowerCase() ?? "";
  return (
    req.status === "VERIFIED_WITH_WARNING" ||
    req.status_variant.toUpperCase() === "WARNING" ||
    req.needs_reupload ||
    aiMessage.includes("tidak dapat memverifikasi") ||
    aiMessage.includes("kurang jelas") ||
    aiMessage.includes("coba unggah kembali")
  );
}

function reqStatusIcon(status: DreamRequirementStatus) {
  if (status === "VERIFIED" || status === "REUSED") return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
  if (status === "VERIFIED_WITH_WARNING") return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />;
  if (status === "UPLOADED" || status === "REVIEWING") return <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />;
  if (status === "REJECTED") return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
  return <FileText className="h-4 w-4 text-gray-300 shrink-0" />;
}

function reqStatusBg(status: DreamRequirementStatus) {
  if (status === "VERIFIED" || status === "REUSED") return "bg-green-50 border-green-100";
  if (status === "VERIFIED_WITH_WARNING") return "bg-amber-50 border-amber-200";
  if (status === "UPLOADED" || status === "REVIEWING") return "bg-blue-50 border-blue-100";
  if (status === "REJECTED") return "bg-red-50 border-red-100";
  return "bg-gray-50 border-gray-100";
}

type Props = {
  req: DreamRequirement;
  onUploadSuccess?: (response: SubmitRequirementResponse) => void;
};

export const RequirementCard = ({ req, onUploadSuccess }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const aiMessage = req.review?.ai_message;
  const isWarning = isWarningRequirement(req);
  const documentUrl = req.document?.public_url ?? null;
  const isReceived =
    req.status === "VERIFIED" ||
    req.status === "VERIFIED_WITH_WARNING" ||
    req.status === "UPLOADED" ||
    req.status === "REUSED";
  const canReverify = req.status === "REJECTED" || isWarning;
  const canUploadFresh = req.can_upload && !req.needs_reupload;

  return (
    <>
      <div className={`rounded-xl border p-3.5 transition-all ${isWarning ? "bg-amber-50 border-amber-200" : reqStatusBg(req.status)}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{isWarning ? <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" /> : reqStatusIcon(req.status)}</div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {req.requirement_label}
            </p>

            {aiMessage && (
              <div className="mt-2 flex items-start gap-1.5">
                <Sparkles className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-600 leading-snug">{aiMessage}</p>
              </div>
            )}

            {canReverify && (
              <button
                onClick={() => setShowUploadModal(true)}
                className={`mt-2.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium transition-colors ${
                  req.status === "VERIFIED_WITH_WARNING"
                    ? "border-amber-200 text-amber-600 hover:border-amber-300 hover:bg-amber-50"
                    : "border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                Verifikasi Ulang
              </button>
            )}
          </div>

          {isReceived && documentUrl && (
            <button
              onClick={() => setShowPreviewModal(true)}
              title="Lihat dokumen"
              className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:border-orange-300 hover:text-[#f58a1f]"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {canUploadFresh && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-auto shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-orange-300 hover:text-[#f58a1f]"
            >
              Verifikasi
            </button>
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          req={req}
          onClose={() => setShowUploadModal(false)}
          onSuccess={(response) => {
            onUploadSuccess?.(response);
            setShowUploadModal(false);
          }}
        />
      )}

      {showPreviewModal && documentUrl && (
        <PreviewModal
          req={req}
          onClose={() => setShowPreviewModal(false)}
          onReupload={() => { setShowPreviewModal(false); setShowUploadModal(true); }}
        />
      )}
    </>
  );
};
