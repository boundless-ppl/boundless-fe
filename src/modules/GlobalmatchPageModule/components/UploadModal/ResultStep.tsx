import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, TrendingUp, AlertCircle } from "lucide-react";
import type { RecommendationResult } from "@/lib/api-types";

interface ResultStepProps {
  result: RecommendationResult;
  onClose: () => void;
}

export function ResultStep({ result, onClose }: ResultStepProps) {
  const { student_profile_summary, top_recommendations, application_strategy, final_notes } = result;

  return (
    <div className="px-8 py-8 space-y-8 animate-in slide-in-from-right-4 duration-300 font-sans">
      {/* Success Header */}
      <div className="text-center">
        <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#2b2b2b] mb-2">
          Rekomendasi Berhasil!
        </h2>
        <p className="text-[#9b9b9b] text-[14px]">
          Kami telah menganalisis profil Anda dan menemukan {top_recommendations.length} program yang sesuai
        </p>
      </div>

      {/* Student Profile Summary */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-[18px] font-semibold text-[#2b2b2b] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Ringkasan Profil Anda
        </h3>
        <div className="space-y-3 text-[14px]">
          <div>
            <span className="font-medium text-[#2b2b2b]">Latar Belakang Akademis: </span>
            <span className="text-[#666]">{student_profile_summary.academic_background}</span>
          </div>
          <div>
            <span className="font-medium text-[#2b2b2b]">Kekuatan: </span>
            <span className="text-[#666]">{student_profile_summary.strengths.join(", ")}</span>
          </div>
          {student_profile_summary.improvement_areas.length > 0 && (
            <div>
              <span className="font-medium text-[#2b2b2b]">Area Pengembangan: </span>
              <span className="text-[#666]">{student_profile_summary.improvement_areas.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Recommendations */}
      <div>
        <h3 className="text-[18px] font-semibold text-[#2b2b2b] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#fa8613]" />
          Top {top_recommendations.length} Rekomendasi Program
        </h3>
        <div className="space-y-4">
          {top_recommendations.slice(0, 5).map((rec, idx) => (
            <div
              key={idx}
              className="border border-[#e8e8e8] rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#fa8613] text-white text-[12px] font-bold px-2 py-1 rounded">
                      #{rec.rank}
                    </span>
                    <h4 className="text-[16px] font-semibold text-[#2b2b2b]">
                      {rec.program_name}
                    </h4>
                  </div>
                  <p className="text-[14px] text-[#666] mb-1">{rec.university_name}</p>
                  <p className="text-[13px] text-[#9b9b9b]">{rec.country}</p>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-bold text-[#fa8613]">{rec.fit_score}%</div>
                  <div className="text-[11px] text-[#9b9b9b] uppercase">Fit Score</div>
                </div>
              </div>

              <p className="text-[14px] text-[#666] mb-3">{rec.overview}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-[12px] text-[#666] mb-1">Admission Chance</div>
                  <div className="text-[16px] font-semibold text-green-700">
                    {rec.admission_chance_score}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-[12px] text-[#666] mb-1">Overall Score</div>
                  <div className="text-[16px] font-semibold text-purple-700">
                    {rec.overall_recommendation_score}%
                  </div>
                </div>
              </div>

              {rec.scholarship_recommendations.length > 0 && (
                <div className="mb-3">
                  <div className="text-[13px] font-medium text-[#2b2b2b] mb-2">
                    💰 Beasiswa yang Direkomendasikan:
                  </div>
                  {rec.scholarship_recommendations.map((scholarship, sIdx) => (
                    <div key={sIdx} className="bg-yellow-50 rounded-lg p-2 mb-1">
                      <div className="text-[13px] font-medium text-[#2b2b2b]">
                        {scholarship.scholarship_name}
                      </div>
                      <div className="text-[12px] text-[#666]">{scholarship.coverage_summary}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {rec.pros.slice(0, 2).map((pro, pIdx) => (
                  <div key={pIdx} className="text-[12px] bg-green-50 text-green-700 px-2 py-1 rounded">
                    ✓ {pro}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Strategy */}
      <div className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
        <h3 className="text-[16px] font-semibold text-[#2b2b2b] mb-3">
          📋 Strategi Aplikasi
        </h3>
        <div className="space-y-2 text-[14px]">
          <div>
            <span className="font-medium text-[#2b2b2b]">Ambitious: </span>
            <span className="text-[#666]">{application_strategy.ambitious}</span>
          </div>
          <div>
            <span className="font-medium text-[#2b2b2b]">Target: </span>
            <span className="text-[#666]">{application_strategy.target}</span>
          </div>
          <div>
            <span className="font-medium text-[#2b2b2b]">Balanced: </span>
            <span className="text-[#666]">{application_strategy.balanced_option}</span>
          </div>
        </div>
      </div>

      {/* Final Notes */}
      {final_notes.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h3 className="text-[14px] font-semibold text-[#2b2b2b] mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            Catatan Penting
          </h3>
          <ul className="space-y-2 text-[13px] text-[#666]">
            {final_notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-4 border-t border-[#e8e8e8] sticky bottom-0 bg-white z-10">
        <Button
          className="w-full py-6 bg-[#2b2b2b] text-white rounded-xl hover:bg-[#1a1a1a] font-semibold"
          onClick={onClose}
        >
          Selesai
        </Button>
      </div>
    </div>
  );
}
