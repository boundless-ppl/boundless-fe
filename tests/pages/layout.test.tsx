import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/font/google", () => ({
  Plus_Jakarta_Sans: () => ({
    variable: "--mock-font-sans",
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock("@/lib/amplitude", () => ({
  Amplitude: () => <div>amplitude</div>,
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <footer>footer</footer>,
}));

vi.mock("@/components/Navbar", () => ({
  Navbar: () => <nav>navbar</nav>,
}));

describe("app layout", () => {
  it("renders the root layout shell and metadata", async () => {
    const { default: RootLayout, metadata } = await import("@/app/layout");
    const icons = metadata.icons as { icon?: string; shortcut?: string };

    const html = renderToStaticMarkup(
      <RootLayout>
        <main>page content</main>
      </RootLayout>
    );

    expect(metadata.title).toBe("Boundless");
    expect(metadata.description).toBe(
      "Membantu Anda menembus batas untuk meraih beasiswa S2 ke luar negeri melalui informasi terpercaya, panduan terstruktur, dan persiapan yang tepat."
    );
    expect(icons.icon).toBe("/favicon.ico");
    expect(icons.shortcut).toBe("/logo.png");
    expect(html).toContain('lang="id"');
    expect(html).toContain("--mock-font-sans");
    expect(html).toContain("font-sans antialiased");
    expect(html).toContain("auth-provider");
    expect(html).toContain("navbar");
    expect(html).toContain("page content");
    expect(html).toContain("footer");
    expect(html).toContain("amplitude");
  });
});
