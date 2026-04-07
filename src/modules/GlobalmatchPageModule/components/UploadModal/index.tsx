"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentStep } from "./DocumentStep";
import { PreferenceStep } from "./PreferenceStep";
import { SummaryStep } from "./SummaryStep";
import { PreferenceData, ModalStep, SelectedFiles } from "./types";
import { submitRecommendation, ApiError } from "@/features/globalmatch/services/recommendation.service";
import type { RecommendationFormData } from "@/lib/api-types";
import { Loader2 } from "lucide-react";

export function UploadModal({ open, onOpenChange }: Readonly<{ open: boolean; onOpenChange: (o: boolean) => void }>) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>("upload");
  const [files, setFiles] = useState<SelectedFiles | null>(null);
  const [preferences, setPreferences] = useState<PreferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocumentSubmit = (selectedFiles: SelectedFiles) => {
    setFiles(selectedFiles);
    setStep("preferences");
  };

  const handlePreferenceSubmit = (data: PreferenceData) => {
    setPreferences(data);
    setStep("summary");
  };

  const handleFinalSubmit = async () => {
    if (!files || !preferences) {
      setError("Missing files or preferences");
      return;
    }
    if (!files.cv && !files.transcript) {
      setError("Pilih minimal satu dokumen untuk dianalisis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData: RecommendationFormData = {
        cv_file: files.cv?.file,
        transcript_file: files.transcript?.file,
        continents: preferences.regions,
        countries: preferences.countries,
        fields_of_study: preferences.fields,
        degree_level: preferences.educationLevel,
        languages: preferences.languages,
        budget_preferences: preferences.budget ? [preferences.budget] : [],
        scholarship_types: preferences.scholarships,
        start_periods: preferences.startPeriod ? [preferences.startPeriod] : [],
        additional_preference: preferences.additional || "",
      };

      const response = await submitRecommendation(requestData);

      sessionStorage.setItem(
        `globalmatch_result_${response.submission_id}`,
        JSON.stringify(response)
      );

      handleClose();
      router.push(`/globalmatch/results/${response.submission_id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Error ${err.statusCode}: ${err.message}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("upload");
      setFiles(null);
      setPreferences(null);
      setError(null);
    }, 300);
  }, [onOpenChange]);

  useEffect(() => {
    const handler = () => handleClose();

    window.addEventListener("dialog-close", handler);
    return () => window.removeEventListener("dialog-close", handler);
  }, [handleClose]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[80%] max-w-[calc(100vw-2rem)] rounded-xl border border-[#eadfce] p-0 font-sans shadow-[0_28px_80px_rgba(31,41,55,0.16)] sm:max-w-[calc(100vw-3rem)] xl:max-w-345 2xl:max-w-380">
        <DialogHeader className="sticky top-0 z-10 border-b border-[#ebe2d5] px-8 py-3 md:py-5 rounded-t-xl">
          <DialogTitle className="text-center text-[18px] font-semibold text-[#2b2b2b] md:text-left">
            Globalmatch
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(100vh-3rem)] overflow-y-auto">
          {isLoading && (
            <div className="px-8 py-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#fa8613] animate-spin" />
              <div className="text-center">
                <h3 className="text-[18px] font-semibold text-[#2b2b2b] mb-2">
                  Menganalisis Profil Anda...
                </h3>
                <p className="text-[14px] text-[#9b9b9b]">
                  Mohon tunggu, kami sedang mencari program terbaik untuk Anda
                </p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="px-8 py-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-600 text-[16px] font-semibold mb-2">
                  Terjadi Kesalahan
                </div>
                <div className="text-[14px] text-red-700 mb-4">{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {step === "upload" && <DocumentStep onNext={handleDocumentSubmit} />}
              {step === "preferences" && (
                <PreferenceStep onBack={() => setStep("upload")} onSubmit={handlePreferenceSubmit} />
              )}
              {step === "summary" && files && preferences && (
                <SummaryStep 
                  files={files} 
                  preferences={preferences} 
                  onEdit={() => setStep("preferences")} 
                  onSubmit={handleFinalSubmit} 
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
