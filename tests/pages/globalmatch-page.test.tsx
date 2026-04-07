import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const { replaceMock, useAuthMock, useEffectMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  useAuthMock: vi.fn(),
  useEffectMock: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useEffect: useEffectMock,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/modules/GlobalmatchPageModule", () => ({
  GlobalmatchPageModule: () => <div>globalmatch page module</div>,
}));

describe("/globalmatch page", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useAuthMock.mockReset();
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
  });

  it("renders the redirect placeholder and sends guests to login", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { default: GlobalmatchPage } = await import("@/app/globalmatch/page");

    const html = renderToStaticMarkup(<GlobalmatchPage />);

    expect(html).toContain("Mengalihkan ke halaman masuk");
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("keeps showing the placeholder while auth state is loading", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { default: GlobalmatchPage } = await import("@/app/globalmatch/page");

    const html = renderToStaticMarkup(<GlobalmatchPage />);

    expect(html).toContain("Mengalihkan ke halaman masuk");
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders the module for authenticated users", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { default: GlobalmatchPage } = await import("@/app/globalmatch/page");

    const html = renderToStaticMarkup(<GlobalmatchPage />);

    expect(html).toContain("globalmatch page module");
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
