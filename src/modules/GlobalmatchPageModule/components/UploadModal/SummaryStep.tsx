import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";
import { PreferenceData } from "./types";

export interface SummaryStepProps {
  files: { cv: { name: string }; transcript: { name: string } };
  preferences: PreferenceData;
  onEdit: () => void;
  onSubmit: () => void;
}

export function SummaryStep({ files, preferences, onEdit, onSubmit }: SummaryStepProps) {
  const formatList = (list: string[]) => (list.length > 0 ? list.join(", ") : "-");

  return (
    <div className="px-8 py-8 animate-in fade-in zoom-in-95 duration-300 font-sans">
      <div className="text-center mb-8">
        <h2 className="text-[#0a0a0a] text-[28px] md:text-[32px] font-bold mb-3">
          Tinjau Submission Anda
        </h2>
        <p className="text-[#9b9b9b] text-[14px]">
          Pastikan semua informasi sudah benar sebelum submit
        </p>
      </div>

      <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-[20px] p-6 space-y-6">
        {/* Section Dokumen */}
        <div>
          <h3 className="text-[16px] font-bold text-[#2b2b2b] mb-3">Dokumen</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#6B6B6B] text-[14px]">
              <FileText size={18} className="text-[#FA8613]" />
              <span>CV: {files.cv.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6B6B] text-[14px]">
              <FileText size={18} className="text-[#FA8613]" />
              <span>Transkrip: {files.transcript.name}</span>
            </div>
          </div>
        </div>

        {/* Section Preferensi */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-[#2b2b2b]">Preferensi</h3>
          
          <div className="grid grid-cols-1 gap-4 text-[14px]">
            <p><span className="font-semibold text-[#2b2b2b]">Benua:</span> <span className="text-[#6B6B6B]">{formatList(preferences.regions)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Negara:</span> <span className="text-[#6B6B6B]">{formatList(preferences.countries)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Bidang studi:</span> <span className="text-[#6B6B6B]">{formatList(preferences.fields)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Jenjang:</span> <span className="text-[#6B6B6B] uppercase">{preferences.educationLevel}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Bahasa:</span> <span className="text-[#6B6B6B]">{formatList(preferences.languages)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Budget:</span> <span className="text-[#6B6B6B] uppercase">{preferences.budget}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Tipe beasiswa:</span> <span className="text-[#6B6B6B]">{formatList(preferences.scholarships)}</span></p>
            <p><span className="font-semibold text-[#2b2b2b]">Periode mulai:</span> <span className="text-[#6B6B6B]">{preferences.startPeriod}</span></p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <Button 
          variant="outline" 
          className="flex-1 py-6 rounded-xl border-[#E8E8E8] font-semibold text-[#6B6B6B]" 
          onClick={onEdit}
        >
          Edit Preferensi
        </Button>
        <Button 
          className="flex-1 py-6 bg-[#2b2b2b] hover:bg-[#1a1a1a] text-white rounded-xl font-semibold transition-all shadow-md"
          onClick={onSubmit}
        >
          Submit untuk Rekomendasi
        </Button>
      </div>
    </div>
  );
}