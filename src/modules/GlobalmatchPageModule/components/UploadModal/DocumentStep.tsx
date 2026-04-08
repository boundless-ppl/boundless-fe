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
      <div className="mb-6 flex flex-col gap-3">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-[#0a0a0a] md:text-[32px]">
            Upload Dokumen
          </h2>
          <DialogDescription className="text-slate-900 text-[14px] pb-2">
            Anda dapat mengunggah CV, transkrip, atau keduanya. Sistem akan menyesuaikan analisis berdasarkan dokumen yang tersedia.
          </DialogDescription>
          <div className="text-sm text-orange-600 pb-4">
            Minimal satu dokumen harus diunggah. Format yang didukung: PDF, JPG, JPEG, PNG. Total ukuran gabungan CV dan transkrip maksimal 350 KB.
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-[24px] border border-[#ebe2d5] bg-white p-5 w-full max-w-full overflow-hidden">
          <p className="text-[14px] font-medium text-[#2b2b2b]">
            Curriculum Vitae (CV)
          </p>
          <input 
            type="file" 
            id="cv-up" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) => handleFileUpload(e, "cv")} 
          />
          
          {cvFile ? (
            <div className="flex items-center gap-3 rounded-[18px] border border-[#e8e8e8] bg-white p-4 w-full min-w-0">
              <div className="bg-[#e8f5e9] rounded-full p-2">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-[#4caf50]" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[#2b2b2b] text-xs md:text-[14px] font-medium truncate break-all">{cvFile.name}</p>
                <p className="text-[#9b9b9b] text-[10px] md:text-[12px]">{cvFile.size} KB</p>
              </div>
              <button
                onClick={() => applyUploadState("cv", { file: null, error: null })}
                className="p-2 text-[#9b9b9b] hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label htmlFor="cv-up" className="flex min-h-47.5 cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#e5ddd1] bg-[#fcfaf7] p-6 transition-all hover:border-[#fa8613] hover:bg-[#fff8f3]">
              <div className="mb-3 rounded-full bg-[#fff0e0] p-3">
                <Upload className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-center text-[14px] font-medium">Klik untuk upload CV</p>
              <p className="mt-1 text-center text-[12px] text-[#9b9b9b]">Gunakan versi CV yang paling terbaru dan terbaca jelas.</p>
            </label>
          )}
          
          {cvError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[13px] text-red-700">{cvError}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-[24px] border border-[#ebe2d5] bg-white p-5 w-full max-w-full overflow-hidden">
          <p className="text-[14px] font-medium text-[#2b2b2b]">
            Transkrip Akademis
          </p>
          <input 
            type="file" 
            id="ts-up" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) => handleFileUpload(e, "ts")} 
          />
          
          {tsFile ? (
            <div className="flex items-center gap-3 rounded-[18px] border border-[#e8e8e8] bg-white p-4 w-full min-w-0">
              <div className="bg-[#e8f5e9] rounded-full p-2">
                <Check className="w-3 h-3 md:w-5 md:h-5 text-[#4caf50]" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[#2b2b2b] text-xs md:text-[14px] font-medium truncate break-all">{tsFile.name}</p>
                <p className="text-[#9b9b9b] text-[10px] md:text-[12px]">{tsFile.size} KB</p>
              </div>
              <button
                onClick={() => applyUploadState("ts", { file: null, error: null })}
                className="p-2 text-[#9b9b9b] hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label htmlFor="ts-up" className="flex min-h-47.5 cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#e5ddd1] bg-[#fcfaf7] p-6 transition-all hover:border-[#fa8613] hover:bg-[#fff8f3]">
              <div className="mb-3 rounded-full bg-[#fff0e0] p-3">
                <FileText className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-center text-[14px] font-medium">Klik untuk upload transkrip</p>
              <p className="mt-1 text-center text-[12px] text-[#9b9b9b]">Gunakan versi yang paling lengkap, penuh, dan jelas.</p>
            </label>
          )}

          {tsError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[13px] text-red-700">{tsError}</p>
            </div>
          )}
        </div>
      </div>

      {totalSizeError && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-[13px] text-red-700">{totalSizeError}</p>
        </div>
      )}

      <Button 
        className="mt-6 md:mt-16 h-auto w-full rounded-xl md:rounded-[18px] bg-[#f58a1f] py-3 md:py-4 text-sm md:text-[16px] font-semibold text-white hover:bg-[#dd7611]"
        disabled={(!cvFile && !tsFile) || !!totalSizeError}
        onClick={() => onNext({ cv: cvFile, transcript: tsFile })}
      >
        Lanjut ke Preferensi
      </Button>
    </div>
  );
}
