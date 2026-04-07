import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PreferenceData } from "./types";
import { 
  COUNTRIES, 
  FIELDS_OF_STUDY, 
  LANGUAGES, 
  BUDGET_PREFERENCES, 
  SCHOLARSHIP_TYPES, 
  START_PERIODS 
} from "../../constant";

interface PreferenceStepProps {
  onBack: () => void;
  onSubmit: (data: PreferenceData) => void;
}

export function PreferenceStep({ onBack, onSubmit }: PreferenceStepProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customField, setCustomField] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [budgetPreference, setBudgetPreference] = useState<string>("");
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);
  const [startPeriod, setStartPeriod] = useState<string>("");
  const [additionalPreferences, setAdditionalPreferences] = useState<string>("");

  const toggleMulti = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
      return;
    }

    setState([...state, item]);
  };

  const handleFormSubmit = () => {
    onSubmit({
      countries: selectedCountries,
      fields: selectedFields,
      customField,
      educationLevel: "master",
      languages: selectedLanguages,
      budget: budgetPreference,
      scholarships: scholarshipTypes,
      startPeriod,
      additional: additionalPreferences,
    });
  };

  const getSectionId = (name: string) => `${name}-section`;

  return (
    <div className="animate-in slide-in-from-right-4 space-y-6 px-8 py-8 font-sans duration-300">
      <div>
        <h2 className="text-[24px] font-bold text-[#2b2b2b] mb-2">Preferensi Rekomendasi</h2>
        <p className="text-[#9b9b9b] text-[13px]">Beritahu kami preferensi Anda agar kami dapat memberikan rekomendasi yang lebih tepat</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Negara pilihan</label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <Pill key={c} label={c} active={selectedCountries.includes(c)} onClick={() => toggleMulti(c, selectedCountries, setSelectedCountries)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <legend className="text-[13px] font-medium text-[#2b2b2b]">Bidang studi</legend>
          <div id={getSectionId("fields")} className="flex flex-wrap gap-2">
            {FIELDS_OF_STUDY.map(f => (
              <Pill key={f} label={f} active={selectedFields.includes(f)} onClick={() => toggleMulti(f, selectedFields, setSelectedFields)} />
            ))}
          </div>
          <textarea
            className="min-h-[76px] w-full rounded-xl border border-[#e8e8e8] p-4 text-[14px] focus:outline-none focus:border-[#fa8613]"
            placeholder="Tambahkan bidang studi lainnya (opsional)"
            value={customField}
            onChange={(e) => setCustomField(e.target.value)}
          />
        </div>

        <div className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Jenjang pendidikan *</label>
          <div className="flex flex-wrap gap-2">
            <Pill label="S2/Master" active onClick={() => {}} />
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <legend className="text-[13px] font-medium text-[#2b2b2b]">Bahasa pengantar</legend>
          <div id={getSectionId("languages")} className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <Pill key={l} label={l} active={selectedLanguages.includes(l)} onClick={() => toggleMulti(l, selectedLanguages, setSelectedLanguages)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <legend className="text-[13px] font-medium text-[#2b2b2b]">Preferensi budget tahunan (USD)</legend>
          <div id={getSectionId("budget")} className="flex flex-wrap gap-2">
            {BUDGET_PREFERENCES.map(b => (
              <Pill key={b.value} label={b.label} active={budgetPreference === b.value} onClick={() => setBudgetPreference(b.value)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <legend className="text-[13px] font-medium text-[#2b2b2b]">Tipe beasiswa yang dicari</legend>
          <div id={getSectionId("scholarships")} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCHOLARSHIP_TYPES.map(s => (
              <label key={s.value} className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-[#fa8613]" 
                  checked={scholarshipTypes.includes(s.value)}
                  onChange={() => toggleMulti(s.value, scholarshipTypes, setScholarshipTypes)}
                />
                <span className="text-[14px] text-[#2b2b2b]">{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5">
          <legend className="text-[13px] font-medium text-[#2b2b2b]">Rencana periode mulai</legend>
          <div id={getSectionId("start-period")} className="flex flex-wrap gap-2">
            {START_PERIODS.map(p => (
              <Pill key={p} label={p} active={startPeriod === p} onClick={() => setStartPeriod(p)} />
            ))}
          </div>
        </fieldset>

        <div className="space-y-3 rounded-[22px] border border-[#ece4d8] bg-white p-5 xl:col-span-2">
          <label htmlFor="additional-preferences" className="text-[13px] font-medium text-[#2b2b2b]">Preferensi tambahan (Opsional)</label>
          <textarea 
            id="additional-preferences"
            className="min-h-23 w-full rounded-xl border border-[#e8e8e8] p-4 text-[14px] focus:outline-none focus:border-[#fa8613]"
            placeholder="Contoh: Saya mencari universitas yang dekat dengan pusat industri teknologi..."
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#f0e6d7] pt-5">
        <Button variant="outline" className="flex-1 rounded-xl border-[#e8e8e8] py-6" onClick={onBack}>
          Kembali
        </Button>
        <Button 
          className="flex-1 rounded-xl bg-[#f58a1f] py-6 text-white hover:bg-[#dd7611]" 
          onClick={handleFormSubmit}
        >
          Lanjut ke Ringkasan
        </Button>
      </div>
    </div>
  );
}
