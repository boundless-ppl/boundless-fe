"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { DreamRequirement, SubmitRequirementResponse } from "@/lib/api-types";
import { uploadRequirementDocument } from "@/features/dreamtracker/services/dreamtracker.service";

type Props = {
  req: DreamRequirement;
  onClose: () => void;
  onSuccess: (response: SubmitRequirementResponse) => void;
};

function canonicalRequirementDocumentType(req: DreamRequirement): string {
  const raw = (req.document?.document_type ?? req.requirement_key ?? "").trim();
  const upper = raw.toUpperCase();
  if ([
    "TRANSCRIPT",
    "PASSPORT",
    "KTP",
    "KK",
    "DIPLOMA",
    "DUOLINGO_CERT",
    "RECOMMENDATION_LETTER",
    "OFFER_LETTER",
    "SCHOLARSHIP_LETTER",
    "BANK_STATEMENT",
    "SPONSORSHIP_LETTER",
    "VISA_LETTER",
  ].includes(upper)) {
    return upper;
  }

  const normalized = raw.toLowerCase();
  if (normalized.includes("transcript") || normalized.includes("transkrip")) return "TRANSCRIPT";
  if (normalized.includes("passport") || normalized.includes("paspor")) return "PASSPORT";
  if (normalized === "ktp" || normalized.includes("identitas")) return "KTP";
  if (normalized === "kk" || normalized.includes("kartu keluarga") || normalized.includes("family card")) return "KK";
  if (normalized.includes("ijazah") || normalized.includes("diploma")) return "DIPLOMA";
  if (normalized.includes("duolingo")) return "DUOLINGO_CERT";
  if (
    normalized.includes("surat rekomendasi") ||
    normalized.includes("recommendation") ||
    normalized.includes("reference letter") ||
    normalized.includes("letter of recommendation") ||
    normalized.includes("lor")
  ) return "RECOMMENDATION_LETTER";
  if (normalized.includes("offer letter") || normalized.includes("acceptance letter")) return "OFFER_LETTER";
  if (normalized.includes("scholarship") || normalized.includes("award letter")) return "SCHOLARSHIP_LETTER";
  if (normalized.includes("bank statement") || normalized.includes("rekening koran")) return "BANK_STATEMENT";
  if (normalized.includes("sponsorship")) return "SPONSORSHIP_LETTER";
  if (normalized.includes("visa")) return "VISA_LETTER";
  return upper || raw;
}

export const UploadModal = ({ req, onClose, onSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "uploading" | "finishing">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = uploadPhase !== "idle";
  const aiMessage = req.review?.ai_message?.toLowerCase() ?? "";
  const isReverify =
    req.status === "REJECTED" ||
    req.status === "VERIFIED" ||
    req.status === "VERIFIED_WITH_WARNING" ||
    req.status === "REUSED" ||
    req.status_variant.toUpperCase() === "WARNING" ||
    req.needs_reupload ||
    aiMessage.includes("tidak dapat memverifikasi") ||
    aiMessage.includes("kurang jelas") ||
    aiMessage.includes("coba unggah kembali");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setError(null); }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setError(null); }
  }

  async function handleSubmit() {
    if (!file) return;
    setUploadPhase("uploading");
    setError(null);
    try {
      const documentType = canonicalRequirementDocumentType(req);
      const response = await uploadRequirementDocument(
        req.dream_req_status_id,
        file,
        documentType,
        !isReverify
      );
      onSuccess(response);
      setUploadPhase("finishing");
      globalThis.setTimeout(() => {
        onClose();
      }, 650);
    } catch {
      setUploadPhase("idle");
      setError("Gagal mengunggah dokumen. Silakan coba lagi.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {isReverify ? "Verifikasi Ulang Dokumen" : "Verifikasi Dokumen"}
            </p>
            <h2 className="text-lg font-bold text-gray-900">
              {req.requirement_label}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="ml-4 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pb-4">
          <div
            onClick={() => !isLoading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!isLoading) setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-colors ${
              isLoading
                ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                : isDragging
                ? "border-[#f58a1f] bg-orange-50 cursor-pointer"
                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer"
            }`}
          >
            <Upload className={`h-8 w-8 ${isDragging ? "text-[#f58a1f]" : "text-gray-300"}`} />
            <p className="text-sm font-medium text-gray-500">
              {uploadPhase === "uploading"
                ? "Dokumen sedang diproses..."
                : uploadPhase === "finishing"
                  ? "Verifikasi berhasil, menyiapkan hasil..."
                  : isDragging
                    ? "Lepaskan file di sini"
                    : "Klik atau seret file ke sini"}
            </p>
            <p className="text-xs text-gray-300">PDF, JPG, JPEG, PNG (maks. 10MB)</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />

          {file && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f58a1f] to-[#d97a18] py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadPhase === "uploading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : uploadPhase === "finishing" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Berhasil diverifikasi
              </>
            ) : (
              isReverify ? "Verifikasi Ulang" : "Verifikasi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
