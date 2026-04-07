import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const {
  pushMock,
  getSubmissionDetailsMock,
  useParamsMock,
  useEffectMock,
  useStateMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  getSubmissionDetailsMock: vi.fn(),
  useParamsMock: vi.fn(() => ({ id: "submission-123" })),
  useEffectMock: vi.fn(),
  useStateMock: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useEffect: useEffectMock,
    useState: useStateMock,
  };
});

vi.mock("next/navigation", () => ({
  useParams: () => useParamsMock(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="arrow-left" />,
  Loader2: () => <svg data-testid="loader" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/features/globalmatch/services/recommendation.service", () => ({
  getSubmissionDetails: (...args: unknown[]) => getSubmissionDetailsMock(...args),
}));

vi.mock("@/modules/GlobalmatchPageModule/components/ResultsPage/RecommendationDisplay", () => ({
  RecommendationDisplay: ({ result }: { result: { submission_id: string } }) => (
    <div data-testid="recommendation-display">result:{result.submission_id}</div>
  ),
}));

describe("/globalmatch/results/[id] page", () => {
  type CallableElement = React.ReactElement<Record<string, unknown>> & {
    type: (props: Record<string, unknown>) => React.ReactNode;
  };

  function isFunctionElement(
    node: unknown
  ): node is CallableElement {
    return React.isValidElement(node) && typeof node.type === "function";
  }

  function isElementWithChildren(
    node: unknown
  ): node is React.ReactElement<{ children?: React.ReactNode }> {
    return React.isValidElement(node);
  }

  beforeEach(() => {
    pushMock.mockReset();
    getSubmissionDetailsMock.mockReset();
    useParamsMock.mockReturnValue({ id: "submission-123" });
    useEffectMock.mockImplementation(() => {});
    useStateMock.mockReset();
    vi.stubGlobal("location", {
      reload: vi.fn(),
    });
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn(() => null),
      removeItem: vi.fn(),
    });
  });

  function setStateSequence(result: unknown, isLoading: boolean, error: string | null) {
    useStateMock
      .mockImplementationOnce(() => [result, vi.fn()])
      .mockImplementationOnce(() => [isLoading, vi.fn()])
      .mockImplementationOnce(() => [error, vi.fn()]);
  }

  function extractText(node: unknown): string {
    if (node == null) {
      return "";
    }

    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }

    if (!isElementWithChildren(node)) {
      return "";
    }

    if (isFunctionElement(node)) {
      return extractText(node.type(node.props));
    }

    return extractText(React.Children.toArray(node.props.children));
  }

  function findButtonByText(node: unknown, text: string): { props: { onClick?: () => void } } | null {
    if (node == null || typeof node === "string" || typeof node === "number") {
      return null;
    }

    if (Array.isArray(node)) {
      for (const child of node) {
        const match = findButtonByText(child, text);
        if (match) {
          return match;
        }
      }
      return null;
    }

    if (!isElementWithChildren(node)) {
      return null;
    }

    if (isFunctionElement(node)) {
      return findButtonByText(node.type(node.props), text);
    }

    const children = React.Children.toArray(node.props.children);
    const directText = extractText(children).trim();

    if (node.type === "button" && directText === text) {
      return node as { props: { onClick?: () => void } };
    }

    return findButtonByText(children, text);
  }

  it("renders a cached result from session storage", async () => {
    const setResultMock = vi.fn();
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    const cachedResult = {
      submission_id: "submission-123",
      status: "completed",
      result_set_id: "result-1",
      result: {
        student_profile_summary: {
          academic_background: "cached",
          experience_summary: "",
          strengths: [],
          improvement_areas: [],
          preferred_themes: [],
          raw_text: "",
        },
        top_recommendations: [],
        selection_reasoning: "cached",
        application_strategy: {
          ambitious: "",
          target: "",
          balanced_option: "",
        },
        final_notes: [],
      },
    };

    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn(() => JSON.stringify(cachedResult)),
      removeItem: vi.fn(),
    });
    useStateMock
      .mockImplementationOnce(() => [null, setResultMock])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();

    expect(sessionStorage.getItem).toHaveBeenCalledWith("globalmatch_result_submission-123");
    expect(getSubmissionDetailsMock).not.toHaveBeenCalled();
    expect(setErrorMock).toHaveBeenCalledWith(null);
    expect(setResultMock).toHaveBeenCalledWith(cachedResult);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("fetches fallback results when cache is missing", async () => {
    const setResultMock = vi.fn();
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    useStateMock
      .mockImplementationOnce(() => [null, setResultMock])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
    getSubmissionDetailsMock.mockResolvedValue({
      submission_id: "submission-123",
      status: "completed",
      latest_result: {
        result_set_id: "result-2",
        results: [
          {
            rank_no: 1,
            university_name: "Test University",
            program_name: "Computer Science",
            country: "Australia",
            fit_score: 88,
            fit_level: "high",
            overview: "overview",
            why_this_university: "why uni",
            why_this_program: "why program",
            reason_summary: "reason",
            pros: ["pro"],
            cons: ["con"],
          },
        ],
      },
    });

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();
    await Promise.resolve();

    expect(getSubmissionDetailsMock).toHaveBeenCalledWith("submission-123");
    expect(setResultMock).toHaveBeenCalledWith(
      expect.objectContaining({
        submission_id: "submission-123",
        status: "completed",
        result_set_id: "result-2",
      })
    );
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("maps incomplete server payloads using the route submission id and processing status", async () => {
    const setResultMock = vi.fn();
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    useStateMock
      .mockImplementationOnce(() => [null, setResultMock])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
    getSubmissionDetailsMock.mockResolvedValue({
      submission_id: "",
      status: "queued",
      latest_result: {
        result_set_id: "result-queued",
        results: [
          {
            rank_no: 2,
            university_name: "Fallback University",
            program_name: "Data Science",
            country: "Singapore",
            fit_score: 73,
            fit_level: "medium",
            overview: "fallback overview",
            why_this_university: "fallback university",
            why_this_program: "fallback program",
            reason_summary: "",
            pros: ["small class"],
            cons: ["competitive"],
          },
        ],
      },
    });

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();
    await Promise.resolve();

    expect(setErrorMock).toHaveBeenCalledWith(null);
    expect(setResultMock).toHaveBeenCalledWith(
      expect.objectContaining({
        submission_id: "submission-123",
        status: "processing",
        result_set_id: "result-queued",
      })
    );
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("stores a friendly error when the server returns no usable recommendation", async () => {
    const setResultMock = vi.fn();
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    useStateMock
      .mockImplementationOnce(() => [null, setResultMock])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
    getSubmissionDetailsMock.mockResolvedValue({
      submission_id: "submission-123",
      status: "processing",
      latest_result: {
        result_set_id: "result-3",
        results: [],
      },
    });

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();
    await Promise.resolve();

    expect(setResultMock).not.toHaveBeenCalled();
    expect(setErrorMock).toHaveBeenCalledWith("Hasil rekomendasi tidak ditemukan. Silakan submit ulang.");
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("stores thrown service errors", async () => {
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    useStateMock
      .mockImplementationOnce(() => [null, vi.fn()])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
    getSubmissionDetailsMock.mockRejectedValue(new Error("Server sedang sibuk"));

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();
    await Promise.resolve();

    expect(setErrorMock).toHaveBeenCalledWith("Server sedang sibuk");
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("stores a default message when a non-Error value is thrown", async () => {
    const setLoadingMock = vi.fn();
    const setErrorMock = vi.fn();
    useStateMock
      .mockImplementationOnce(() => [null, vi.fn()])
      .mockImplementationOnce(() => [true, setLoadingMock])
      .mockImplementationOnce(() => [null, setErrorMock]);
    useEffectMock.mockImplementation((callback: () => void) => {
      callback();
    });
    getSubmissionDetailsMock.mockRejectedValue("unexpected");

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    renderToStaticMarkup(<GlobalmatchResultsPage />);

    await Promise.resolve();
    await Promise.resolve();

    expect(setErrorMock).toHaveBeenCalledWith("Gagal memuat hasil rekomendasi");
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("renders the loading state", async () => {
    setStateSequence(null, true, null);

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const html = renderToStaticMarkup(<GlobalmatchResultsPage />);

    expect(html).toContain("Memuat hasil...");
    expect(html).toContain("Mohon tunggu sebentar");
  });

  it("renders the success state", async () => {
    setStateSequence(
      {
        submission_id: "submission-123",
      },
      false,
      null
    );

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const html = renderToStaticMarkup(<GlobalmatchResultsPage />);

    expect(html).toContain("result:submission-123");
  });

  it("renders the error state", async () => {
    setStateSequence(null, false, "Server sedang sibuk");

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const html = renderToStaticMarkup(<GlobalmatchResultsPage />);

    expect(html).toContain("Terjadi Kesalahan");
    expect(html).toContain("Server sedang sibuk");
    expect(html).toContain("Coba Lagi");
  });

  it("handles the back action", async () => {
    setStateSequence(null, true, null);

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const tree = GlobalmatchResultsPage();
    const backButton = findButtonByText(tree, "Kembali");

    backButton?.props.onClick?.();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith("globalmatch_result_submission-123");
    expect(pushMock).toHaveBeenCalledWith("/globalmatch");
  });

  it("handles the new submission action", async () => {
    setStateSequence(null, true, null);

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const tree = GlobalmatchResultsPage();
    const submitButton = findButtonByText(tree, "Submit Baru");

    submitButton?.props.onClick?.();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith("globalmatch_result_submission-123");
    expect(pushMock).toHaveBeenCalledWith("/globalmatch");
  });

  it("handles the retry action from the error state", async () => {
    setStateSequence(null, false, "Server sedang sibuk");

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const tree = GlobalmatchResultsPage();
    const retryButton = findButtonByText(tree, "Coba Lagi");

    retryButton?.props.onClick?.();

    expect(globalThis.location.reload).toHaveBeenCalledTimes(1);
  });

  it("handles the back action from the error state", async () => {
    setStateSequence(null, false, "Server sedang sibuk");

    const { default: GlobalmatchResultsPage } = await import("@/app/globalmatch/results/[id]/page");

    const tree = GlobalmatchResultsPage();
    const backHomeButton = findButtonByText(tree, "Kembali ke Beranda");

    backHomeButton?.props.onClick?.();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith("globalmatch_result_submission-123");
    expect(pushMock).toHaveBeenCalledWith("/globalmatch");
  });
});
