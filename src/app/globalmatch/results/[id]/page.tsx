"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileSubmissionResponse } from "@/lib/api-types";
import { GLOBALMATCH_FEATURE_FLAGS } from "@/modules/GlobalmatchPageModule/constant";
import { RecommendationDisplay } from "@/modules/GlobalmatchPageModule/components/ResultsPage/RecommendationDisplay";

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

        // Check if using mock data
        if (GLOBALMATCH_FEATURE_FLAGS.USE_MOCK_DATA) {
          // Retrieve mock data from sessionStorage
          const mockData = sessionStorage.getItem(`globalmatch_result_${submissionId}`);
          if (mockData) {
            const parsedData: ProfileSubmissionResponse = JSON.parse(mockData);
            setResult(parsedData);
          } else {
            setError("Result tidak ditemukan. Silakan submit ulang.");
          }
        } else {
          // Fetch from real API
          // Note: For now, we'll try to get from sessionStorage as well
          // In production, this would call the API
          const storedData = sessionStorage.getItem(`globalmatch_result_${submissionId}`);
          if (storedData) {
            const parsedData: ProfileSubmissionResponse = JSON.parse(storedData);
            setResult(parsedData);
          } else {
            // Fallback to API call (when backend is ready)
            // const data = await getSubmissionDetails(submissionId);
            // setResult(data);
            setError("Hasil tidak ditemukan di cache. Fitur API sedang dalam pengembangan.");
          }
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat hasil rekomendasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [submissionId]);

  const handleBackToHome = () => {
    // Clear session storage
    if (GLOBALMATCH_FEATURE_FLAGS.USE_MOCK_DATA) {
      sessionStorage.removeItem(`globalmatch_result_${submissionId}`);
    }
    router.push("/globalmatch");
  };

  const handleNewSubmission = () => {
    // Clear session storage
    if (GLOBALMATCH_FEATURE_FLAGS.USE_MOCK_DATA) {
      sessionStorage.removeItem(`globalmatch_result_${submissionId}`);
    }
    router.push("/globalmatch");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">
              Hasil Rekomendasi GlobalMatch AI
            </h1>

            <Button
              onClick={handleNewSubmission}
              variant="outline"
              className="border-[#fa8613] text-[#fa8613] hover:bg-[#fa8613] hover:text-white"
            >
              Submit Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-16 h-16 text-[#fa8613] animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Memuat hasil...
              </h3>
              <p className="text-gray-600">
                Mohon tunggu sebentar
              </p>
              {GLOBALMATCH_FEATURE_FLAGS.USE_MOCK_DATA && (
                <p className="text-sm text-orange-600 mt-2 font-medium">
                  🔧 Mode: Mock Data (Development)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleBackToHome} variant="outline">
                  Kembali ke Beranda
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#fa8613] hover:bg-[#e07612]"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success State - Display Results */}
        {result && !isLoading && !error && (
          <RecommendationDisplay result={result} />
        )}
      </div>
    </div>
  );
}
