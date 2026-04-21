import { describe, expect, it } from "vitest";

const initAllMock = vi.fn();

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useEffect: (callback: () => void) => {
      callback();
    },
  };
});

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
    Amplitude();

    expect(initAllMock).not.toHaveBeenCalled();
  });

  it("does not initialize amplitude when the api key is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "");

    const { Amplitude } = await import("@/lib/amplitude");
    Amplitude();

    expect(initAllMock).not.toHaveBeenCalled();
  });

  it("initializes amplitude in non-development environments when api key exists", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_AMPLITUDE_API_KEY", "api-key");

    const { Amplitude } = await import("@/lib/amplitude");
    Amplitude();

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
