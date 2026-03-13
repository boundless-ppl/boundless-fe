import React, { useState } from "react";
import { Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { validateDocumentFile } from "@/lib/file-validation";
import { FileData, SelectedFiles } from "./types";

interface DocumentStepProps {
  onNext: (files: SelectedFiles) => void;
}

const MAX_TOTAL_FILE_SIZE_BYTES = 350 * 1024;

export function DocumentStep({ onNext }: DocumentStepProps) {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "cv" | "ts") => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file using centralized utility
      const validation = validateDocumentFile(file);
      
      if (!validation.isValid) {
        // Set error and don't upload
        if (type === "cv") {
          setCvError(validation.error || "Invalid file");
          setCvFile(null);
        } else {
          setTsError(validation.error || "Invalid file");
          setTsFile(null);
        }
        setTotalSizeError(null);
      } else {
        // Clear error and upload file
        if (type === "cv") {
          setCvError(null);
        } else {
          setTsError(null);
        }
        
        const uploaded: FileData = { 
          file: file,
          name: file.name, 
          size: (file.size / 1024).toFixed(2) 
        };

        const nextCvFile = type === "cv" ? uploaded : cvFile;
        const nextTsFile = type === "ts" ? uploaded : tsFile;
        const combinedSize = getCombinedSize(nextCvFile, nextTsFile);

        if (combinedSize > MAX_TOTAL_FILE_SIZE_BYTES) {
          if (type === "cv") {
            setCvFile(null);
          } else {
            setTsFile(null);
          }
          setTotalSizeError(getTotalSizeMessage(combinedSize));
        } else {
          setTotalSizeError(null);
          if (type === "cv") {
            setCvFile(uploaded);
          } else {
            setTsFile(uploaded);
          }
        }
      }
    }
    
    event.target.value = ""; 
  };

  return (
    <div className="animate-in slide-in-from-right-4 px-8 py-7 font-sans duration-300">
      <div className="mb-6 flex flex-col gap-3">
        <div>
        <h2 className="mb-3 text-[28px] font-bold text-[#0a0a0a] md:text-[32px]">
          Upload Dokumen
        </h2>
        <DialogDescription className="text-[#9b9b9b] text-[14px]">
          Anda bisa unggah CV saja, transkrip saja, atau keduanya. Sistem akan otomatis menyesuaikan analisis dengan dokumen yang tersedia.
        </DialogDescription>
        </div>
        <div className="rounded-[20px] border border-[#ebe2d5] bg-white px-4 py-3 text-sm text-[#6b7280]">
          Minimal unggah satu dokumen. Jika Anda mengunggah CV dan transkrip sekaligus, rekomendasi akan dibuat dari profil yang lebih lengkap.
        </div>
        <div className="rounded-[20px] border border-[#f4d7b8] bg-[#fff8f2] px-4 py-3 text-sm text-[#9a5a13]">
          Untuk sementara, total gabungan ukuran CV dan transkrip maksimal 350 KB.
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-[24px] border border-[#ebe2d5] bg-white p-5">
          <label className="text-[14px] font-medium text-[#2b2b2b]">
            Curriculum Vitae (CV)
          </label>
          <input 
            type="file" 
            id="cv-up" 
            className="hidden" 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleFileUpload(e, "cv")} 
          />
          
          {cvFile ? (
            <div className="flex items-center gap-3 rounded-[18px] border border-[#e8e8e8] bg-white p-4">
              <div className="bg-[#e8f5e9] rounded-full p-2">
                <Check className="w-5 h-5 text-[#4caf50]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2b2b2b] text-[14px] font-medium truncate">{cvFile.name}</p>
                <p className="text-[#9b9b9b] text-[12px]">{cvFile.size} KB</p>
              </div>
              <button onClick={() => setCvFile(null)} className="p-2 text-[#9b9b9b] hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label htmlFor="cv-up" className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#e5ddd1] bg-[#fcfaf7] p-6 transition-all hover:border-[#fa8613] hover:bg-[#fff8f3]">
              <div className="mb-3 rounded-full bg-[#fff0e0] p-3">
                <Upload className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-center text-[14px] font-medium">Klik untuk upload CV</p>
              <p className="mt-1 text-center text-[12px] text-[#9b9b9b]">Gunakan versi CV yang paling terbaru</p>
            </label>
          )}
          
          {cvError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[13px] text-red-700">{cvError}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-[24px] border border-[#ebe2d5] bg-white p-5">
          <label className="text-[14px] font-medium text-[#2b2b2b]">
            Transkrip Akademis
          </label>
          <input 
            type="file" 
            id="ts-up" 
            className="hidden" 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleFileUpload(e, "ts")} 
          />
          
          {tsFile ? (
            <div className="flex items-center gap-3 rounded-[18px] border border-[#e8e8e8] bg-white p-4">
              <div className="bg-[#e8f5e9] rounded-full p-2">
                <Check className="w-5 h-5 text-[#4caf50]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2b2b2b] text-[14px] font-medium truncate">{tsFile.name}</p>
                <p className="text-[#9b9b9b] text-[12px]">{tsFile.size} KB</p>
              </div>
              <button onClick={() => setTsFile(null)} className="p-2 text-[#9b9b9b] hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label htmlFor="ts-up" className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#e5ddd1] bg-[#fcfaf7] p-6 transition-all hover:border-[#fa8613] hover:bg-[#fff8f3]">
              <div className="mb-3 rounded-full bg-[#fff0e0] p-3">
                <FileText className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-center text-[14px] font-medium">Klik untuk upload transkrip</p>
              <p className="mt-1 text-center text-[12px] text-[#9b9b9b]">Gunakan versi yang paling lengkap dan jelas</p>
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
        className="mt-6 h-auto w-full rounded-[18px] bg-[#f58a1f] py-4 text-[16px] font-semibold text-white hover:bg-[#dd7611]"
        disabled={(!cvFile && !tsFile) || !!totalSizeError}
        onClick={() => onNext({ cv: cvFile, transcript: tsFile })}
      >
        Lanjut ke Preferensi
      </Button>
    </div>
  );
}
