import { renderToStaticMarkup } from "react-dom/server";

const { cookiesGetMock, redirectMock, isAccessTokenExpiredMock } = vi.hoisted(() => ({
  cookiesGetMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  isAccessTokenExpiredMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: cookiesGetMock,
    }),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/features/auth/utils/access-token", () => ({
  isAccessTokenExpired: isAccessTokenExpiredMock,
}));

vi.mock("@/modules/HomePageModule", () => ({
  HomePageModule: () => <div>home page module</div>,
}));

describe("home page", () => {
  beforeEach(() => {
    cookiesGetMock.mockReset();
    redirectMock.mockClear();
    isAccessTokenExpiredMock.mockReset();
    cookiesGetMock.mockReturnValue(undefined);
    isAccessTokenExpiredMock.mockReturnValue(true);
  });

  it("renders the homepage module from /", async () => {
    const { default: Page } = await import("@/app/page");

    const html = renderToStaticMarkup(await Page());

    expect(html).toContain("home page module");
  });

  it("redirects authenticated users from / to /dashboard", async () => {
    cookiesGetMock.mockReturnValue({ value: "valid-access-token" });
    isAccessTokenExpiredMock.mockReturnValue(false);

    const { default: Page } = await import("@/app/page");

    await expect(Page()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });
});
