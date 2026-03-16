import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/HomePageModule", () => ({
  HomePageModule: () => <div>home page module</div>,
}));

describe("home page", () => {
  it("renders the homepage module from /", async () => {
    const { default: Page } = await import("@/app/page");

    const html = renderToStaticMarkup(await Page());

    expect(html).toContain("home page module");
  });
});
