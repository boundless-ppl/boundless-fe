// ============================================
// Common Types
// ============================================

export interface ApiErrorResponse {
  error: string;
}

export type SubmissionStatus = "draft" | "processing" | "completed" | "failed";
export type FitLevel = "low" | "moderate" | "high";
export type AdmissionDifficulty = "low" | "moderate" | "high";

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
  status: SubmissionStatus;
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
  selectivity: FitLevel;
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
  fit_level: FitLevel;
  admission_difficulty: AdmissionDifficulty;
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
  status: Exclude<SubmissionStatus, "draft">;
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
  fit_level: FitLevel;
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
  status: SubmissionStatus;
  created_at: string;
  submitted_at: string;
  documents: DocumentUpload[];
  preferences: PreferenceItem[];
  latest_result: LatestResult;
}

// ============================================
// Dream Tracker Types
// ============================================

export type DreamTrackerStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type DreamRequirementStatus = "NOT_UPLOADED" | "UPLOADED" | "VERIFIED" | "REJECTED";
export type MilestoneStatus = "NOT_STARTED" | "DONE" | "MISSED";
export type FundingType = "SCHOLARSHIP" | "SELF_FUNDED" | "ASSISTANTSHIP" | "LOAN" | "SPONSORSHIP";
export type FundingStatus = "AVAILABLE" | "SELECTED";

export interface DreamTrackerSummaryData {
  completion_percentage: number;
  completed_requirements: number;
  total_requirements: number;
  next_deadline_at: string | null;
  is_deadline_near: boolean;
  is_overdue: boolean;
}

export interface DreamTrackerProgress {
  percentage: number;
  completed_documents: number;
  total_documents: number;
}

export interface DreamTrackerProgram {
  program_id: string;
  program_name: string;
  university_name: string;
  admission_name: string;
  intake: string;
  admission_url: string;
  admission_deadline: string;
}

export interface DreamRequirement {
  dream_req_status_id: string;
  document_id: string | null;
  req_catalog_id: string;
  requirement_key: string;
  requirement_label: string;
  category: string;
  description: string;
  status: DreamRequirementStatus;
  notes: string | null;
  ai_status: string | null;
  ai_messages: string[];
  label: string;
  is_required: boolean;
  status_label: string;
  status_variant: string;
  message: string | null;
  action_label: string;
  can_upload: boolean;
  needs_reupload: boolean;
  created_at: string;
}

export interface DreamMilestone {
  dream_milestone_id: string;
  title: string;
  description: string;
  deadline_date: string;
  is_required: boolean;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
}

export interface DreamFunding {
  funding_id: string;
  nama_beasiswa: string;
  deskripsi: string;
  provider: string;
  tipe_pembiayaan: FundingType;
  website: string;
  status: FundingStatus;
}

export interface DreamTrackerItem {
  dream_tracker_id: string;
  user_id: string;
  program_id: string;
  admission_id: string | null;
  funding_id: string | null;
  title: string;
  subtitle: string;
  status: DreamTrackerStatus;
  status_label: string;
  status_variant: string;
  created_at: string;
  updated_at: string;
  source_type: string;
  req_submission_id: string | null;
  source_rec_result_id: string | null;
  deadline_at: string | null;
  progress: DreamTrackerProgress;
  summary: DreamTrackerSummaryData;
  program: DreamTrackerProgram;
  requirements: DreamRequirement[];
  milestones: DreamMilestone[];
  fundings: DreamFunding[];
}

export interface DreamTrackerListResponse {
  items: DreamTrackerItem[];
}

export interface DreamTrackerDashboardSummary {
  total_applications: number;
  in_progress_count: number;
  completed_count: number;
  deadline_near_count: number;
}

export interface CreateDreamTrackerRequest {
  program_id: string;
  admission_id?: string | null;
  funding_id?: string | null;
  title: string;
  status?: string;
  source_type: string;
  req_submission_id?: string | null;
  source_rec_result_id?: string | null;
}

export interface CreateDreamTrackerResponse {
  dream_tracker_id: string;
  status: string;
}

export interface SubmitRequirementRequest {
  document_id: string;
}

export interface SubmitRequirementResponse {
  dream_req_status_id: string;
  document_id: string;
  status: DreamRequirementStatus;
  ai_status: string;
  ai_messages: string[];
  status_label: string;
  status_variant: string;
  message: string;
  meta?: Record<string, unknown>;
}

// ============================================
// Form Data for Multipart Requests
// ============================================

export interface RecommendationFormData {
  transcript_file?: File;
  cv_file?: File;
  
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
