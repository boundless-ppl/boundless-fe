import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/DashboardPageModule", () => ({
  DashboardPageModule: () => <div>dashboard page module</div>,
}));

describe("dashboard page", () => {
  it("renders the dashboard page module from /dashboard", async () => {
    const { default: DashboardPage } = await import("@/app/dashboard/page");

    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("dashboard page module");
  });
});
