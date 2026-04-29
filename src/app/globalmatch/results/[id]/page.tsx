"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileSubmissionResponse, SubmissionDetails } from "@/lib/api-types";
import { getSubmissionDetails } from "@/features/globalmatch/services/recommendation.service";
import { RecommendationDisplay } from "@/modules/GlobalmatchPageModule/components/ResultsPage/RecommendationDisplay";

function mapSubmissionDetailsToProfileResult(
  details: SubmissionDetails,
  submissionId: string
): ProfileSubmissionResponse | null {
  const latestResult = details.latest_result;
  const programs = latestResult?.results;
  const preferredCountries = Array.isArray(details.preferences)
    ? details.preferences
        .filter((preference) => preference.pref_key === "countries")
        .map((preference) => preference.pref_value)
        .filter(Boolean)
    : [];

  if (!latestResult || !Array.isArray(programs) || programs.length === 0) {
    return null;
  }

  return {
    submission_id: details.submission_id || submissionId,
    status: details.status === "completed" ? "completed" : "processing",
    result_set_id: latestResult.result_set_id,
    preferred_countries: preferredCountries,
    result: {
      student_profile_summary: {
        academic_background: "Ringkasan profil akademik tidak tersedia pada hasil server ini.",
        key_strengths: [],
        considerations: [],
        recommended_tracks: [],
        language_evidence: "not_available",
      },
      top_recommendations: programs.map((program) => ({
        rank: program.rank_no,
        program_id: program.program_id,
        admission_id: program.admission_id,
        source_rec_result_id: program.source_rec_result_id ?? program.rec_result_id,
        university_name: program.university_name,
        program_name: program.program_name,
        country: program.country,
        fit_score: program.fit_score,
        admission_chance_score: program.admission_chance_score ?? 0,
        overall_recommendation_score: program.overall_recommendation_score ?? program.fit_score,
        fit_level: program.fit_level,
        admission_difficulty: program.admission_difficulty ?? "moderate",
        score_breakdown: program.score_breakdown ?? {
          academic_fit: program.fit_score,
          preference_match: program.fit_score,
          curriculum_relevance: program.fit_score,
          admission_chance: program.admission_chance_score ?? 0,
        },
        overview: program.overview,
        why_this_university: program.why_this_university,
        why_this_program: program.why_this_program,
        preference_reasoning: (program.preference_reasoning && program.preference_reasoning.length > 0)
          ? program.preference_reasoning
          : [program.reason_summary].filter(Boolean),
        match_evidence: (program.match_evidence && program.match_evidence.length > 0)
          ? program.match_evidence
          : [program.reason_summary].filter(Boolean),
        scholarship_recommendations: program.scholarship_recommendations ?? [],
        pros: program.pros,
        cons: program.cons,
      })),
      selection_reasoning: "Hasil dimuat dari server menggunakan ringkasan recommendation terbaru.",
      application_strategy: {
        ambitious: "Belum tersedia pada response server.",
        target: "Belum tersedia pada response server.",
        balanced_option: "Belum tersedia pada response server.",
      },
      final_notes: [],
    },
  };
}

export default function GlobalmatchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [result, setResult] = useState<ProfileSubmissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedData = sessionStorage.getItem(`globalmatch_result_${submissionId}`);
        if (storedData) {
          const parsedData: ProfileSubmissionResponse = JSON.parse(storedData);
          setResult(parsedData);
        } else {
          const details = await getSubmissionDetails(submissionId);
          const fallbackResult = mapSubmissionDetailsToProfileResult(details, submissionId);

          if (!fallbackResult) {
            setError("Hasil rekomendasi tidak ditemukan. Silakan submit ulang.");
            return;
          }

          setResult(fallbackResult);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat hasil rekomendasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [submissionId]);

  const handleBackToHome = () => {
    sessionStorage.removeItem(`globalmatch_result_${submissionId}`);
    router.push("/globalmatch");
  };

  const handleNewSubmission = () => {
    sessionStorage.removeItem(`globalmatch_result_${submissionId}`);
    router.push("/globalmatch");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f1_0%,#f8fafc_38%,#ffffff_100%)]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            
            <h1 className="text-center text-lg font-semibold text-slate-950 sm:text-xl">
              Hasil rekomendasi Globalmatch
            </h1>

            <Button
              onClick={handleNewSubmission}
              variant="outline"
              className="rounded-2xl border-[#f58a1f] text-[#f58a1f] hover:bg-[#f58a1f] hover:text-white"
            >
              Submit Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-24">
            <Loader2 className="h-16 w-16 animate-spin text-[#fa8613]" />
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-slate-950">
                Memuat hasil...
              </h3>
              <p className="text-slate-600">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-950">
                Terjadi Kesalahan
              </h3>
              <p className="mb-6 text-slate-600">{error}</p>
              <div className="flex justify-center gap-3">
                <Button onClick={handleBackToHome} variant="outline" className="rounded-2xl">
                  Kembali ke Beranda
                </Button>
                <Button
                  onClick={() => globalThis.location.reload()}
                  className="rounded-2xl bg-[#fa8613] hover:bg-[#e07612]"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success State - Display Results */}
        {result && !isLoading && !error && (
          <RecommendationDisplay
            result={result}
            preferredCountries={result.preferred_countries ?? []}
          />
        )}
      </div>
    </div>
  );
}
