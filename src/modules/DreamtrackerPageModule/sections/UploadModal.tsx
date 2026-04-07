"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import type { DreamRequirement } from "@/lib/api-types";

type Props = {
  req: DreamRequirement;
  onClose: () => void;
  onUpload: (req: DreamRequirement, file: File) => void;
};

export const UploadModal = ({ req, onClose, onUpload }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleSubmit() {
    if (!file) return;
    onUpload(req, file);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {req.needs_reupload ? "Unggah Ulang Dokumen" : "Unggah Dokumen"}
            </p>
            <h2 className="text-lg font-bold text-gray-900">
              {req.label || req.requirement_label}
            </h2>
            {req.description && (
              <p className="text-sm text-gray-400 mt-0.5">{req.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pb-4">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 cursor-pointer transition-colors ${
              isDragging
                ? "border-[#f58a1f] bg-orange-50"
                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
            }`}
          >
            <Upload className={`h-8 w-8 ${isDragging ? "text-[#f58a1f]" : "text-gray-300"}`} />
            <p className="text-sm font-medium text-gray-500">
              {isDragging ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
            </p>
            <p className="text-xs text-gray-300">PDF, JPG, PNG (maks. 10MB)</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
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
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file}
            className="flex-1 rounded-xl bg-gradient-to-b from-[#f58a1f] to-[#d97a18] py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Unggah
          </button>
        </div>
      </div>
    </div>
  );
};
