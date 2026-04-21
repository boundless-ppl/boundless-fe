import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PreferenceData } from "./types";

export interface SummaryStepProps {
  readonly files: { readonly cv: { readonly name: string } | null; readonly transcript: { readonly name: string } | null };
  readonly preferences: Readonly<PreferenceData>;
  readonly onEdit: () => void;
  readonly onSubmit: () => void;
  readonly isSubmitting?: boolean;
}

function TagList({ items }: Readonly<{ items: string[] }>) {
  if (items.length === 0) return <span className="text-[12px] text-[#c0b8ae]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item) => (
        <span
          key={item}
          className="inline-block rounded-full border border-[#e8dfd4] bg-[#fdf8f2] px-2.5 py-0.5 text-[11px] font-medium text-[#6b6b6b]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function PreferenceRow({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9b9b]">{label}</p>
      {children}
    </div>
  );
}

export function SummaryStep({
  files,
  preferences,
  onEdit,
  onSubmit,
  isSubmitting = false,
}: Readonly<SummaryStepProps>) {
  const educationLabel = preferences.educationLevel === "master" ? "S2/Master" : preferences.educationLevel;
  const fieldOfStudyValue = [
    ...preferences.fields,
    ...(preferences.customField.trim() ? [preferences.customField.trim()] : []),
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 px-8 py-7 font-sans duration-300">
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-[#0a0a0a] md:text-[26px]">
          Tinjau Submission
        </h2>
        <p className="mt-1 text-[13px] text-[#9b9b9b]">
          Pastikan semua informasi sudah benar sebelum submit.
        </p>
      </div>

      <div className="space-y-4 rounded-[20px] border border-[#ede4d7] bg-[#fffaf4] p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9b9b] mb-2">Dokumen</p>
          <div className="space-y-2">
            {files.cv && (
              <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e8dfd4] bg-white px-3 py-2.5">
                <FileText className="w-4 h-4 shrink-0 text-[#fa8613]" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9b9b9b]">CV</p>
                  <p className="text-[13px] font-medium text-[#2b2b2b] truncate">{files.cv.name}</p>
                </div>
              </div>
            )}
            {files.transcript && (
              <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e8dfd4] bg-white px-3 py-2.5">
                <FileText className="w-4 h-4 shrink-0 text-[#fa8613]" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9b9b9b]">Transkrip</p>
                  <p className="text-[13px] font-medium text-[#2b2b2b] truncate">{files.transcript.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#ede4d7] pt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <PreferenceRow label="Negara">
            <TagList items={preferences.countries} />
          </PreferenceRow>

          <PreferenceRow label="Bidang Studi">
            <TagList items={fieldOfStudyValue} />
          </PreferenceRow>

          <PreferenceRow label="Jenjang">
            <TagList items={[educationLabel]} />
          </PreferenceRow>

          <PreferenceRow label="Bahasa">
            <TagList items={preferences.languages} />
          </PreferenceRow>

          <PreferenceRow label="Budget">
            {preferences.budget ? (
              <span className="mt-1 inline-block rounded-full border border-[#e8dfd4] bg-[#fdf8f2] px-2.5 py-0.5 text-[11px] font-medium uppercase text-[#6b6b6b]">
                {preferences.budget}
              </span>
            ) : (
              <span className="text-[12px] text-[#c0b8ae]">—</span>
            )}
          </PreferenceRow>

          <PreferenceRow label="Tipe Beasiswa">
            <TagList items={preferences.scholarships} />
          </PreferenceRow>

          <PreferenceRow label="Periode Mulai">
            {preferences.startPeriod ? (
              <TagList items={[preferences.startPeriod]} />
            ) : (
              <span className="text-[12px] text-[#c0b8ae]">—</span>
            )}
          </PreferenceRow>

          {preferences.additional.trim() && (
            <div className="md:col-span-2 space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9b9b]">Catatan Tambahan</p>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed">{preferences.additional.trim()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1 rounded-[14px] border-[#e8e8e8] py-6 text-[13px] font-semibold text-[#6b6b6b]"
          onClick={onEdit}
          disabled={isSubmitting}
        >
          Edit Preferensi
        </Button>
        <Button
          className="flex-1 rounded-[14px] bg-[#f58a1f] py-6 text-[13px] font-semibold text-white hover:bg-[#dd7611] transition-colors shadow-sm"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Submit Rekomendasi"}
        </Button>
      </div>
    </div>
  );
}
