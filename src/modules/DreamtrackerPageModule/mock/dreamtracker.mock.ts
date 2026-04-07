import type {
  DreamTrackerDashboardSummary,
  DreamTrackerItem,
  DreamTrackerGroupedResponse,
  DreamRequirement,
} from "@/lib/api-types";

export const mockSummary: DreamTrackerDashboardSummary = {
  total_applications: 4,
  incomplete_count: 4,
  completed_count: 0,
  deadline_near_count: 1,
};

// ─── Shared requirement templates ───────────────────────────────────────────

const admissionRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-adm-1",
    req_catalog_id: "cat-1",
    requirement_key: "ktp",
    requirement_label: "KTP",
    category: "IDENTITY",
    status: "REUSED",
    status_label: "Sudah tersedia",
    status_variant: "SUCCESS",
    can_upload: false,
    needs_reupload: false,
    document: {
      document_id: "doc-1",
      document_type: "KTP",
      original_filename: "ktp.pdf",
      public_url: "https://www.w3.org/WAI/UR/pdf-test/pdf-test.pdf",
      uploaded_at: "2026-04-06T08:00:00Z",
    },
    review: {
      source: "REUSED_EXISTING",
      status: "SKIPPED",
      is_reused: true,
      is_already_verified: true,
      ai_message: "KTP sudah pernah diverifikasi, jadi dokumen lama dipakai kembali.",
      last_processed_at: "2026-04-06T08:05:00Z",
    },
  },
  {
    dream_req_status_id: "req-adm-2",
    req_catalog_id: "cat-2",
    requirement_key: "ijazah",
    requirement_label: "Ijazah Terakhir",
    category: "ACADEMIC",
    status: "REVIEWING",
    status_label: "Sedang diperiksa",
    status_variant: "IN_PROGRESS",
    can_upload: false,
    needs_reupload: false,
    document: {
      document_id: "doc-2",
      document_type: "IJAZAH",
      original_filename: "ijazah.pdf",
      public_url: "https://www.w3.org/WAI/UR/pdf-test/pdf-test.pdf",
      uploaded_at: "2026-04-06T09:00:00Z",
    },
    review: {
      source: "NEW_UPLOAD",
      status: "PROCESSING",
      is_reused: false,
      is_already_verified: false,
      ai_message: "Dokumen berhasil diunggah dan sedang diperiksa AI.",
      last_processed_at: "2026-04-06T09:01:00Z",
    },
  },
  {
    dream_req_status_id: "req-adm-3",
    req_catalog_id: "cat-3",
    requirement_key: "transkrip",
    requirement_label: "Transkrip Nilai",
    category: "ACADEMIC",
    status: "NOT_UPLOADED",
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    can_upload: true,
    needs_reupload: false,
    document: null,
    review: {
      source: "NEW_UPLOAD",
      status: "NOT_STARTED",
      is_reused: false,
      is_already_verified: false,
      ai_message: null,
      last_processed_at: null,
    },
  },
];

const lpdpRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-fund-lpdp-1",
    req_catalog_id: "cat-lpdp-1",
    requirement_key: "surat_rekomendasi",
    requirement_label: "Surat Rekomendasi",
    category: "RECOMMENDATION",
    status: "REJECTED",
    status_label: "Ditolak",
    status_variant: "ERROR",
    can_upload: true,
    needs_reupload: true,
    document: null,
    review: {
      source: "NEW_UPLOAD",
      status: "COMPLETED",
      is_reused: false,
      is_already_verified: false,
      ai_message: "Format dokumen tidak sesuai. Gunakan format resmi LPDP.",
      last_processed_at: "2026-04-05T10:00:00Z",
    },
  },
  {
    dream_req_status_id: "req-fund-lpdp-2",
    req_catalog_id: "cat-lpdp-2",
    requirement_key: "essay_lpdp",
    requirement_label: "Essay Kontribusi",
    category: "ESSAY",
    status: "NOT_UPLOADED",
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    can_upload: true,
    needs_reupload: false,
    document: null,
    review: {
      source: "NEW_UPLOAD",
      status: "NOT_STARTED",
      is_reused: false,
      is_already_verified: false,
      ai_message: null,
      last_processed_at: null,
    },
  },
];

const cheveningRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-fund-chev-1",
    req_catalog_id: "cat-chev-1",
    requirement_key: "personal_statement",
    requirement_label: "Personal Statement",
    category: "ESSAY",
    status: "NOT_UPLOADED",
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    can_upload: true,
    needs_reupload: false,
    document: null,
    review: {
      source: "NEW_UPLOAD",
      status: "NOT_STARTED",
      is_reused: false,
      is_already_verified: false,
      ai_message: null,
      last_processed_at: null,
    },
  },
];

// ─── Trackers ────────────────────────────────────────────────────────────────

const mockTracker1: DreamTrackerItem = {
  dream_tracker_id: "mock-1",
  title: "University of Bristol",
  subtitle: "MSc Computer Science",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  deadline_at: "2026-06-30T00:00:00Z",
  summary: {
    completion_percentage: 33,
    completed_requirements: 1,
    total_requirements: 3,
    next_deadline_at: "2026-06-30T00:00:00Z",
    is_deadline_near: true,
    is_overdue: false,
  },
  program: {
    program_id: "prog-1",
    program_name: "MSc Computer Science",
    university_name: "University of Bristol",
    admission_name: "September 2027 Intake",
    intake: "Fall 2027",
    admission_url: "https://bristol.ac.uk/apply",
    admission_deadline: "2026-06-30T00:00:00Z",
  },
  requirements: [
    ...admissionRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t1" })),
    ...lpdpRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t1" })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1", title: "Pendaftaran Dibuka", status: "DONE", deadline_date: "2026-01-01T00:00:00Z" },
    { dream_milestone_id: "ms-2", title: "Batas Pendaftaran", status: "NOT_STARTED", deadline_date: "2026-06-30T00:00:00Z" },
    { dream_milestone_id: "ms-3", title: "Wawancara", status: "NOT_STARTED", deadline_date: "2026-08-01T00:00:00Z" },
    { dream_milestone_id: "ms-4", title: "Pengumuman", status: "NOT_STARTED", deadline_date: "2026-09-01T00:00:00Z" },
  ],
  fundings: [
    { funding_id: "fund-lpdp", nama_beasiswa: "LPDP Scholarship", provider: "Kementerian Keuangan RI", status: "SELECTED" },
  ],
};

const mockTracker2: DreamTrackerItem = {
  dream_tracker_id: "mock-2",
  title: "University of Bristol",
  subtitle: "MSc Computer Science",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  deadline_at: "2026-06-30T00:00:00Z",
  summary: {
    completion_percentage: 25,
    completed_requirements: 1,
    total_requirements: 4,
    next_deadline_at: "2026-06-30T00:00:00Z",
    is_deadline_near: false,
    is_overdue: false,
  },
  program: {
    program_id: "prog-1",
    program_name: "MSc Computer Science",
    university_name: "University of Bristol",
    admission_name: "September 2027 Intake",
    intake: "Fall 2027",
    admission_url: "https://bristol.ac.uk/apply",
    admission_deadline: "2026-06-30T00:00:00Z",
  },
  requirements: [
    ...admissionRequirements.map((r) => ({
      ...r,
      dream_req_status_id: r.dream_req_status_id + "-t2",
      status: "NOT_UPLOADED" as const,
      can_upload: true,
      document: null,
    })),
    ...cheveningRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t2" })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t2", title: "Pendaftaran Dibuka", status: "DONE", deadline_date: "2026-01-01T00:00:00Z" },
    { dream_milestone_id: "ms-2-t2", title: "Batas Pendaftaran", status: "NOT_STARTED", deadline_date: "2026-06-30T00:00:00Z" },
  ],
  fundings: [
    { funding_id: "fund-chev", nama_beasiswa: "Chevening", provider: "UK Government", status: "SELECTED" },
  ],
};

const mockTracker3: DreamTrackerItem = {
  dream_tracker_id: "mock-3",
  title: "University of Edinburgh",
  subtitle: "MSc Data Science",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  deadline_at: "2026-09-01T00:00:00Z",
  summary: {
    completion_percentage: 20,
    completed_requirements: 1,
    total_requirements: 5,
    next_deadline_at: "2026-09-01T00:00:00Z",
    is_deadline_near: false,
    is_overdue: false,
  },
  program: {
    program_id: "prog-2",
    program_name: "MSc Data Science",
    university_name: "University of Edinburgh",
    admission_name: "September 2027 Intake",
    intake: "Fall 2027",
    admission_url: "https://ed.ac.uk/apply",
    admission_deadline: "2026-09-01T00:00:00Z",
  },
  requirements: [
    ...admissionRequirements.map((r) => ({
      ...r,
      dream_req_status_id: r.dream_req_status_id + "-t3",
      status: "NOT_UPLOADED" as const,
      can_upload: true,
      document: null,
    })),
    ...lpdpRequirements.map((r) => ({
      ...r,
      dream_req_status_id: r.dream_req_status_id + "-t3",
      status: "NOT_UPLOADED" as const,
      can_upload: true,
      needs_reupload: false,
    })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t3", title: "Pendaftaran Dibuka", status: "DONE", deadline_date: "2026-01-01T00:00:00Z" },
    { dream_milestone_id: "ms-2-t3", title: "Batas Pendaftaran", status: "NOT_STARTED", deadline_date: "2026-09-01T00:00:00Z" },
    { dream_milestone_id: "ms-3-t3", title: "Wawancara", status: "NOT_STARTED", deadline_date: "2026-10-01T00:00:00Z" },
  ],
  fundings: [
    { funding_id: "fund-lpdp", nama_beasiswa: "LPDP Scholarship", provider: "Kementerian Keuangan RI", status: "SELECTED" },
  ],
};

const mockTracker4: DreamTrackerItem = {
  dream_tracker_id: "mock-4",
  title: "University of Edinburgh",
  subtitle: "MSc Data Science",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  deadline_at: "2026-09-01T00:00:00Z",
  summary: {
    completion_percentage: 0,
    completed_requirements: 0,
    total_requirements: 4,
    next_deadline_at: "2026-09-01T00:00:00Z",
    is_deadline_near: false,
    is_overdue: false,
  },
  program: {
    program_id: "prog-2",
    program_name: "MSc Data Science",
    university_name: "University of Edinburgh",
    admission_name: "September 2027 Intake",
    intake: "Fall 2027",
    admission_url: "https://ed.ac.uk/apply",
    admission_deadline: "2026-09-01T00:00:00Z",
  },
  requirements: [
    ...admissionRequirements.map((r) => ({
      ...r,
      dream_req_status_id: r.dream_req_status_id + "-t4",
      status: "NOT_UPLOADED" as const,
      can_upload: true,
      document: null,
    })),
    ...cheveningRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t4" })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t4", title: "Pendaftaran Dibuka", status: "DONE", deadline_date: "2026-01-01T00:00:00Z" },
    { dream_milestone_id: "ms-2-t4", title: "Batas Pendaftaran", status: "NOT_STARTED", deadline_date: "2026-09-01T00:00:00Z" },
  ],
  fundings: [
    { funding_id: "fund-chev", nama_beasiswa: "Chevening", provider: "UK Government", status: "SELECTED" },
  ],
};

const allTrackers = [mockTracker1, mockTracker2, mockTracker3, mockTracker4];

// ─── Grouped response ─────────────────────────────────────────────────────────

export const mockGroupedResponse: DreamTrackerGroupedResponse = {
  default_selected_dream_tracker_id: "mock-1",
  universities: [
    {
      university_id: "univ-bristol",
      university_name: "University of Bristol",
      items: [
        {
          dream_tracker_id: "mock-1",
          title: "University of Bristol",
          program_name: "MSc Computer Science",
          admission_name: "Fall 2027",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 33,
          is_selected: true,
        },
        {
          dream_tracker_id: "mock-2",
          title: "University of Bristol",
          program_name: "MSc Computer Science",
          admission_name: "Fall 2027",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 25,
          is_selected: false,
        },
      ],
    },
    {
      university_id: "univ-edinburgh",
      university_name: "University of Edinburgh",
      items: [
        {
          dream_tracker_id: "mock-3",
          title: "University of Edinburgh",
          program_name: "MSc Data Science",
          admission_name: "Fall 2027",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 20,
          is_selected: false,
        },
        {
          dream_tracker_id: "mock-4",
          title: "University of Edinburgh",
          program_name: "MSc Data Science",
          admission_name: "Fall 2027",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 0,
          is_selected: false,
        },
      ],
    },
  ],
  fundings: [
    {
      funding_id: "fund-lpdp",
      funding_name: "LPDP Scholarship",
      items: [
        {
          dream_tracker_id: "mock-1",
          title: "University of Bristol",
          program_name: "MSc Computer Science",
          university_name: "University of Bristol",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 33,
          is_selected: true,
        },
        {
          dream_tracker_id: "mock-3",
          title: "University of Edinburgh",
          program_name: "MSc Data Science",
          university_name: "University of Edinburgh",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 20,
          is_selected: false,
        },
      ],
    },
    {
      funding_id: "fund-chev",
      funding_name: "Chevening",
      items: [
        {
          dream_tracker_id: "mock-2",
          title: "University of Bristol",
          program_name: "MSc Computer Science",
          university_name: "University of Bristol",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 25,
          is_selected: false,
        },
        {
          dream_tracker_id: "mock-4",
          title: "University of Edinburgh",
          program_name: "MSc Data Science",
          university_name: "University of Edinburgh",
          status: "ACTIVE",
          status_label: "Sedang Diproses",
          completion_percentage: 0,
          is_selected: false,
        },
      ],
    },
  ],
  default_detail: mockTracker1,
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export async function getMockSummary(): Promise<DreamTrackerDashboardSummary> {
  await delay(300);
  return mockSummary;
}

export async function getMockGrouped(params?: { include_default_detail?: boolean }): Promise<DreamTrackerGroupedResponse> {
  await delay(400);
  if (params?.include_default_detail) return mockGroupedResponse;
  const { default_detail: _, ...rest } = mockGroupedResponse;
  return rest;
}

export async function getMockTrackerById(id: string): Promise<DreamTrackerItem> {
  await delay(200);
  const found = allTrackers.find((t) => t.dream_tracker_id === id);
  if (!found) throw new Error("Tracker not found");
  return found;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
