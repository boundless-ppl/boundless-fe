/**
 * API Configuration Constants
 * Centralized configuration for API endpoints
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
    },
    // Universities endpoints
    UNIVERSITIES: {
      BASE: "/universities",
      BY_ID: (id: string) => `/universities/${id}`,
    },
    // Dream Tracker endpoints
    DREAM_TRACKERS: {
      BASE: "/dream-trackers",
      SUMMARY: "/dream-trackers/summary",
      GROUPED: "/dream-trackers/grouped",
      BY_ID: (id: string) => `/dream-trackers/${id}`,
      UPLOAD_DOCUMENT: (id: string) => `/dream-trackers/requirements/${id}/document`,
    },
    // Recommendations endpoints
    RECOMMENDATIONS: {
      DOCUMENTS: "/recommendations/documents",
      SUBMISSIONS: "/recommendations/submissions",
      SUBMISSION_BY_ID: (id: string) => `/recommendations/submissions/${id}`,
      TRANSCRIPT: "/recommendations/transcript",
      CV: "/recommendations/cv",
      PROFILE: "/recommendations/profile",
    },
  },
  HEADERS: {
    CONTENT_TYPE_JSON: "application/json",
    CONTENT_TYPE_MULTIPART: "multipart/form-data",
  },
} as const;

export type ApiConfig = typeof API_CONFIG;
