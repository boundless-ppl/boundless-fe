import { API_CONFIG } from "@/lib/api-config";
import type { Scholarship, ScholarshipListResponse } from "@/lib/api-types";
import { MOCK_SCHOLARSHIPS } from "./scholarship.mock";

export interface ScholarshipListParams {
  page?: number;
  page_size?: number;
  search?: string;
  tipe_pembiayaan?: string;
  negara?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

function buildAuthHeaders(): HeadersInit {
  if (typeof document === "undefined") return { "Content-Type": "application/json" };
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(body.error ?? "Request failed", response.status);
  }
  return response.json() as Promise<T>;
}

export async function getScholarships(
  params: ScholarshipListParams = {},
): Promise<ScholarshipListResponse> {
  const { page = 1, page_size = 12, search, tipe_pembiayaan, negara } = params;

  try {
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(page_size),
      ...(search ? { search } : {}),
      ...(tipe_pembiayaan ? { tipe_pembiayaan } : {}),
      ...(negara ? { negara } : {}),
    });

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHOLARSHIPS.BASE}?${query}`;
    const response = await fetch(url, { headers: buildAuthHeaders() });
    return handleResponse<ScholarshipListResponse>(response);
  } catch {
    return getMockScholarships(params);
  }
}

export async function getScholarshipById(id: string): Promise<Scholarship> {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHOLARSHIPS.BY_ID(id)}`;
    const response = await fetch(url, { headers: buildAuthHeaders() });
    return handleResponse<Scholarship>(response);
  } catch {
    const found = MOCK_SCHOLARSHIPS.find((s) => s.id === id);
    if (!found) throw new ApiError("Beasiswa tidak ditemukan", 404);
    return found;
  }
}

function getMockScholarships(params: ScholarshipListParams): ScholarshipListResponse {
  const { page = 1, page_size = 12, search, tipe_pembiayaan, negara } = params;
  const today = new Date();

  let filtered = MOCK_SCHOLARSHIPS.filter((s) => {
    if (!s.is_active) return false;
    if (new Date(s.deadline) < today) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.nama.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q)) return false;
    }
    if (tipe_pembiayaan && s.tipe_pembiayaan !== tipe_pembiayaan) return false;
    if (negara && s.negara !== negara) return false;
    return true;
  });

  const total = filtered.length;
  const total_pages = Math.ceil(total / page_size);
  const start = (page - 1) * page_size;
  filtered = filtered.slice(start, start + page_size);

  return { data: filtered, total, page, page_size, total_pages };
}
