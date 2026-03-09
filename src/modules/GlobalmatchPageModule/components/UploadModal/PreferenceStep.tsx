import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PreferenceData } from "./types";
import { 
  REGIONS, 
  COUNTRIES, 
  FIELDS_OF_STUDY, 
  EDUCATION_LEVELS, 
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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [budgetPreference, setBudgetPreference] = useState<string>("");
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);
  const [startPeriod, setStartPeriod] = useState<string>("");
  const [additionalPreferences, setAdditionalPreferences] = useState<string>("");

  const toggleMulti = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    state.includes(item) 
      ? setState(state.filter(i => i !== item)) 
      : setState([...state, item]);
  };

  const handleFormSubmit = () => {
    onSubmit({
      regions: selectedRegions,
      countries: selectedCountries,
      fields: selectedFields,
      educationLevel,
      languages: selectedLanguages,
      budget: budgetPreference,
      scholarships: scholarshipTypes,
      startPeriod,
      additional: additionalPreferences,
    });
  };

  return (
    <div className="px-8 py-8 space-y-8 animate-in slide-in-from-right-4 duration-300 font-sans">
      <div>
        <h2 className="text-[24px] font-bold text-[#2b2b2b] mb-2">Preferensi Rekomendasi</h2>
        <p className="text-[#9b9b9b] text-[13px]">Beritahu kami preferensi Anda agar kami dapat memberikan rekomendasi yang lebih tepat</p>
      </div>

      <div className="space-y-8">
        {/* Wilayah */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Dimana pilihan wilayah Anda?</label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <Pill key={r} label={r} active={selectedRegions.includes(r)} onClick={() => toggleMulti(r, selectedRegions, setSelectedRegions)} />
            ))}
          </div>
        </div>

        {/* Negara */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Negara pilihan</label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <Pill key={c} label={c} active={selectedCountries.includes(c)} onClick={() => toggleMulti(c, selectedCountries, setSelectedCountries)} />
            ))}
          </div>
        </div>

        {/* Bidang Studi */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Bidang studi</label>
          <div className="flex flex-wrap gap-2">
            {FIELDS_OF_STUDY.map(f => (
              <Pill key={f} label={f} active={selectedFields.includes(f)} onClick={() => toggleMulti(f, selectedFields, setSelectedFields)} />
            ))}
          </div>
        </div>

        {/* Jenjang Pendidikan */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Jenjang pendidikan *</label>
          <div className="flex flex-wrap gap-2">
            {EDUCATION_LEVELS.map(lvl => (
              <Pill key={lvl.value} label={lvl.label} active={educationLevel === lvl.value} onClick={() => setEducationLevel(lvl.value)} />
            ))}
          </div>
        </div>

        {/* Bahasa */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Bahasa pengantar</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <Pill key={l} label={l} active={selectedLanguages.includes(l)} onClick={() => toggleMulti(l, selectedLanguages, setSelectedLanguages)} />
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Preferensi budget tahunan (USD)</label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_PREFERENCES.map(b => (
              <Pill key={b.value} label={b.label} active={budgetPreference === b.value} onClick={() => setBudgetPreference(b.value)} />
            ))}
          </div>
        </div>

        {/* Tipe Beasiswa */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Tipe beasiswa yang dicari</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCHOLARSHIP_TYPES.map(s => (
              <label key={s.value} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
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
        </div>

        {/* Periode Mulai */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Rencana periode mulai</label>
          <div className="flex flex-wrap gap-2">
            {START_PERIODS.map(p => (
              <Pill key={p} label={p} active={startPeriod === p} onClick={() => setStartPeriod(p)} />
            ))}
          </div>
        </div>

        {/* Tambahan */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-[#2b2b2b]">Preferensi tambahan (Opsional)</label>
          <textarea 
            className="w-full p-4 border border-[#e8e8e8] rounded-xl text-[14px] focus:outline-none focus:border-[#fa8613] min-h-[100px]"
            placeholder="Contoh: Saya mencari universitas yang dekat dengan pusat industri teknologi..."
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
          />
        </div>
      </div>

      {/* Navigasi */}
      <div className="flex gap-3 pt-6 border-t border-[#e8e8e8] sticky bottom-0 bg-white z-10">
        <Button variant="outline" className="flex-1 py-6 rounded-xl border-[#e8e8e8]" onClick={onBack}>
          Kembali
        </Button>
        <Button 
          className="flex-1 py-6 bg-[#2b2b2b] text-white rounded-xl hover:bg-[#1a1a1a]" 
          disabled={!educationLevel}
          onClick={handleFormSubmit}
        >
          Submit Rekomendasi
        </Button>
      </div>
    </div>
  );
}