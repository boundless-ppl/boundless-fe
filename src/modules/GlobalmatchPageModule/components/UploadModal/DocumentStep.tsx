import React, { useState } from "react";
import { Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { validateDocumentFile } from "@/lib/file-validation";
import { FileData, SelectedFiles } from "./types";

interface DocumentStepProps {
  readonly onNext: (files: SelectedFiles) => void;
}

type UploadKind = "cv" | "ts";
type UploadState = {
  file: FileData | null;
  error: string | null;
};

const MAX_TOTAL_FILE_SIZE_BYTES = 350 * 1024;

export function DocumentStep({ onNext }: Readonly<DocumentStepProps>) {
  const [cvFile, setCvFile] = useState<FileData | null>(null);
  const [tsFile, setTsFile] = useState<FileData | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [tsError, setTsError] = useState<string | null>(null);
  const [totalSizeError, setTotalSizeError] = useState<string | null>(null);

  const getCombinedSize = (nextCvFile: FileData | null, nextTsFile: FileData | null) =>
    (nextCvFile?.file.size ?? 0) + (nextTsFile?.file.size ?? 0);

  const getTotalSizeMessage = (sizeInBytes: number) =>
    `Total ukuran CV dan transkrip maksimal 350 KB. Ukuran file Anda saat ini ${(
      sizeInBytes / 1024
    ).toFixed(2)} KB.`;

  const applyUploadState = (type: UploadKind, nextState: UploadState) => {
    if (type === "cv") {
      setCvFile(nextState.file);
      setCvError(nextState.error);
      return;
    }
    setTsFile(nextState.file);
    setTsError(nextState.error);
  };

  const buildUploadedFile = (file: File): FileData => ({
    file,
    name: file.name,
    size: (file.size / 1024).toFixed(2),
  });

  const getNextFiles = (type: UploadKind, uploaded: FileData) => ({
    nextCvFile: type === "cv" ? uploaded : cvFile,
    nextTsFile: type === "ts" ? uploaded : tsFile,
  });

  const handleInvalidUpload = (type: UploadKind, error: string) => {
    applyUploadState(type, { file: null, error });
    setTotalSizeError(null);
  };

  const handleValidUpload = (type: UploadKind, uploaded: FileData) => {
    const { nextCvFile, nextTsFile } = getNextFiles(type, uploaded);
    const combinedSize = getCombinedSize(nextCvFile, nextTsFile);

    if (combinedSize > MAX_TOTAL_FILE_SIZE_BYTES) {
      applyUploadState(type, { file: null, error: null });
      setTotalSizeError(getTotalSizeMessage(combinedSize));
      return;
    }

    applyUploadState(type, { file: uploaded, error: null });
    setTotalSizeError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: UploadKind) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateDocumentFile(file);
      if (validation.isValid) {
        handleValidUpload(type, buildUploadedFile(file));
      } else {
        handleInvalidUpload(type, validation.error || "Invalid file");
      }
    }
    event.target.value = "";
  };

  return (
    <div className="animate-in slide-in-from-right-4 px-8 py-7 font-sans duration-300">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-[#0a0a0a] md:text-[28px]">
          Upload Dokumen
        </h2>
        <DialogDescription className="text-[13px] text-[#9b9b9b] pb-1">
          Upload CV, transkrip, atau keduanya — sistem akan menyesuaikan analisis berdasarkan dokumen yang tersedia.
        </DialogDescription>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1">
          <AlertCircle className="w-3 h-3 text-orange-500 shrink-0" />
          <span className="text-[11px] text-orange-600 font-medium">PDF, JPG, PNG · Maks. 350 KB gabungan</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <UploadCard
          id="cv-up"
          label="Curriculum Vitae (CV)"
          hint="Gunakan versi CV yang paling terbaru dan terbaca jelas."
          icon={<Upload className="text-[#fa8613] w-5 h-5" />}
          promptText="Klik untuk upload CV"
          file={cvFile}
          error={cvError}
          onRemove={() => applyUploadState("cv", { file: null, error: null })}
          onChange={(e) => handleFileUpload(e, "cv")}
        />

        <UploadCard
          id="ts-up"
          label="Transkrip Akademis"
          hint="Gunakan versi yang paling lengkap, penuh, dan jelas."
          icon={<FileText className="text-[#fa8613] w-5 h-5" />}
          promptText="Klik untuk upload transkrip"
          file={tsFile}
          error={tsError}
          onRemove={() => applyUploadState("ts", { file: null, error: null })}
          onChange={(e) => handleFileUpload(e, "ts")}
        />
      </div>

      {totalSizeError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-[12px] text-red-700">{totalSizeError}</p>
        </div>
      )}

      <Button
        className="mt-6 h-auto w-full rounded-[14px] bg-[#f58a1f] py-3.5 text-[14px] font-semibold text-white hover:bg-[#dd7611] transition-colors shadow-sm"
        disabled={(!cvFile && !tsFile) || !!totalSizeError}
        onClick={() => onNext({ cv: cvFile, transcript: tsFile })}
      >
        Lanjut ke Preferensi →
      </Button>
    </div>
  );
}

interface UploadCardProps {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  promptText: string;
  file: FileData | null;
  error: string | null;
  onRemove: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadCard({ id, label, hint, icon, promptText, file, error, onRemove, onChange }: UploadCardProps) {
  return (
    <div className="space-y-2 rounded-[20px] border border-[#ebe2d5] bg-white p-4">
      <p className="text-[13px] font-semibold text-[#2b2b2b]">{label}</p>
      <input
        type="file"
        id={id}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={onChange}
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-[14px] border border-[#e8f5e9] bg-[#f6fef7] px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9]">
            <Check className="w-4 h-4 text-[#4caf50]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#2b2b2b] truncate">{file.name}</p>
            <p className="text-[11px] text-[#9b9b9b]">{file.size} KB</p>
          </div>
          <button
            onClick={onRemove}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#c0b8ae] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex min-h-[176px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[#e5ddd1] bg-[#fcfaf7] p-6 text-center transition-all hover:border-[#fa8613] hover:bg-[#fff8f3]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e0]">
            {icon}
          </div>
          <p className="text-[13px] font-semibold text-[#2b2b2b]">{promptText}</p>
          <p className="text-[11px] text-[#9b9b9b] max-w-[160px]">{hint}</p>
        </label>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-[12px] text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
