import { getAuthToken } from "@/features/auth/services/auth.service";
import { API_CONFIG } from "@/lib/api-config";
import type {
  ApiErrorResponse,
  CreateDreamTrackerRequest,
  CreateDreamTrackerResponse,
  DreamTrackerDashboardSummary,
  DreamTrackerItem,
  DreamTrackerListResponse,
  SubmitRequirementRequest,
  SubmitRequirementResponse,
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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch {
    }
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

function buildAuthHeaders(): HeadersInit {
  const tokens = getAuthToken();
  return tokens?.accessToken
    ? { Authorization: `Bearer ${tokens.accessToken}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function getDreamTrackerSummary(): Promise<DreamTrackerDashboardSummary> {
  const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.SUMMARY}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return handleResponse<DreamTrackerDashboardSummary>(response);
}

export async function getDreamTrackers(): Promise<DreamTrackerListResponse> {
  const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.BASE}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return handleResponse<DreamTrackerListResponse>(response);
}

export async function getDreamTrackerById(id: string): Promise<DreamTrackerItem> {
  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.BY_ID(id)}`,
    { method: "GET", headers: buildAuthHeaders() }
  );
  return handleResponse<DreamTrackerItem>(response);
}

export async function createDreamTracker(
  data: CreateDreamTrackerRequest
): Promise<CreateDreamTrackerResponse> {
  const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.BASE}`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<CreateDreamTrackerResponse>(response);
}

export async function submitRequirement(
  requirementStatusId: string,
  data: SubmitRequirementRequest
): Promise<SubmitRequirementResponse> {
  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.SUBMIT_REQUIREMENT(requirementStatusId)}`,
    {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(data),
    }
  );
  return handleResponse<SubmitRequirementResponse>(response);
}
