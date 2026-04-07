import { getAuthToken } from "@/features/auth/services/auth.service";
import { API_CONFIG } from "@/lib/api-config";
import type {
  ApiErrorResponse,
  CreateDreamTrackerRequest,
  CreateDreamTrackerResponse,
  DreamTrackerDashboardSummary,
  DreamTrackerGroupedResponse,
  DreamTrackerItem,
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

function buildAuthHeadersMultipart(): HeadersInit {
  const tokens = getAuthToken();
  return tokens?.accessToken
    ? { Authorization: `Bearer ${tokens.accessToken}` }
    : {};
}

export async function getDreamTrackerSummary(): Promise<DreamTrackerDashboardSummary> {
  const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.SUMMARY}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });
  return handleResponse<DreamTrackerDashboardSummary>(response);
}

export async function getDreamTrackersGrouped(params?: {
  include_default_detail?: boolean;
  selected_dream_tracker_id?: string;
}): Promise<DreamTrackerGroupedResponse> {
  const query = new URLSearchParams();
  if (params?.include_default_detail) query.set("include_default_detail", "true");
  if (params?.selected_dream_tracker_id) query.set("selected_dream_tracker_id", params.selected_dream_tracker_id);
  const qs = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.GROUPED}${qs}`,
    { method: "GET", headers: buildAuthHeaders() }
  );
  return handleResponse<DreamTrackerGroupedResponse>(response);
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

export async function uploadRequirementDocument(
  requirementStatusId: string,
  file: File,
  documentType: string,
  reuseIfExists = true
): Promise<SubmitRequirementResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", documentType);
  formData.append("reuse_if_exists", String(reuseIfExists));

  const response = await fetch(
    `${API_BASE_URL}${API_CONFIG.ENDPOINTS.DREAM_TRACKERS.UPLOAD_DOCUMENT(requirementStatusId)}`,
    {
      method: "POST",
      headers: buildAuthHeadersMultipart(),
      body: formData,
    }
  );
  return handleResponse<SubmitRequirementResponse>(response);
}
