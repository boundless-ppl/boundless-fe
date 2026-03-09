"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentStep } from "./DocumentStep";
import { PreferenceStep } from "./PreferenceStep";
import { SummaryStep } from "./SummaryStep";
import { ResultStep } from "./ResultStep";
import { FileData, PreferenceData, ModalStep } from "./types";
import { submitRecommendation, ApiError } from "@/services/recommendation.service";
import type { RecommendationFormData, RecommendationResult } from "@/lib/api-types";
import { Loader2 } from "lucide-react";

export function UploadModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState<ModalStep>("upload");
  const [files, setFiles] = useState<{ cv: FileData; transcript: FileData } | null>(null);
  const [preferences, setPreferences] = useState<PreferenceData | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocumentSubmit = (cv: FileData, transcript: FileData) => {
    setFiles({ cv, transcript });
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

    setIsLoading(true);
    setError(null);

    try {
      // Build request data
      const requestData: RecommendationFormData = {
        cv_file: files.cv.file,
        transcript_file: files.transcript.file,
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

      console.log("=== SUBMITTING RECOMMENDATION ===");
      console.log("Request data prepared:", {
        hasCV: !!requestData.cv_file,
        hasTranscript: !!requestData.transcript_file,
        preferences: {
          continents: requestData.continents,
          countries: requestData.countries,
          fields: requestData.fields_of_study,
          degreeLevel: requestData.degree_level,
        },
      });

      const response = await submitRecommendation(requestData);

      console.log("=== RECOMMENDATION RECEIVED ===");
      console.log("Submission ID:", response.submission_id);
      console.log("Status:", response.status);
      console.log("Top recommendations count:", response.result.top_recommendations.length);

      setResult(response.result);
      setStep("result");
    } catch (err) {
      console.error("=== RECOMMENDATION ERROR ===", err);
      
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

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("upload");
      setFiles(null);
      setPreferences(null);
      setResult(null);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-175 p-0 overflow-hidden rounded-3xl border-none font-sans">
        <DialogHeader className="px-8 py-6 border-b border-[#e8e8e8] bg-white sticky top-0 z-10">
          <DialogTitle className="text-[#2b2b2b] text-[18px] font-semibold text-center md:text-left">
            {step === "result" ? "Hasil Rekomendasi" : "Submit untuk Rekomendasi"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          {/* Loading State */}
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

          {/* Error State */}
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

          {/* Steps */}
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
              {step === "result" && result && (
                <ResultStep result={result} onClose={handleClose} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}