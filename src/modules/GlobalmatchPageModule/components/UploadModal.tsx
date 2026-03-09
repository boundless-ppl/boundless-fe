import { Upload, FileText, Check, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [cvFile, setCvFile] = useState<{ name: string; size: string } | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<{ name: string; size: string } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "cv" | "transcript") => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(2);
      const uploadedFile = { name: file.name, size: fileSizeKB };
      type === "cv" ? setCvFile(uploadedFile) : setTranscriptFile(uploadedFile);
    }
    // Reset value input agar file yang sama bisa diupload ulang jika perlu
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden rounded-[24px] border-none">
        <DialogHeader className="px-8 py-6 border-b border-[#e8e8e8] bg-white">
          <DialogTitle className="text-[#2b2b2b] text-[18px] font-semibold">
            Submit untuk Rekomendasi
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-8 max-h-[80vh] overflow-y-auto font-sans">
          <div className="text-center mb-8">
            <h2 className="text-[#0a0a0a] text-[28px] md:text-[32px] font-bold mb-3">
              Upload Dokumen Anda
            </h2>
            <DialogDescription className="text-[#9b9b9b] text-[14px]">
              Upload CV dan transkrip akademis Anda untuk mendapatkan rekomendasi program yang sesuai
            </DialogDescription>
          </div>

          <div className="space-y-6">
            {/* CV Section */}
            <div>
              <label className="block text-[#2b2b2b] text-[14px] font-medium mb-3">
                Curriculum Vitae (CV) <span className="text-[#fa8613]">*</span>
              </label>
              <input type="file" id="cv-upload" className="hidden" onChange={(e) => handleFileUpload(e, "cv")} />
              
              {cvFile ? (
                <FilePreview 
                  name={cvFile.name} 
                  size={cvFile.size} 
                  onRemove={() => setCvFile(null)} // Fungsi hapus
                />
              ) : (
                <UploadPlaceholder id="cv-upload" label="Klik untuk upload CV" icon={<Upload className="text-[#fa8613]" />} />
              )}
            </div>

            {/* Transcript Section */}
            <div>
              <label className="block text-[#2b2b2b] text-[14px] font-medium mb-3">
                Transkrip Akademis <span className="text-[#fa8613]">*</span>
              </label>
              <input type="file" id="ts-upload" className="hidden" onChange={(e) => handleFileUpload(e, "transcript")} />
              
              {transcriptFile ? (
                <FilePreview 
                  name={transcriptFile.name} 
                  size={transcriptFile.size} 
                  onRemove={() => setTranscriptFile(null)} // Fungsi hapus
                />
              ) : (
                <UploadPlaceholder id="ts-upload" label="Klik untuk upload Transkrip" icon={<FileText className="text-[#fa8613]" />} />
              )}
            </div>
          </div>

          <Button
            className="w-full mt-8 py-7 text-[16px] font-semibold bg-[#2b2b2b] hover:bg-[#1a1a1a] rounded-[12px]"
            disabled={!cvFile || !transcriptFile}
            onClick={() => console.log("Submit")}
          >
            Lanjut ke Preferensi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilePreview({ name, size, onRemove }: { name: string; size: string; onRemove: () => void }) {
  return (
    <div className="border border-[#e8e8e8] rounded-[12px] p-4 flex items-center gap-3 bg-white group">
      <div className="bg-[#e8f5e9] rounded-full p-2">
        <Check className="w-5 h-5 text-[#4caf50]" />
      </div>
      <div className="flex-1">
        <p className="text-[#2b2b2b] text-[14px] font-medium truncate max-w-[400px]">{name}</p>
        <p className="text-[#9b9b9b] text-[12px]">{size} KB</p>
      </div>
      {/* Tombol Hapus */}
      <button 
        onClick={onRemove}
        className="p-2 text-[#9b9b9b] hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
        title="Ganti file"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function UploadPlaceholder({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) {
  return (
    <label htmlFor={id} className="border-2 border-dashed border-[#e8e8e8] rounded-[12px] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#fa8613] transition-colors bg-[#fafafa] hover:bg-[#fff8f3]">
      <div className="bg-[#fff0e0] rounded-full p-3 mb-3">{icon}</div>
      <p className="text-[#2b2b2b] text-[14px] font-medium mb-1">{label}</p>
      <p className="text-[#9b9b9b] text-[12px]">PDF, DOC, DOCX (Max 10MB)</p>
    </label>
  );
}