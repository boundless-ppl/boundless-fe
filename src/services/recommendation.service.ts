/**
 * Recommendation Service
 * Handles all API calls related to GlobalMatch AI recommendations
 */

import { API_CONFIG } from "@/lib/api-config";
import type {
  ProfileSubmissionResponse,
  SubmissionDetails,
  RecommendationFormData,
  ApiErrorResponse,
} from "@/lib/api-types";

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Helper function to build FormData for multipart requests
 */
function buildRecommendationFormData(data: RecommendationFormData): FormData {
  const formData = new FormData();

  // Add files
  if (data.transcript_file) {
    formData.append("transcript_file", data.transcript_file);
  }
  if (data.cv_file) {
    formData.append("cv_file", data.cv_file);
  }

  // Add repeatable arrays
  if (data.continents) {
    data.continents.forEach((continent) => formData.append("continents", continent));
  }
  if (data.countries) {
    data.countries.forEach((country) => formData.append("countries", country));
  }
  if (data.fields_of_study) {
    data.fields_of_study.forEach((field) => formData.append("fields_of_study", field));
  }
  if (data.languages) {
    data.languages.forEach((lang) => formData.append("languages", lang));
  }
  if (data.budget_preferences) {
    data.budget_preferences.forEach((budget) => formData.append("budget_preferences", budget));
  }
  if (data.scholarship_types) {
    data.scholarship_types.forEach((scholarship) =>
      formData.append("scholarship_types", scholarship)
    );
  }
  if (data.start_periods) {
    data.start_periods.forEach((period) => formData.append("start_periods", period));
  }

  // Add single-value fields
  if (data.degree_level) {
    formData.append("degree_level", data.degree_level);
  }
  if (data.additional_preference) {
    formData.append("additional_preference", data.additional_preference);
  }

  return formData;
}

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch {
      // Response might not be JSON
    }

    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Get auth token from storage (implement based on your auth system)
 * For now, this is a placeholder
 */
function getAuthToken(): string | null {
  // TODO: Implement based on your auth system
  // Example: return localStorage.getItem('access_token');
  return null;
}

/**
 * Submit recommendation request with profile mode (both CV and transcript)
 */
export async function submitProfileRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formData = buildRecommendationFormData(data);

  const response = await fetch(`${API_BASE_URL}/recommendations/profile`, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

/**
 * Submit recommendation request with transcript-only mode
 */
export async function submitTranscriptRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formData = buildRecommendationFormData(data);

  const response = await fetch(`${API_BASE_URL}/recommendations/transcript`, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

/**
 * Submit recommendation request with CV-only mode
 */
export async function submitCVRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formData = buildRecommendationFormData(data);

  const response = await fetch(`${API_BASE_URL}/recommendations/cv`, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

/**
 * Get submission details by ID
 */
export async function getSubmissionDetails(
  submissionId: string
): Promise<SubmissionDetails> {
  const token = getAuthToken();
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/recommendations/submissions/${submissionId}`,
    {
      method: "GET",
      headers,
    }
  );

  return handleResponse<SubmissionDetails>(response);
}

/**
 * Submit recommendation (auto-detects mode based on files provided)
 * This is a convenience function that routes to the appropriate endpoint
 */
export async function submitRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const hasTranscript = !!data.transcript_file;
  const hasCV = !!data.cv_file;

  if (hasTranscript && hasCV) {
    return submitProfileRecommendation(data);
  } else if (hasTranscript) {
    return submitTranscriptRecommendation(data);
  } else if (hasCV) {
    return submitCVRecommendation(data);
  } else {
    throw new Error("At least one file (transcript or CV) must be provided");
  }
}
