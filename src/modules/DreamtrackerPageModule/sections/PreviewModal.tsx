"use client";

import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { getAuthToken } from "@/features/auth/services/auth.service";
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

function isUnresolvablePreviewUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.endsWith(".test") || hostname.endsWith(".example") || hostname.endsWith(".invalid");
  } catch {
    return false;
  }
}

export const PreviewModal = ({ req, onClose, onReupload }: Props) => {
  const url = req.document!.public_url;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMimeType, setPreviewMimeType] = useState<string | null>(req.document?.mime_type ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    async function loadPreview() {
      setLoadError(null);
      setPreviewUrl(null);

      try {
        if (isUnresolvablePreviewUrl(url)) {
          throw new Error("Dokumen ini memakai URL placeholder dari backend dan belum bisa dipratinjau.");
        }

        const tokens = getAuthToken();
        const response = await fetch(url, {
          headers: tokens?.accessToken
            ? { Authorization: `Bearer ${tokens.accessToken}` }
            : {},
        });

        if (!response.ok) {
          throw new Error(`Gagal memuat dokumen (${response.status})`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!isActive) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPreviewMimeType(blob.type || req.document?.mime_type || null);
        setPreviewUrl(objectUrl);
      } catch (error) {
        if (!isActive) return;
        setLoadError(error instanceof Error ? error.message : "Gagal memuat dokumen");
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [req.document?.mime_type, url]);

  const showAsImage = previewMimeType?.startsWith("image/") || isImageUrl(url);

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
          {!previewUrl && !loadError && (
            <div className="flex h-96 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500">
              Memuat pratinjau dokumen...
            </div>
          )}

          {loadError && (
            <div className="flex h-96 items-center justify-center rounded-xl border border-red-100 bg-red-50 px-6 text-center text-sm text-red-600">
              {loadError}
            </div>
          )}

          {previewUrl && showAsImage ? (
            <img
              src={previewUrl}
              alt={req.requirement_label}
              className="w-full h-auto rounded-xl object-contain"
            />
          ) : null}

          {previewUrl && !showAsImage ? (
            <iframe
              src={previewUrl}
              title={req.requirement_label}
              className="h-96 w-full rounded-xl border border-gray-100"
            />
          ) : null}
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
            Verifikasi Ulang
          </button>
        </div>
      </div>
    </div>
  );
};
