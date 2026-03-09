import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  Award
} from "lucide-react";
import type { ProfileSubmissionResponse, ProgramRecommendation } from "@/lib/api-types";

interface RecommendationDisplayProps {
  result: ProfileSubmissionResponse;
}

function RecommendationCard({ program }: { program: ProgramRecommendation }) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine match badge color based on fit score
  const getMatchBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-blue-600";
    return "bg-orange-600";
  };

  // Determine difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      moderate: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return colors[difficulty as keyof typeof colors] || colors.moderate;
  };

  return (
    <div className="border border-[#e8e8e8] rounded-xl bg-white overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with Match Badge */}
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${getMatchBadgeColor(program.fit_score)} text-white border-none px-3 py-1 text-[14px] font-bold`}>
                {program.fit_score}% Match
              </Badge>
              <Badge className={`${getDifficultyBadge(program.admission_difficulty)} border-none px-3 py-1 text-[13px] font-semibold`}>
                {program.admission_difficulty === "low" ? "Mudah" : program.admission_difficulty === "moderate" ? "Sedang" : "Kompetitif"}
              </Badge>
            </div>
            
            <h3 className="text-[20px] md:text-[22px] font-bold text-[#2b2b2b] mb-2">
              {program.program_name}
            </h3>
            <p className="text-[16px] text-[#666] font-medium mb-1">{program.university_name}</p>
            <p className="text-[14px] text-[#9b9b9b]">#{program.rank} Global (QS 2024)</p>
          </div>
        </div>

        {/* Quick Info Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-[#f5f5f5] p-2.5 rounded-lg">
              <MapPin className="w-5 h-5 text-[#666]" />
            </div>
            <div>
              <p className="text-[12px] text-[#9b9b9b]">Negara</p>
              <p className="text-[14px] font-semibold text-[#2b2b2b]">{program.country}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#f5f5f5] p-2.5 rounded-lg">
              <Clock className="w-5 h-5 text-[#666]" />
            </div>
            <div>
              <p className="text-[12px] text-[#9b9b9b]">Durasi</p>
              <p className="text-[14px] font-semibold text-[#2b2b2b]">2 years</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f5f5f5] p-2.5 rounded-lg">
              <GraduationCap className="w-5 h-5 text-[#666]" />
            </div>
            <div>
              <p className="text-[12px] text-[#9b9b9b]">Peluang Diterima</p>
              <p className="text-[14px] font-semibold text-[#2b2b2b]">{program.admission_chance_score}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f5f5f5] p-2.5 rounded-lg">
              <Award className="w-5 h-5 text-[#666]" />
            </div>
            <div>
              <p className="text-[12px] text-[#9b9b9b]">Keseluruhan</p>
              <p className="text-[14px] font-semibold text-[#2b2b2b]">{program.overall_recommendation_score}%</p>
            </div>
          </div>
        </div>

        {/* Why We Recommend */}
        <div className="bg-[#f8f9fa] rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa8613]" />
            <h4 className="text-[15px] font-semibold text-[#2b2b2b]">
              Kenapa Kami Merekomendasikan:
            </h4>
          </div>
          <ul className="space-y-2">
            {program.match_evidence.slice(0, 3).map((evidence, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[14px] text-[#666]">
                <span className="text-[#fa8613] mt-0.5">•</span>
                <span>{evidence}</span>
              </li>
            ))}
            {program.preference_reasoning.slice(0, 2).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[14px] text-[#666]">
                <span className="text-[#fa8613] mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scholarship Info */}
        {program.scholarship_recommendations.length > 0 && (
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-700" />
              <span className="text-[14px] font-semibold text-yellow-900">
                Beasiswa Tersedia
              </span>
            </div>
            {program.scholarship_recommendations.slice(0, 2).map((scholarship, idx) => (
              <div key={idx} className="text-[13px] text-yellow-800 mb-1">
                <span className="font-medium">{scholarship.scholarship_name}:</span> {scholarship.coverage_summary}
              </div>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <div className="space-y-5 border-t border-[#e8e8e8] pt-5 animate-in slide-in-from-top-2 duration-200">
            {/* Overview */}
            <div>
              <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-2">Overview</h4>
              <p className="text-[14px] text-[#666] leading-relaxed">{program.overview}</p>
            </div>

            {/* Why This University */}
            <div>
              <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-2">Why This University</h4>
              <p className="text-[14px] text-[#666] leading-relaxed">{program.why_this_university}</p>
            </div>

            {/* Why This Program */}
            <div>
              <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-2">Why This Program</h4>
              <p className="text-[14px] text-[#666] leading-relaxed">{program.why_this_program}</p>
            </div>

            {/* Score Breakdown */}
            <div>
              <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-3">Score Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(program.score_breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span className="text-[#666] capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-semibold text-[#2b2b2b]">{value}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#fa8613] rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-2">Pros</h4>
                <ul className="space-y-1.5">
                  {program.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[14px] text-green-700">
                      <span className="mt-0.5">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {program.cons.length > 0 && (
                <div>
                  <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-2">Cons</h4>
                  <ul className="space-y-1.5">
                    {program.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[14px] text-orange-700">
                        <span className="mt-0.5">⚠</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* All Scholarships */}
            {program.scholarship_recommendations.length > 2 && (
              <div>
                <h4 className="text-[15px] font-semibold text-[#2b2b2b] mb-3">All Scholarships</h4>
                <div className="space-y-3">
                  {program.scholarship_recommendations.map((scholarship, idx) => (
                    <div key={idx} className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[14px] font-semibold text-[#2b2b2b]">
                          {scholarship.scholarship_name}
                        </span>
                        <Badge className={`text-[12px] ${
                          scholarship.selectivity === "high" ? "bg-red-100 text-red-700" :
                          scholarship.selectivity === "moderate" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        } border-none`}>
                          {scholarship.selectivity}
                        </Badge>
                      </div>
                      <p className="text-[13px] text-[#666] mb-1">{scholarship.coverage_summary}</p>
                      <p className="text-[13px] text-[#888] italic">{scholarship.eligibility_hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl border-[#e8e8e8] text-[#2b2b2b] hover:bg-gray-50"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Sembunyikan
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Lihat Detail Lengkap
            </>
          )}
        </Button>
        <Button
          className="flex-1 rounded-xl bg-[#2b2b2b] text-white hover:bg-[#1a1a1a]"
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(program.university_name + " " + program.program_name)}`, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Kunjungi Website
        </Button>
      </div>
    </div>
  );
}

export function RecommendationDisplay({ result }: RecommendationDisplayProps) {
  const { student_profile_summary, top_recommendations, application_strategy, final_notes } = result.result;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300 font-sans max-w-5xl mx-auto">
      {/* Success Header */}
      <div className="text-center pb-6">
        <div className="bg-green-50 rounded-full p-5 w-20 h-20 mx-auto mb-5 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#2b2b2b] mb-3">
          ✨ Analisis Selesai!
        </h2>
        <p className="text-[16px] text-[#666] mb-2">
          Berdasarkan CV dan transkrip Anda, kami menemukan{" "}
          <span className="font-semibold text-[#fa8613]">{top_recommendations.length} program</span> yang sesuai dengan profil Anda
        </p>
      </div>

      {/* Student Profile Summary */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 rounded-full p-2.5">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#2b2b2b]">
            Ringkasan Profil Anda
          </h3>
        </div>
        <div className="space-y-3 text-[14px]">
          <p className="text-[#666]">
            <span className="font-medium text-[#2b2b2b]">Background: </span>
            {student_profile_summary.academic_background}
          </p>
          <p className="text-[#666]">
            <span className="font-medium text-[#2b2b2b]">Kekuatan: </span>
            {student_profile_summary.strengths.join(", ")}
          </p>
          {student_profile_summary.improvement_areas.length > 0 && (
            <p className="text-[#666]">
              <span className="font-medium text-[#2b2b2b]">Area Pengembangan: </span>
              {student_profile_summary.improvement_areas.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Recommendations Title */}
      <div>
        <h3 className="text-[20px] font-bold text-[#2b2b2b] mb-2">
          Rekomendasi Program untuk Anda
        </h3>
        <p className="text-[14px] text-[#9b9b9b]">
          Program diurutkan berdasarkan tingkat kesesuaian dengan profil Anda
        </p>
      </div>

      {/* Program Cards */}
      <div className="space-y-6">
        {top_recommendations.map((program) => (
          <RecommendationCard key={program.rank} program={program} />
        ))}
      </div>

      {/* Application Strategy */}
      <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
        <h3 className="text-[18px] font-semibold text-[#2b2b2b] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-600" />
          Strategi Aplikasi yang Disarankan
        </h3>
        <div className="space-y-4 text-[14px]">
          <div className="bg-white/50 rounded-lg p-4">
            <span className="font-semibold text-orange-700">🎯 Ambitious: </span>
            <span className="text-[#666]">{application_strategy.ambitious}</span>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <span className="font-semibold text-blue-700">🎓 Target: </span>
            <span className="text-[#666]">{application_strategy.target}</span>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <span className="font-semibold text-green-700">✅ Balanced: </span>
            <span className="text-[#666]">{application_strategy.balanced_option}</span>
          </div>
        </div>
      </div>

      {/* Final Notes */}
      {final_notes.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-[16px] font-semibold text-[#2b2b2b] mb-4">
            💡 Catatan Penting
          </h3>
          <ul className="space-y-2.5 text-[14px] text-[#666]">
            {final_notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
