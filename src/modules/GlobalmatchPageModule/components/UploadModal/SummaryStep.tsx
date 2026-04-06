import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PreferenceData } from "./types";

export interface SummaryStepProps {
  readonly files: { readonly cv: { readonly name: string } | null; readonly transcript: { readonly name: string } | null };
  readonly preferences: Readonly<PreferenceData>;
  readonly onEdit: () => void;
  readonly onSubmit: () => void;
}

export function SummaryStep({ files, preferences, onEdit, onSubmit }: SummaryStepProps) {
  const formatList = (list: string[]) => (list.length > 0 ? list.join(", ") : "-");
  const educationLabel = preferences.educationLevel === "master" ? "S2/Master" : preferences.educationLevel;
  const fieldOfStudyValue = [
    ...preferences.fields,
    ...(preferences.customField.trim() ? [preferences.customField.trim()] : []),
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 px-8 py-8 font-sans duration-300">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-[28px] font-bold text-[#0a0a0a] md:text-[32px]">
          Tinjau Submission Anda
        </h2>
        <p className="text-[#9b9b9b] text-[14px]">
          Pastikan semua informasi sudah benar sebelum submit
        </p>
      </div>

      <div className="space-y-6 rounded-[24px] border border-[#f1e6d7] bg-[#fffaf4] p-6">
        <div>
          <h3 className="text-[16px] font-bold text-[#2b2b2b] mb-3">Dokumen</h3>
          <div className="space-y-2">
            {files.cv && (
              <div className="flex items-center gap-2 text-[#6B6B6B] text-[14px]">
                <FileText size={18} className="text-[#FA8613]" />
                <span>CV: {files.cv.name}</span>
              </div>
            )}
            {files.transcript && (
              <div className="flex items-center gap-2 text-[#6B6B6B] text-[14px]">
                <FileText size={18} className="text-[#FA8613]" />
                <span>Transkrip: {files.transcript.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-[#2b2b2b]">Preferensi</h3>
          
          <div className="grid grid-cols-1 gap-4 text-[14px] md:grid-cols-2">
            <p><span className="font-semibold text-[#2b2b2b]">Negara:</span> <span className="text-[#6B6B6B]">{formatList(preferences.countries)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Bidang studi:</span> <span className="text-[#6B6B6B]">{formatList(fieldOfStudyValue)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Jenjang:</span> <span className="text-[#6B6B6B]">{educationLabel}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Bahasa:</span> <span className="text-[#6B6B6B]">{formatList(preferences.languages)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Budget:</span> <span className="text-[#6B6B6B] uppercase">{preferences.budget}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Tipe beasiswa:</span> <span className="text-[#6B6B6B]">{formatList(preferences.scholarships)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Periode mulai:</span> <span className="text-[#6B6B6B]">{preferences.startPeriod}</span></p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl border-[#E8E8E8] py-6 font-semibold text-[#6B6B6B]" 
          onClick={onEdit}
        >
          Edit Preferensi
        </Button>
        <Button 
          className="flex-1 rounded-xl bg-[#f58a1f] py-6 font-semibold text-white transition-all shadow-md hover:bg-[#dd7611]"
          onClick={onSubmit}
        >
          Submit untuk Rekomendasi
        </Button>
      </div>
    </div>
  );
}
