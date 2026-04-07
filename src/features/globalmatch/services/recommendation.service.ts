/**
 * Recommendation Service
 * Handles all API calls related to GlobalMatch recommendations.
 */

import { getAuthToken } from "@/features/auth/services/auth.service";
import { API_CONFIG } from "@/lib/api-config";
import type {
  ApiErrorResponse,
  ProfileSubmissionResponse,
  RecommendationFormData,
  SubmissionDetails,
} from "@/lib/api-types";

const API_BASE_URL = API_CONFIG.BASE_URL;

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

function buildRecommendationFormData(data: RecommendationFormData): FormData {
  const formData = new FormData();

  if (data.transcript_file) {
    formData.append("transcript_file", data.transcript_file);
  }
  if (data.cv_file) {
    formData.append("cv_file", data.cv_file);
  }

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
    data.languages.forEach((language) => formData.append("languages", language));
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

  if (data.degree_level) {
    formData.append("degree_level", data.degree_level);
  }
  if (data.additional_preference) {
    formData.append("additional_preference", data.additional_preference);
  }

  return formData;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch {
      // Response might not be JSON.
    }

    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function buildAuthHeaders(): HeadersInit {
  const tokens = getAuthToken();
  if (!tokens?.accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export async function submitProfileRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations/profile`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: buildRecommendationFormData(data),
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

export async function submitTranscriptRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations/transcript`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: buildRecommendationFormData(data),
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

export async function submitCVRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations/cv`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: buildRecommendationFormData(data),
  });

  return handleResponse<ProfileSubmissionResponse>(response);
}

export async function getSubmissionDetails(submissionId: string): Promise<SubmissionDetails> {
  const response = await fetch(`${API_BASE_URL}/recommendations/submissions/${submissionId}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return handleResponse<SubmissionDetails>(response);
}

export async function submitRecommendation(
  data: RecommendationFormData
): Promise<ProfileSubmissionResponse> {
  const hasTranscript = !!data.transcript_file;
  const hasCV = !!data.cv_file;

  if (hasTranscript && hasCV) {
    return submitProfileRecommendation(data);
  }
  if (hasTranscript) {
    return submitTranscriptRecommendation(data);
  }
  if (hasCV) {
    return submitCVRecommendation(data);
  }

  throw new Error("At least one file (transcript or CV) must be provided");
}
