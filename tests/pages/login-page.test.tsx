import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/LoginPageModule", () => ({
  LoginPageModule: () => <div>login page module</div>,
}));

describe("login page", () => {
  it("renders the login page module from /login", async () => {
    const { default: LoginPage } = await import("@/app/login/page");

    const html = renderToStaticMarkup(<LoginPage />);

    expect(html).toContain("login page module");
  });
});
