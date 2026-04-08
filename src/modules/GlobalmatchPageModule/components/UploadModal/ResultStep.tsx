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
import type { RecommendationResult, ProgramRecommendation } from "@/lib/api-types";

interface ResultStepProps {
  readonly result: RecommendationResult;
  readonly onClose: () => void;
}

function listKey(value: string, index: number) {
  return `${value}-${index}`;
}

function scholarshipKey(scholarshipName: string, index: number) {
  return `${scholarshipName}-${index}`;
}

function getDifficultyLabel(difficulty: ProgramRecommendation["admission_difficulty"]) {
  if (difficulty === "low") return "Mudah";
  if (difficulty === "moderate") return "Sedang";
  return "Kompetitif";
}

function getSelectivityBadgeClass(selectivity: "high" | "moderate" | "low") {
  if (selectivity === "high") return "bg-red-100 text-red-700";
  if (selectivity === "moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function RecommendationCard({ program }: Readonly<{ program: ProgramRecommendation }>) {
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
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getMatchBadgeColor(program.fit_score)} text-white border-none px-3 py-1 text-[13px] font-bold`}>
                {program.fit_score}% Match
              </Badge>
              <Badge className={`${getDifficultyBadge(program.admission_difficulty)} border-none px-3 py-1 text-[12px] font-semibold`}>
                {getDifficultyLabel(program.admission_difficulty)}
              </Badge>
            </div>
            
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#2b2b2b] mb-1">
              {program.program_name}
            </h3>
            <p className="text-[15px] text-[#666] font-medium mb-1">{program.university_name}</p>
            <p className="text-[13px] text-[#9b9b9b]">#{program.rank} Global (QS 2024)</p>
          </div>
        </div>

        {/* Quick Info Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#f5f5f5] p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-[#666]" />
            </div>
            <div>
              <p className="text-[11px] text-[#9b9b9b]">Negara</p>
              <p className="text-[13px] font-semibold text-[#2b2b2b]">{program.country}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-[#f5f5f5] p-2 rounded-lg">
              <Clock className="w-4 h-4 text-[#666]" />
            </div>
            <div>
              <p className="text-[11px] text-[#9b9b9b]">Durasi</p>
              <p className="text-[13px] font-semibold text-[#2b2b2b]">2 years</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#f5f5f5] p-2 rounded-lg">
              <GraduationCap className="w-4 h-4 text-[#666]" />
            </div>
            <div>
              <p className="text-[11px] text-[#9b9b9b]">Admission</p>
              <p className="text-[13px] font-semibold text-[#2b2b2b]">{program.admission_chance_score}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#f5f5f5] p-2 rounded-lg">
              <Award className="w-4 h-4 text-[#666]" />
            </div>
            <div>
              <p className="text-[11px] text-[#9b9b9b]">Overall</p>
              <p className="text-[13px] font-semibold text-[#2b2b2b]">{program.overall_recommendation_score}%</p>
            </div>
          </div>
        </div>

        {/* Why We Recommend */}
        <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#fa8613]" />
            <h4 className="text-[14px] font-semibold text-[#2b2b2b]">
              Kenapa Kami Merekomendasikan:
            </h4>
          </div>
          <ul className="space-y-2">
            {program.match_evidence.slice(0, 3).map((evidence, idx) => (
              <li key={listKey(evidence, idx)} className="flex items-start gap-2 text-[13px] text-[#666]">
                <span className="text-[#fa8613] mt-0.5">•</span>
                <span>{evidence}</span>
              </li>
            ))}
            {program.preference_reasoning.slice(0, 2).map((reason, idx) => (
              <li key={listKey(reason, idx)} className="flex items-start gap-2 text-[13px] text-[#666]">
                <span className="text-[#fa8613] mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scholarship Info */}
        {program.scholarship_recommendations.length > 0 && (
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-yellow-700" />
              <span className="text-[13px] font-semibold text-yellow-900">
                Beasiswa Tersedia
              </span>
            </div>
            {program.scholarship_recommendations.slice(0, 2).map((scholarship, idx) => (
              <div key={scholarshipKey(scholarship.scholarship_name, idx)} className="text-[12px] text-yellow-800 mb-1">
                <span className="font-medium">{scholarship.scholarship_name}:</span> {scholarship.coverage_summary}
              </div>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <div className="space-y-4 border-t border-[#e8e8e8] pt-4 animate-in slide-in-from-top-2 duration-200">
            {/* Overview */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">Overview</h4>
              <p className="text-[13px] text-[#666] leading-relaxed">{program.overview}</p>
            </div>

            {/* Why This University */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">Why This University</h4>
              <p className="text-[13px] text-[#666] leading-relaxed">{program.why_this_university}</p>
            </div>

            {/* Why This Program */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">Why This Program</h4>
              <p className="text-[13px] text-[#666] leading-relaxed">{program.why_this_program}</p>
            </div>

            {/* Score Breakdown */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-3">Score Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(program.score_breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-[#666] capitalize">{key.replaceAll("_", " ")}</span>
                      <span className="font-semibold text-[#2b2b2b]">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">Pros</h4>
                <ul className="space-y-1">
                  {program.pros.map((pro, idx) => (
                    <li key={listKey(pro, idx)} className="flex items-start gap-2 text-[13px] text-green-700">
                      <span className="mt-0.5">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {program.cons.length > 0 && (
                <div>
                  <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {program.cons.map((con, idx) => (
                      <li key={listKey(con, idx)} className="flex items-start gap-2 text-[13px] text-orange-700">
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
                <h4 className="text-[14px] font-semibold text-[#2b2b2b] mb-2">All Scholarships</h4>
                <div className="space-y-2">
                  {program.scholarship_recommendations.map((scholarship, idx) => (
                    <div key={scholarshipKey(scholarship.scholarship_name, idx)} className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-[13px] font-semibold text-[#2b2b2b]">
                          {scholarship.scholarship_name}
                        </span>
                        <Badge className={`text-[11px] ${getSelectivityBadgeClass(scholarship.selectivity)} border-none`}>
                          {scholarship.selectivity}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-[#666] mb-1">{scholarship.coverage_summary}</p>
                      <p className="text-[12px] text-[#888] italic">{scholarship.eligibility_hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl border-[#e8e8e8] text-[#2b2b2b] hover:bg-gray-50"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Lihat Lebih Sedikit
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
          onClick={() => globalThis.window.open(`https://www.google.com/search?q=${encodeURIComponent(program.university_name + " " + program.program_name)}`, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Kunjungi Website
        </Button>
      </div>
    </div>
  );
}

export function ResultStep({ result, onClose }: Readonly<ResultStepProps>) {
  const { student_profile_summary, top_recommendations, application_strategy, final_notes } = result;

  return (
    <div className="px-8 py-8 space-y-6 animate-in slide-in-from-right-4 duration-300 font-sans">
      {/* Success Header */}
      <div className="text-center pb-4 border-b border-[#e8e8e8]">
        <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#2b2b2b] mb-2">
          ✨ Analisis Selesai!
        </h2>
        <p className="text-[14px] text-[#666] mb-1">
          Berdasarkan CV dan transkrip Anda, kami menemukan{" "}
          <span className="font-semibold text-[#fa8613]">{top_recommendations.length} program</span> yang sangat sesuai dengan profil Anda
        </p>
      </div>

      {/* Student Profile Summary */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-blue-600 rounded-full p-2">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#2b2b2b]">
            Ringkasan Profil Anda
          </h3>
        </div>
        <div className="space-y-2 text-[13px]">
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
        <h3 className="text-[18px] font-bold text-[#2b2b2b] mb-1">
          Rekomendasi Program untuk Anda
        </h3>
        <p className="text-[13px] text-[#9b9b9b]">
          Program diurutkan berdasarkan tingkat kesesuaian dengan profil Anda
        </p>
      </div>

      {/* Program Cards */}
      <div className="space-y-4">
        {top_recommendations.map((program) => (
          <RecommendationCard key={program.rank} program={program} />
        ))}
      </div>

      {/* Application Strategy */}
      <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
        <h3 className="text-[16px] font-semibold text-[#2b2b2b] mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-600" />
          Strategi Aplikasi yang Disarankan
        </h3>
        <div className="space-y-3 text-[13px]">
          <div className="bg-white/50 rounded-lg p-3">
            <span className="font-semibold text-orange-700">🎯 Ambitious: </span>
            <span className="text-[#666]">{application_strategy.ambitious}</span>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <span className="font-semibold text-blue-700">🎓 Target: </span>
            <span className="text-[#666]">{application_strategy.target}</span>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <span className="font-semibold text-green-700">✅ Balanced: </span>
            <span className="text-[#666]">{application_strategy.balanced_option}</span>
          </div>
        </div>
      </div>

      {/* Final Notes */}
      {final_notes.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h3 className="text-[14px] font-semibold text-[#2b2b2b] mb-3">
            💡 Catatan Penting
          </h3>
          <ul className="space-y-2 text-[13px] text-[#666]">
            {final_notes.map((note, idx) => (
              <li key={listKey(note, idx)} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Close Button */}
      <div className="pt-4 border-t border-[#e8e8e8] sticky bottom-0 bg-white">
        <Button
          className="w-full py-6 bg-linear-to-r from-[#fa8613] to-[#ff9d3d] text-white rounded-xl hover:opacity-90 font-semibold shadow-lg"
          onClick={onClose}
        >
          Tutup & Simpan Hasil
        </Button>
        <p className="text-center text-[11px] text-[#9b9b9b] mt-2">
          Hasil rekomendasi ini telah disimpan di akun Anda
        </p>
      </div>
    </div>
  );
}
