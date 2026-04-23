import { getAuthToken } from "@/features/auth/services/auth.service";
import { API_CONFIG } from "@/lib/api-config";
import type {
  ApiResult,
  CreatePaymentRequest,
  ListSubscriptionPackagesResponse,
  PaymentSummary,
  PaymentDetailResponse,
  UploadPaymentProofResponse,
} from "@/features/payment/types/payment-api.types";

const API_BASE_URL = API_CONFIG.BASE_URL;
const { SUBSCRIPTIONS, PAYMENTS } = API_CONFIG.ENDPOINTS;

function getErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim().length > 0) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim().length > 0) {
      return record.message;
    }
  }

  return fallback;
}

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function requestJson<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const payload = await parseJson(response);

    if (!response.ok) {
      return {
        data: null,
        error: getErrorMessage(payload, `HTTP ${response.status}: ${response.statusText}`),
      };
    }

    if (payload === null) {
      return {
        data: null,
        error: "Server returned an unexpected response.",
      };
    }

    return {
      data: payload as T,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Network error. Please try again.",
    };
  }
}

function getBearerToken(): string | null {
  return getAuthToken()?.accessToken ?? null;
}

function buildAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getSubscriptionPackages(): Promise<ApiResult<ListSubscriptionPackagesResponse>> {
  return requestJson<ListSubscriptionPackagesResponse>(SUBSCRIPTIONS.PACKAGES, {
    method: "GET",
    cache: "no-store",
  });
}

export async function createPayment(
  payload: CreatePaymentRequest
): Promise<ApiResult<PaymentSummary>> {
  const token = getBearerToken();
  if (!token) {
    return { data: null, error: "authentication failed" };
  }

  return requestJson<PaymentSummary>(PAYMENTS.BASE, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getPaymentDetail(paymentId: string): Promise<ApiResult<PaymentDetailResponse>> {
  const token = getBearerToken();
  if (!token) {
    return { data: null, error: "authentication failed" };
  }

  return requestJson<PaymentDetailResponse>(PAYMENTS.BY_ID(paymentId), {
    method: "GET",
    headers: buildAuthHeaders(token),
    cache: "no-store",
  });
}

export async function uploadPaymentProof(
  paymentId: string,
  file: File
): Promise<ApiResult<UploadPaymentProofResponse>> {
  const token = getBearerToken();
  if (!token) {
    return { data: null, error: "authentication failed" };
  }

  const formData = new FormData();
  formData.append("file", file);

  return requestJson<UploadPaymentProofResponse>(PAYMENTS.PROOF(paymentId), {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: formData,
  });
}