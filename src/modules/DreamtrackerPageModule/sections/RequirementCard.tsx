"use client";

import { useState } from "react";
import { CheckCircle2, FileText, XCircle, Eye, Sparkles } from "lucide-react";
import type { DreamRequirement, DreamRequirementStatus } from "@/lib/api-types";
import { UploadModal } from "./UploadModal";
import { PreviewModal } from "./PreviewModal";

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

type Props = {
  req: DreamRequirement;
  onUpload?: (req: DreamRequirement, file: File) => void;
};

export const RequirementCard = ({ req, onUpload }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const hasAiMessages = req.ai_messages && req.ai_messages.length > 0;
  const isReceived = req.status === "VERIFIED" || req.status === "UPLOADED";
  const isRejected = req.status === "REJECTED";
  const canUploadFresh = req.can_upload && !req.needs_reupload;

  return (
    <>
      <div className={`rounded-xl border p-3.5 transition-all ${reqStatusBg(req.status)}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{reqStatusIcon(req.status)}</div>

          <div className="min-w-0 flex-1">
            {/* Judul */}
            <p className="text-sm font-semibold text-gray-800 truncate">
              {req.label || req.requirement_label}
            </p>

            {/* Catatan (hanya jika bukan rejected) */}
            {req.notes && !isRejected && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{req.notes}</p>
            )}

            {/* Pesan AI untuk dokumen yang perlu diperbaiki */}
            {isRejected && hasAiMessages && (
              <div className="mt-2 space-y-1">
                {req.ai_messages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-600 leading-snug">{msg}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tombol Unggah Ulang untuk REJECTED */}
            {isRejected && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-2.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
              >
                Unggah Ulang
              </button>
            )}
          </div>

          {/* Ikon mata di sisi kanan untuk dokumen yang sudah diterima */}
          {isReceived && req.document_url && (
            <button
              onClick={() => setShowPreviewModal(true)}
              title="Lihat dokumen"
              className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:border-orange-300 hover:text-[#f58a1f]"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Tombol Unggah untuk dokumen yang belum diunggah */}
          {canUploadFresh && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-auto shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-orange-300 hover:text-[#f58a1f]"
            >
              Unggah
            </button>
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          req={req}
          onClose={() => setShowUploadModal(false)}
          onUpload={(r, file) => {
            onUpload?.(r, file);
            setShowUploadModal(false);
          }}
        />
      )}

      {showPreviewModal && req.document_url && (
        <PreviewModal
          req={req}
          onClose={() => setShowPreviewModal(false)}
          onReupload={() => setShowUploadModal(true)}
        />
      )}
    </>
  );
};
