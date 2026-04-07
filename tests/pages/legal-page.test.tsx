import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/LegalPageModule", () => ({
  LegalPageModule: () => <div>legal page module</div>,
}));

describe("legal page", () => {
  it("renders the legal page module from /legal", async () => {
    const { default: LegalPage } = await import("@/app/legal/page");

    const html = renderToStaticMarkup(<LegalPage />);

    expect(html).toContain("legal page module");
  });
});
