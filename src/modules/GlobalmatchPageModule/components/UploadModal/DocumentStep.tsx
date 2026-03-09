import React, { useState } from "react";
import { Upload, FileText, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { FileData } from "./types";

interface DocumentStepProps {
  onNext: (cv: FileData, transcript: FileData) => void;
}

export function DocumentStep({ onNext }: DocumentStepProps) {
  const [cvFile, setCvFile] = useState<FileData | null>(null);
  const [tsFile, setTsFile] = useState<FileData | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "cv" | "ts") => {
    const file = event.target.files?.[0];
    if (file) {
      const uploaded: FileData = { 
        name: file.name, 
        size: (file.size / 1024).toFixed(2) 
      };
      type === "cv" ? setCvFile(uploaded) : setTsFile(uploaded);
    }
    event.target.value = ""; 
  };

  return (
    <div className="px-8 py-8 animate-in slide-in-from-right-4 duration-300 font-sans">
      <div className="text-center mb-8">
        <h2 className="text-[#0a0a0a] text-[28px] md:text-[32px] font-bold mb-3">
          Upload Dokumen
        </h2>
        <DialogDescription className="text-[#9b9b9b] text-[14px]">
          Upload CV dan transkrip akademis Anda untuk memulai rekomendasi
        </DialogDescription>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[14px] font-medium text-[#2b2b2b]">
            Curriculum Vitae (CV) <span className="text-[#fa8613]">*</span>
          </label>
          <input type="file" id="cv-up" className="hidden" onChange={(e) => handleFileUpload(e, "cv")} />
          
          {cvFile ? (
            <div className="border border-[#e8e8e8] rounded-[12px] p-4 flex items-center gap-3 bg-white">
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
            <label htmlFor="cv-up" className="border-2 border-dashed border-[#e8e8e8] rounded-xl p-8 flex flex-col items-center cursor-pointer hover:bg-[#fff8f3] hover:border-[#fa8613] transition-all">
              <div className="bg-[#fff0e0] p-3 rounded-full mb-3">
                <Upload className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-[14px] font-medium">Klik untuk upload CV</p>
              <p className="text-[12px] text-[#9b9b9b]">PDF, DOC, DOCX (Max 10MB)</p>
            </label>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[14px] font-medium text-[#2b2b2b]">
            Transkrip Akademis <span className="text-[#fa8613]">*</span>
          </label>
          <input type="file" id="ts-up" className="hidden" onChange={(e) => handleFileUpload(e, "ts")} />
          
          {tsFile ? (
            <div className="border border-[#e8e8e8] rounded-[12px] p-4 flex items-center gap-3 bg-white">
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
            <label htmlFor="ts-up" className="border-2 border-dashed border-[#e8e8e8] rounded-xl p-8 flex flex-col items-center cursor-pointer hover:bg-[#fff8f3] hover:border-[#fa8613] transition-all">
              <div className="bg-[#fff0e0] p-3 rounded-full mb-3">
                <FileText className="text-[#fa8613] w-6 h-6" />
              </div>
              <p className="text-[14px] font-medium">Klik untuk upload Transkrip</p>
              <p className="text-[12px] text-[#9b9b9b]">PDF, DOC, DOCX (Max 10MB)</p>
            </label>
          )}
        </div>
      </div>

      <Button 
        className="w-full mt-8 py-7 bg-[#2b2b2b] text-white font-semibold rounded-xl text-[16px]"
        disabled={!cvFile || !tsFile}
        onClick={() => cvFile && tsFile && onNext(cvFile, tsFile)}
      >
        Lanjut ke Preferensi
      </Button>
    </div>
  );
}