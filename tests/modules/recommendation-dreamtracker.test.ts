import { describe, expect, it } from "vitest";
import {
  getDreamTrackerTitle,
  getProgramTrackingData,
  getScholarshipTrackingData,
} from "@/modules/GlobalmatchPageModule/components/ResultsPage/recommendation-dreamtracker";
import type { ProgramRecommendation, ScholarshipRecommendation } from "@/lib/api-types";

describe("recommendation dreamtracker helpers", () => {
  it("reads tracking ids from snake_case fields", () => {
    const program = {
      rank: 1,
      program_id: "program-1",
      admission_id: "admission-1",
      source_rec_result_id: "result-1",
      university_name: "University of Bristol",
      program_name: "MSc Computer Science",
      country: "UK",
      fit_score: 90,
      admission_chance_score: 75,
      overall_recommendation_score: 88,
      fit_level: "high",
      admission_difficulty: "moderate",
      score_breakdown: {
        academic_fit: 90,
        preference_match: 85,
        curriculum_relevance: 88,
        admission_chance: 75,
      },
      overview: "",
      why_this_university: "",
      why_this_program: "",
      preference_reasoning: [],
      match_evidence: [],
      scholarship_recommendations: [],
      pros: [],
      cons: [],
    } satisfies ProgramRecommendation;

    expect(getProgramTrackingData(program)).toEqual({
      programId: "program-1",
      admissionId: "admission-1",
      sourceRecResultId: "result-1",
    });
    expect(getDreamTrackerTitle(program)).toBe("University of Bristol • MSc Computer Science");
  });

  it("falls back to camelCase scholarship ids", () => {
    const scholarship = {
      scholarship_name: "Chevening",
      coverage_summary: "Full funding",
      selectivity: "high",
      eligibility_hint: "Leadership",
      fundingId: "funding-1",
      admissionId: "admission-2",
    } as ScholarshipRecommendation;

    expect(getScholarshipTrackingData(scholarship)).toEqual({
      fundingId: "funding-1",
      admissionId: "admission-2",
    });
  });
});
