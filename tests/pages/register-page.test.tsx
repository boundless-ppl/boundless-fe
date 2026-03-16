import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/RegisterPageModule", () => ({
  RegisterPageModule: () => <div>register page module</div>,
}));

describe("register page", () => {
  it("renders the register page module from /register", async () => {
    const { default: RegisterPage } = await import("@/app/register/page");

    const html = renderToStaticMarkup(<RegisterPage />);

    expect(html).toContain("register page module");
  });
});
