import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import type { ProfileSubmissionResponse, ProgramRecommendation } from "@/lib/api-types";

interface RecommendationDisplayProps {
  result: ProfileSubmissionResponse;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asScholarshipList(value: ProgramRecommendation["scholarship_recommendations"] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

function keyedListItem(value: string, index: number) {
  return `${value}-${index}`;
}

function scholarshipKey(scholarship: ProgramRecommendation["scholarship_recommendations"][number], index: number) {
  return `${scholarship.scholarship_name}-${index}`;
}

function openProgramSearch(program: ProgramRecommendation) {
  const searchQuery = `${program.university_name} ${program.program_name}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  window.open(searchUrl, "_blank");
}

function getFitTone(score: number) {
  if (score >= 90) {
    return {
      badge: "bg-emerald-600 text-white",
      soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
    };
  }

  if (score >= 80) {
    return {
      badge: "bg-[#f58a1f] text-white",
      soft: "bg-orange-50 text-orange-700 border-orange-200",
      bar: "bg-[#f58a1f]",
    };
  }

  return {
    badge: "bg-slate-700 text-white",
    soft: "bg-slate-100 text-slate-700 border-slate-200",
    bar: "bg-slate-600",
  };
}

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "low") return "Relatif mudah";
  if (difficulty === "high") return "Kompetitif";
  return "Menengah";
}

function getDifficultyTone(difficulty: string) {
  if (difficulty === "low") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (difficulty === "high") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function formatScoreLabel(key: string) {
  const labels: Record<string, string> = {
    academic_fit: "Academic fit",
    preference_match: "Preference match",
    curriculum_relevance: "Curriculum relevance",
    admission_chance: "Admission chance",
  };

  return labels[key] ?? key.replaceAll("_", " ");
}

function SummaryMetric({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function RecommendationCard({ program }: Readonly<{ program: ProgramRecommendation }>) {
  const [showDetails, setShowDetails] = useState(false);
  const matchEvidence = asStringList(program.match_evidence);
  const preferenceReasoning = asStringList(program.preference_reasoning);
  const scholarships = asScholarshipList(program.scholarship_recommendations);
  const pros = asStringList(program.pros);
  const cons = asStringList(program.cons);
  const fitTone = getFitTone(program.fit_score);

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.32)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_48%,#f8fafc_100%)] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className={`rounded-full border-none px-3 py-1 text-[13px] font-semibold ${fitTone.badge}`}>
                {program.fit_score}% fit score
              </Badge>
              <Badge className={`rounded-full border px-3 py-1 text-[13px] font-medium ${getDifficultyTone(program.admission_difficulty)}`}>
                {getDifficultyLabel(program.admission_difficulty)}
              </Badge>
              <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[13px] font-medium text-slate-600">
                Ranked #{program.rank}
              </Badge>
            </div>

            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">
              {program.program_name}
            </h3>
            <p className="mt-2 text-base font-medium text-slate-700">{program.university_name}</p>
            <p className="mt-1 text-sm text-slate-500">{program.country}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-90">
            <SummaryMetric
              icon={<Target className="h-5 w-5" />}
              label="Overall"
              value={`${program.overall_recommendation_score}%`}
            />
            <SummaryMetric
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Admission"
              value={`${program.admission_chance_score}%`}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Country</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{program.country}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">University</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
              <Globe className="h-4 w-4 text-slate-500" />
              <span>{program.university_name}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Program</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              <span>{program.program_name}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Position</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
              <Award className="h-4 w-4 text-slate-500" />
              <span>Recommendation #{program.rank}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#f58a1f] shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Why it matches
                </h4>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                {matchEvidence.slice(0, 3).map((evidence, idx) => (
                  <li key={keyedListItem(evidence, idx)} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f58a1f]" />
                    <span>{evidence}</span>
                  </li>
                ))}
                {preferenceReasoning.slice(0, 2).map((reason, idx) => (
                  <li key={keyedListItem(reason, idx)} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Overview
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{program.overview}</p>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Score breakdown
              </h4>
              <div className="mt-4 space-y-4">
                {Object.entries(program.score_breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{formatScoreLabel(key)}</span>
                      <span className="font-semibold text-slate-900">{value}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${fitTone.bar}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {scholarships.length > 0 && (
              <section className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">
                  Scholarship options
                </h4>
                <div className="mt-4 space-y-3">
                  {scholarships.slice(0, 2).map((scholarship, idx) => (
                    <div key={scholarshipKey(scholarship, idx)} className="rounded-2xl border border-orange-100 bg-white/85 p-4">
                      <p className="text-sm font-semibold text-slate-900">{scholarship.scholarship_name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{scholarship.coverage_summary}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 px-5 py-6 text-slate-700 hover:bg-slate-50"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Sembunyikan detail
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Lihat analisis lengkap
              </>
            )}
          </Button>
          <Button
            className="rounded-2xl bg-slate-950 px-5 py-6 text-white hover:bg-slate-800"
            onClick={() => openProgramSearch(program)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Cari program resmi
          </Button>
        </div>

        {showDetails && (
          <div className="mt-6 grid gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <section className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Why this university
              </h4>
              <p className="text-sm leading-7 text-slate-600">{program.why_this_university}</p>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Why this program
              </h4>
              <p className="text-sm leading-7 text-slate-600">{program.why_this_program}</p>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Strengths
                </h4>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-emerald-900">
                  {pros.map((pro, idx) => (
                    <li key={keyedListItem(pro, idx)} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {cons.length > 0 && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
                    Things to consider
                  </h4>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-amber-900">
                    {cons.map((con, idx) => (
                      <li key={keyedListItem(con, idx)} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {scholarships.length > 2 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  More scholarship details
                </h4>
                <div className="mt-4 space-y-3">
                  {scholarships.map((scholarship, idx) => (
                    <div key={scholarshipKey(scholarship, idx)} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-slate-900">{scholarship.scholarship_name}</p>
                        <Badge className="w-fit rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                          {scholarship.selectivity}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{scholarship.coverage_summary}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{scholarship.eligibility_hint}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function RecommendationDisplay({ result }: Readonly<RecommendationDisplayProps>) {
  const { student_profile_summary, top_recommendations, application_strategy, final_notes, selection_reasoning } = result.result;
  const strengths = asStringList(student_profile_summary.strengths);
  const improvementAreas = asStringList(student_profile_summary.improvement_areas);
  const preferredThemes = asStringList(student_profile_summary.preferred_themes);
  const recommendations = Array.isArray(top_recommendations) ? top_recommendations : [];
  const notes = asStringList(final_notes);

  return (
    <div className="mx-auto max-w-6xl space-y-8 font-sans animate-in slide-in-from-bottom-4 duration-300">
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fff8f1_0%,#ffffff_42%,#f8fafc_100%)] p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Globalmatch Results</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Program recommendations tailored to your profile
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Kami memetakan kecocokan akademik, preferensi studi, dan peluang penerimaan untuk menghasilkan shortlist yang lebih terarah dan bisa ditindaklanjuti.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
          <SummaryMetric
            icon={<Award className="h-5 w-5" />}
            label="Programs"
            value={`${recommendations.length} recommendations`}
          />
          <SummaryMetric
            icon={<Target className="h-5 w-5" />}
            label="Top fit"
            value={recommendations[0] ? `${recommendations[0].fit_score}% fit` : "-"}
          />
          <SummaryMetric
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Admission outlook"
            value={recommendations[0] ? `${recommendations[0].admission_chance_score}%` : "-"}
          />
          <SummaryMetric
            icon={<GraduationCap className="h-5 w-5" />}
            label="Themes"
            value={preferredThemes.length > 0 ? preferredThemes.slice(0, 2).join(", ") : "Not specified"}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Profile summary</p>
              <h3 className="text-xl font-semibold text-slate-950">Ringkasan profil Anda</h3>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Academic background:</span>{" "}
              {student_profile_summary.academic_background}
            </p>
            {student_profile_summary.experience_summary && (
              <p>
                <span className="font-semibold text-slate-900">Experience summary:</span>{" "}
                {student_profile_summary.experience_summary}
              </p>
            )}
            <p>
              <span className="font-semibold text-slate-900">Selection rationale:</span>{" "}
              {selection_reasoning}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Strengths
              </h4>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-emerald-900">
                {strengths.map((strength, idx) => (
                  <li key={keyedListItem(strength, idx)} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Improvement areas
              </h4>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {improvementAreas.length > 0 ? (
                  improvementAreas.map((area, idx) => (
                    <li key={keyedListItem(area, idx)} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span>{area}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Tidak ada catatan pengembangan utama.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-orange-200 bg-[linear-gradient(135deg,#fff8f1_0%,#fff1df_100%)] p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] sm:p-8">
            <h3 className="text-xl font-semibold text-slate-950">Strategi aplikasi</h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">Ambitious</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{application_strategy.ambitious}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Target</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{application_strategy.target}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Balanced</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{application_strategy.balanced_option}</p>
              </div>
            </div>
          </section>

          {notes.length > 0 && (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] sm:p-8">
              <h3 className="text-xl font-semibold text-slate-950">Catatan penting</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {notes.map((note, idx) => (
                  <li key={keyedListItem(note, idx)} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f58a1f]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recommendations</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Shortlist program yang paling relevan
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Diurutkan berdasarkan kombinasi fit score, peluang diterima, dan overall recommendation score.
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map((program) => (
            <RecommendationCard key={`${program.rank}-${program.university_name}-${program.program_name}`} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
