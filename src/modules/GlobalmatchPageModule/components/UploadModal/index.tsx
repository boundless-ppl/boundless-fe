"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentStep } from "./DocumentStep";
import { PreferenceStep } from "./PreferenceStep";
import { SummaryStep } from "./SummaryStep";
import { PreferenceData, ModalStep, SelectedFiles } from "./types";
import {
  submitRecommendation,
  ApiError,
  getRecommendationErrorMessage,
} from "@/features/globalmatch/services/recommendation.service";
import type { RecommendationFormData } from "@/lib/api-types";
import { Loader2 } from "lucide-react";

interface UploadModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function extractSubmissionId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const direct =
    record.submission_id ??
    record.submissionId ??
    record.id;

  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const nestedCandidates = [record.data, record.result, record.submission];
  for (const candidate of nestedCandidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const nested = candidate as Record<string, unknown>;
    const nestedId =
      nested.submission_id ??
      nested.submissionId ??
      nested.id;
    if (typeof nestedId === "string" && nestedId.trim()) {
      return nestedId.trim();
    }
  }

  return null;
}

const STEPS: { key: ModalStep; label: string }[] = [
  { key: "upload", label: "Dokumen" },
  { key: "preferences", label: "Preferensi" },
  { key: "summary", label: "Ringkasan" },
];

function getDotClass(done: boolean, active: boolean): string {
  if (done) return "bg-[#fa8613] text-white";
  if (active) return "bg-[#fa8613] text-white ring-4 ring-[#fa8613]/20";
  return "bg-[#f0ebe3] text-[#9b9b9b]";
}

function getLabelClass(done: boolean, active: boolean): string {
  if (done || active) return "text-[#fa8613]";
  return "text-[#c0b8ae]";
}

function StepIndicator({ current }: Readonly<{ current: ModalStep }>) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mt-3">
      {STEPS.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${getDotClass(done, active)}`}
              >
                {done ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${getLabelClass(done, active)}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mb-4 mx-2 h-[2px] w-10 rounded-full transition-colors ${i < currentIndex ? "bg-[#fa8613]" : "bg-[#e8e0d5]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<ModalStep>("upload");
  const [files, setFiles] = useState<SelectedFiles | null>(null);
  const [preferences, setPreferences] = useState<PreferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const submitLockRef = useRef(false);
  const loadingMessages = [
    "Membaca dokumen CV dan transkrip...",
    "Menyusun profil akademik dan preferensi...",
    "Menyiapkan rekomendasi program terbaik...",
  ];

  const handleDocumentSubmit = (selectedFiles: SelectedFiles) => {
    setFiles(selectedFiles);
    setStep("preferences");
  };

  const handlePreferenceSubmit = (data: PreferenceData) => {
    setPreferences(data);
    setStep("summary");
  };

  const handleFinalSubmit = async () => {
    if (submitLockRef.current) return;
    if (!files || !preferences) {
      setError("Missing files or preferences");
      return;
    }
    if (!files.cv && !files.transcript) {
      setError("Pilih minimal satu dokumen untuk dianalisis.");
      return;
    }

    submitLockRef.current = true;
    setIsLoading(true);
    setLoadingStep(0);
    setError(null);

    try {
      const mergedAdditionalPreference = [
        preferences.customField.trim()
          ? `Bidang studi tambahan: ${preferences.customField.trim()}`
          : "",
        preferences.additional.trim(),
      ]
        .filter(Boolean)
        .join("\n");

      const requestData: RecommendationFormData = {
        cv_file: files.cv?.file,
        transcript_file: files.transcript?.file,
        continents: [],
        countries: preferences.countries,
        fields_of_study: preferences.fields,
        degree_level: preferences.educationLevel,
        languages: preferences.languages,
        budget_preferences: preferences.budget ? [preferences.budget] : [],
        scholarship_types: preferences.scholarships,
        start_periods: preferences.startPeriod ? [preferences.startPeriod] : [],
        additional_preference: mergedAdditionalPreference,
      };

      const response = await submitRecommendation(requestData);
      const submissionId = extractSubmissionId(response);
      if (!submissionId) {
        throw new Error("ID submission tidak ditemukan dari server. Silakan coba lagi.");
      }

      const resultWithPreferences = {
        ...response,
        submission_id: submissionId,
        preferred_countries: preferences.countries,
      };

      if (response.result && Array.isArray(response.result.top_recommendations)) {
        sessionStorage.setItem(
          `globalmatch_result_${submissionId}`,
          JSON.stringify(resultWithPreferences)
        );
      }

      handleClose();
      router.push(`/globalmatch/results/${encodeURIComponent(submissionId)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getRecommendationErrorMessage(err));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      submitLockRef.current = false;
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
    globalThis.addEventListener("dialog-close", handler);
    return () => globalThis.removeEventListener("dialog-close", handler);
  }, [handleClose]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = globalThis.setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1300);
    return () => globalThis.clearInterval(timer);
  }, [isLoading, loadingMessages.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[88vh] max-w-[calc(100vw-2rem)] rounded-[28px] border border-[#eadfce] p-0 font-sans shadow-[0_28px_80px_rgba(31,41,55,0.18)] sm:max-w-[calc(100vw-3rem)] xl:max-w-345 2xl:max-w-380">
        <DialogHeader className="sticky top-0 z-10 border-b border-[#ebe2d5] bg-white px-8 pb-4 pt-5 rounded-t-[28px]">
          <DialogTitle className="text-center text-[15px] font-semibold tracking-wide text-[#9b9b9b] uppercase">
            Globalmatch
          </DialogTitle>
          {!isLoading && !error && <StepIndicator current={step} />}
        </DialogHeader>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(88vh - 90px)" }}>
          {isLoading && (
            <div className="px-8 py-16 flex flex-col items-center justify-center gap-5">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full bg-[#fa8613]/10" />
                <Loader2 className="relative w-9 h-9 text-[#fa8613] animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-[17px] font-semibold text-[#2b2b2b]">
                  Menganalisis Profil Anda...
                </h3>
                <p className="text-[13px] text-[#9b9b9b] min-h-[20px] transition-all">
                  {loadingMessages[loadingStep]}
                </p>
              </div>
              <div className="w-full max-w-sm space-y-3">
                <div className="h-3 w-32 animate-pulse rounded-full bg-[#f0e8de]" />
                <div className="h-20 animate-pulse rounded-2xl bg-[#f6f7fb]" />
                <div className="h-20 animate-pulse rounded-2xl bg-[#f6f7fb]" />
                <div className="h-20 animate-pulse rounded-2xl bg-[#f6f7fb]" />
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="px-8 py-10 flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#2b2b2b] mb-1">Terjadi Kesalahan</p>
                <p className="text-[13px] text-[#9b9b9b] max-w-xs">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-1 rounded-xl bg-[#fa8613] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#dd7611] transition-colors"
              >
                Coba Lagi
              </button>
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
                  isSubmitting={isLoading}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
