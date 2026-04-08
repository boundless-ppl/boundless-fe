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
  funding_id?: string;
  admission_id?: string;
}

export interface ProgramRecommendation {
  rank: number;
  university_name: string;
  program_name: string;
  country: string;
  program_id?: string;
  admission_id?: string;
  source_rec_result_id?: string;
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
  program_id?: string;
  admission_id?: string;
  source_rec_result_id?: string;
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
export type DreamRequirementStatus =
  | "NOT_UPLOADED"
  | "UPLOADED"
  | "REVIEWING"
  | "VERIFIED"
  | "VERIFIED_WITH_WARNING"
  | "REJECTED"
  | "REUSED";
export type MilestoneStatus = "NOT_STARTED" | "DONE" | "MISSED";
export type FundingStatus = "AVAILABLE" | "SELECTED";
export type ReviewSource = "NEW_UPLOAD" | "REUSED_EXISTING" | "SKIPPED_ALREADY_VERIFIED";
export type ReviewStatus = "NOT_STARTED" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "SKIPPED";

export interface DreamTrackerSummaryData {
  completion_percentage: number;
  completed_requirements: number;
  total_requirements: number;
  next_deadline_at: string | null;
  is_deadline_near: boolean;
  is_overdue: boolean;
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

export interface DreamRequirementDocument {
  document_id: string;
  document_type: string;
  original_filename: string;
  public_url: string;
  mime_type?: string;
  uploaded_at: string;
}

export interface DreamRequirementReview {
  source: ReviewSource;
  status: ReviewStatus;
  is_reused: boolean;
  is_already_verified: boolean;
  ai_message: string | null;
  last_processed_at: string | null;
}

export interface DreamRequirement {
  dream_req_status_id: string;
  req_catalog_id: string;
  requirement_key: string;
  requirement_label: string;
  category: string;
  status: DreamRequirementStatus;
  status_label: string;
  status_variant: string;
  can_upload: boolean;
  needs_reupload: boolean;
  document: DreamRequirementDocument | null;
  review: DreamRequirementReview;
}

export interface DreamMilestone {
  dream_milestone_id: string;
  title: string;
  status: MilestoneStatus;
  deadline_date: string;
}

export interface DreamFunding {
  funding_id: string;
  nama_beasiswa: string;
  provider: string;
  status: FundingStatus;
}

export interface DreamTrackerItem {
  dream_tracker_id: string;
  title: string;
  subtitle: string;
  status: DreamTrackerStatus;
  status_label: string;
  status_variant: string;
  created_at: string;
  updated_at: string;
  deadline_at: string | null;
  summary: DreamTrackerSummaryData;
  program: DreamTrackerProgram;
  requirements: DreamRequirement[];
  milestones: DreamMilestone[];
  fundings: DreamFunding[];
}

export interface DreamTrackerDashboardSummary {
  total_applications: number;
  incomplete_count: number;
  completed_count: number;
  deadline_near_count: number;
}

// Grouped endpoint types
export interface DreamTrackerGroupedUniversityItem {
  dream_tracker_id: string;
  title: string;
  program_name: string;
  admission_name: string;
  status: DreamTrackerStatus;
  status_label: string;
  completion_percentage: number;
  is_selected: boolean;
}

export interface DreamTrackerGroupedUniversity {
  university_id: string;
  university_name: string;
  items: DreamTrackerGroupedUniversityItem[];
}

export interface DreamTrackerGroupedFundingItem {
  dream_tracker_id: string;
  title: string;
  program_name: string;
  university_name: string;
  status: DreamTrackerStatus;
  status_label: string;
  completion_percentage: number;
  is_selected: boolean;
}

export interface DreamTrackerGroupedFunding {
  funding_id: string;
  funding_name: string;
  items: DreamTrackerGroupedFundingItem[];
}

export interface DreamTrackerGroupedResponse {
  default_selected_dream_tracker_id: string;
  universities: DreamTrackerGroupedUniversity[];
  fundings: DreamTrackerGroupedFunding[];
  default_detail?: DreamTrackerItem;
}

export interface CreateDreamTrackerRequest {
  program_id: string;
  admission_id?: string | null;
  funding_id?: string | null;
  title?: string;
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
  document_type: string;
  reuse_if_exists?: boolean;
}

export interface SubmitRequirementResponse {
  dream_req_status_id: string;
  status: DreamRequirementStatus;
  status_label: string;
  status_variant: string;
  document: DreamRequirementDocument | null;
  review: DreamRequirementReview;
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
