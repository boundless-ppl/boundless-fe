import type { ProgramRecommendation, ScholarshipRecommendation } from "@/lib/api-types";

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function pickFirstString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = asNonEmptyString(source[key]);
    if (value) return value;
  }
  return undefined;
}

export function getProgramTrackingData(program: ProgramRecommendation) {
  const source = program as ProgramRecommendation & Record<string, unknown>;

  return {
    programId: pickFirstString(source, ["program_id", "programId", "id"]),
    admissionId: pickFirstString(source, ["admission_id", "admissionId"]),
    sourceRecResultId: pickFirstString(source, ["source_rec_result_id", "sourceRecResultId", "rec_result_id", "recResultId"]),
  };
}

export function getScholarshipTrackingData(scholarship: ScholarshipRecommendation) {
  const source = scholarship as ScholarshipRecommendation & Record<string, unknown>;

  return {
    fundingId: pickFirstString(source, ["funding_id", "fundingId", "id"]),
    admissionId: pickFirstString(source, ["admission_id", "admissionId"]),
    scholarshipName: pickFirstString(source, ["scholarship_name", "scholarshipName", "name"]),
  };
}

export function getDreamTrackerTitle(program: ProgramRecommendation) {
  return [program.university_name, program.program_name].filter(Boolean).join(" • ");
}
