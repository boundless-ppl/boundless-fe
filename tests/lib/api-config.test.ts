describe("API_CONFIG", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("uses NEXT_PUBLIC_API_BASE_URL when provided", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";

    const { API_CONFIG } = await import("@/lib/api-config");

    expect(API_CONFIG.BASE_URL).toBe("https://api.example.com");
    expect(API_CONFIG.ENDPOINTS.AUTH.LOGIN).toBe("/auth/login");
    expect(API_CONFIG.ENDPOINTS.UNIVERSITIES.BY_ID("42")).toBe("/universities/42");
    expect(API_CONFIG.ENDPOINTS.RECOMMENDATIONS.SUBMISSION_BY_ID("abc")).toBe(
      "/recommendations/submissions/abc"
    );
    expect(API_CONFIG.HEADERS.CONTENT_TYPE_JSON).toBe("application/json");
  });

  it("falls back to localhost when NEXT_PUBLIC_API_BASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    const { API_CONFIG } = await import("@/lib/api-config");

    expect(API_CONFIG.BASE_URL).toBe("http://localhost:8080");
    expect(API_CONFIG.HEADERS.CONTENT_TYPE_MULTIPART).toBe("multipart/form-data");
  });
});
