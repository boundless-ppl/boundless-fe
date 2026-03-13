/**
 * API Types and Interfaces for Boundless BE
 * Based on API contract version 2026-03-09
 */

// ============================================
// Common Types
// ============================================

export interface ApiErrorResponse {
  error: string;
}

// ============================================
// Auth Types
// ============================================

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  nama_lengkap: string;
  role: "student";
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================
// Universities Types
// ============================================

export interface University {
  id: string;
  negara_id: string;
  nama: string;
  kota: string;
  tipe: "public" | "private";
  deskripsi: string;
  website: string;
  ranking: number;
}

// ============================================
// Recommendation Types
// ============================================

export type DocumentType = "transcript" | "cv";

export interface DocumentUpload {
  document_id: string;
  original_filename: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  document_type: DocumentType;
  uploaded_at: string;
}

export interface DocumentUploadResponse {
  document: DocumentUpload;
}

export interface PreferenceItem {
  pref_key: string;
  pref_value: string;
}

export interface LegacySubmissionRequest {
  transcript_document_id: string;
  cv_document_id: string;
  preferences: PreferenceItem[];
}

export interface LegacySubmissionResponse {
  submission_id: string;
  status: "draft" | "processing" | "completed" | "failed";
  result_set_id: string;
}

// ============================================
// Recommendation Result Types
// ============================================

export interface StudentProfileSummary {
  academic_background: string;
  experience_summary: string;
  strengths: string[];
  improvement_areas: string[];
  preferred_themes: string[];
  raw_text: string;
}

export interface ScoreBreakdown {
  academic_fit: number;
  preference_match: number;
  curriculum_relevance: number;
  admission_chance: number;
}

export interface ScholarshipRecommendation {
  scholarship_name: string;
  coverage_summary: string;
  selectivity: "low" | "moderate" | "high";
  eligibility_hint: string;
}

export interface ProgramRecommendation {
  rank: number;
  university_name: string;
  program_name: string;
  country: string;
  fit_score: number;
  admission_chance_score: number;
  overall_recommendation_score: number;
  fit_level: "low" | "moderate" | "high";
  admission_difficulty: "low" | "moderate" | "high";
  score_breakdown: ScoreBreakdown;
  overview: string;
  why_this_university: string;
  why_this_program: string;
  preference_reasoning: string[];
  match_evidence: string[];
  scholarship_recommendations: ScholarshipRecommendation[];
  pros: string[];
  cons: string[];
}

export interface ApplicationStrategy {
  ambitious: string;
  target: string;
  balanced_option: string;
}

export interface RecommendationResult {
  student_profile_summary: StudentProfileSummary;
  top_recommendations: ProgramRecommendation[];
  selection_reasoning: string;
  application_strategy: ApplicationStrategy;
  final_notes: string[];
}

// ============================================
// Profile/Transcript/CV Submission
// ============================================

export interface ProfileSubmissionResponse {
  submission_id: string;
  status: "completed" | "processing" | "failed";
  result_set_id: string;
  result: RecommendationResult;
}

// ============================================
// Get Submission Details
// ============================================

export interface SimplifiedProgramResult {
  rank_no: number;
  university_name: string;
  program_name: string;
  country: string;
  fit_score: number;
  fit_level: "low" | "moderate" | "high";
  overview: string;
  why_this_university: string;
  why_this_program: string;
  reason_summary: string;
  pros: string[];
  cons: string[];
}

export interface LatestResult {
  result_set_id: string;
  version_no: number;
  generated_at: string;
  results: SimplifiedProgramResult[];
}

export interface SubmissionDetails {
  submission_id: string;
  status: "draft" | "processing" | "completed" | "failed";
  created_at: string;
  submitted_at: string;
  documents: DocumentUpload[];
  preferences: PreferenceItem[];
  latest_result: LatestResult;
}

// ============================================
// Form Data for Multipart Requests
// ============================================

export interface RecommendationFormData {
  // Files
  transcript_file?: File;
  cv_file?: File;
  
  // Preferences (all repeatable arrays)
  continents?: string[];
  countries?: string[];
  fields_of_study?: string[];
  degree_level?: string;
  languages?: string[];
  budget_preferences?: string[];
  scholarship_types?: string[];
  start_periods?: string[];
  additional_preference?: string;
}
