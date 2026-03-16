// @vitest-environment jsdom

import React from "react";
import { render, waitFor } from "@testing-library/react";

const initAllMock = vi.fn();

vi.mock("@amplitude/unified", () => ({
  initAll: (...args: unknown[]) => initAllMock(...args),
}));

describe("Amplitude", () => {
  beforeEach(() => {
    vi.resetModules();
    initAllMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not initialize amplitude in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "api-key");

    const { Amplitude } = await import("@/lib/amplitude");
    render(<Amplitude />);

    await waitFor(() => {
      expect(initAllMock).not.toHaveBeenCalled();
    });
  });

  it("does not initialize amplitude when the api key is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "");

    const { Amplitude } = await import("@/lib/amplitude");
    render(<Amplitude />);

    await waitFor(() => {
      expect(initAllMock).not.toHaveBeenCalled();
    });
  });

  it("initializes amplitude in non-development environments when api key exists", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "api-key");

    const { Amplitude } = await import("@/lib/amplitude");
    render(<Amplitude />);

    await waitFor(() => {
      expect(initAllMock).toHaveBeenCalledWith("api-key", {
        analytics: {
          autocapture: true,
        },
        sessionReplay: {
          sampleRate: 1,
        },
      });
    });
  });
});
