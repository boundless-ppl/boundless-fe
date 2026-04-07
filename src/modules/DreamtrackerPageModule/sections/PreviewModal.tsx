"use client";

import { X, Upload } from "lucide-react";
import type { DreamRequirement } from "@/lib/api-types";

type Props = {
  req: DreamRequirement;
  onClose: () => void;
  onReupload: () => void;
};

function isImageUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return /\.(jpg|jpeg|png|webp|gif|bmp)$/.test(clean);
}

export const PreviewModal = ({ req, onClose, onReupload }: Props) => {
  const url = req.document!.public_url;
  const showAsImage = isImageUrl(url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl max-h-[90vh]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Pratinjau Dokumen
            </p>
            <h2 className="text-lg font-bold text-gray-900">
              {req.requirement_label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preview area */}
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {showAsImage ? (
            <img
              src={url}
              alt={req.label || req.requirement_label}
              className="w-full h-auto rounded-xl object-contain"
            />
          ) : (
            <iframe
              src={url}
              title={req.label || req.requirement_label}
              className="h-96 w-full rounded-xl border border-gray-100"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onReupload();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f58a1f] to-[#d97a18] py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            Unggah Ulang
          </button>
        </div>
      </div>
    </div>
  );
};
