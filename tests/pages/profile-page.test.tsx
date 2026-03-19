import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/modules/ProfilePageModule", () => ({
  ProfilePageModule: () => <div>profile page module</div>,
}));

describe("profile page", () => {
  it("renders the profile page module from /profile", async () => {
    const { default: ProfilePage } = await import("@/app/profile/page");

    const html = renderToStaticMarkup(<ProfilePage />);

    expect(html).toContain("profile page module");
  });
});
