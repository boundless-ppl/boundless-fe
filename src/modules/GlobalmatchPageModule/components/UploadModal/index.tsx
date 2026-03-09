"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentStep } from "./DocumentStep";
import { PreferenceStep, type PreferenceData } from "./PreferenceStep";

interface FileData {
  name: string;
  size: string;
}

type ModalStep = "upload" | "preferences";

export function UploadModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState<ModalStep>("upload");
  
  const [files, setFiles] = useState<{ cv: FileData; transcript: FileData } | null>(null);

  const handleDocumentSubmit = (cv: FileData, transcript: FileData) => {
    setFiles({ cv, transcript });
    setStep("preferences");
  };

  const handleFinalSubmit = (preferences: PreferenceData) => {
    console.log("Final submission:", { ...files, preferences });

    const debugPayload = {
      documents: files,
      userPreferences: preferences
    };
    console.log("=== DEBUG DATA SUBMISSION ===");
    console.log("Data Dokumen:", debugPayload.documents);
    console.log("Data Preferensi:", debugPayload.userPreferences);
    
    onOpenChange(false);
    setTimeout(() => {
        setStep("upload");
    }, 300); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden rounded-[24px] border-none font-sans">
        <DialogHeader className="px-8 py-6 border-b border-[#e8e8e8] bg-white sticky top-0 z-10">
          <DialogTitle className="text-[#2b2b2b] text-[18px] font-semibold">
            Submit untuk Rekomendasi
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          {step === "upload" ? (
            <DocumentStep onNext={handleDocumentSubmit} />
          ) : (
            <PreferenceStep onBack={() => setStep("upload")} onSubmit={handleFinalSubmit} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}