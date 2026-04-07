import type {
  DreamTrackerDashboardSummary,
  DreamTrackerItem,
  DreamTrackerListResponse,
  DreamRequirement,
} from "@/lib/api-types";

export const mockSummary: DreamTrackerDashboardSummary = {
  total_applications: 4,
  in_progress_count: 4,
  completed_count: 0,
  deadline_near_count: 1,
};

// ─── Shared requirement templates ───────────────────────────────────────────

const admissionRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-adm-1",
    document_id: "doc-1",
    document_url: "https://www.w3.org/WAI/UR/pdf-test/pdf-test.pdf",
    req_catalog_id: "cat-1",
    requirement_key: "ktp",
    requirement_label: "KTP",
    category: "IDENTITY",
    description: "Kartu Tanda Penduduk",
    status: "VERIFIED",
    notes: null,
    ai_status: "SUCCESS",
    ai_messages: ["Dokumen valid"],
    label: "KTP",
    is_required: true,
    status_label: "Berhasil diunggah",
    status_variant: "SUCCESS",
    message: "Dokumen diterima",
    action_label: "Unggah Ulang",
    can_upload: false,
    needs_reupload: false,
    source_type: "ADMISSION",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    dream_req_status_id: "req-adm-2",
    document_id: null,
    document_url: null,
    req_catalog_id: "cat-2",
    requirement_key: "ijazah",
    requirement_label: "Ijazah Terakhir",
    category: "ACADEMIC",
    description: "Ijazah pendidikan terakhir yang telah dilegalisir",
    status: "UPLOADED",
    notes: null,
    ai_status: "PENDING",
    ai_messages: [],
    label: "Ijazah Terakhir",
    is_required: true,
    status_label: "Menunggu verifikasi",
    status_variant: "WARNING",
    message: null,
    action_label: "Unggah Ulang",
    can_upload: true,
    needs_reupload: false,
    source_type: "ADMISSION",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    dream_req_status_id: "req-adm-3",
    document_id: null,
    document_url: null,
    req_catalog_id: "cat-3",
    requirement_key: "transkrip",
    requirement_label: "Transkrip Nilai",
    category: "ACADEMIC",
    description: "Transkrip nilai resmi dari universitas",
    status: "NOT_UPLOADED",
    notes: null,
    ai_status: null,
    ai_messages: [],
    label: "Transkrip Nilai",
    is_required: true,
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    message: null,
    action_label: "Unggah",
    can_upload: true,
    needs_reupload: false,
    source_type: "ADMISSION",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const lpdpRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-fund-lpdp-1",
    document_id: null,
    document_url: null,
    req_catalog_id: "cat-lpdp-1",
    requirement_key: "surat_rekomendasi",
    requirement_label: "Surat Rekomendasi",
    category: "RECOMMENDATION",
    description: "Surat rekomendasi dari dosen atau atasan",
    status: "REJECTED",
    notes: "Format tidak sesuai",
    ai_status: "FAILED",
    ai_messages: ["Format dokumen tidak sesuai dengan yang diminta", "Gunakan format resmi LPDP"],
    label: "Surat Rekomendasi",
    is_required: true,
    status_label: "Ditolak",
    status_variant: "ERROR",
    message: "Format tidak sesuai",
    action_label: "Unggah Ulang",
    can_upload: true,
    needs_reupload: true,
    source_type: "FUNDING",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    dream_req_status_id: "req-fund-lpdp-2",
    document_id: null,
    document_url: null,
    req_catalog_id: "cat-lpdp-2",
    requirement_key: "essay_lpdp",
    requirement_label: "Essay Kontribusi",
    category: "ESSAY",
    description: "Essay kontribusi untuk Indonesia setelah studi",
    status: "NOT_UPLOADED",
    notes: null,
    ai_status: null,
    ai_messages: [],
    label: "Essay Kontribusi",
    is_required: true,
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    message: null,
    action_label: "Unggah",
    can_upload: true,
    needs_reupload: false,
    source_type: "FUNDING",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const cheveningRequirements: DreamRequirement[] = [
  {
    dream_req_status_id: "req-fund-chev-1",
    document_id: null,
    document_url: null,
    req_catalog_id: "cat-chev-1",
    requirement_key: "personal_statement",
    requirement_label: "Personal Statement",
    category: "ESSAY",
    description: "Personal statement sesuai format Chevening",
    status: "NOT_UPLOADED",
    notes: null,
    ai_status: null,
    ai_messages: [],
    label: "Personal Statement",
    is_required: true,
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    message: null,
    action_label: "Unggah",
    can_upload: true,
    needs_reupload: false,
    source_type: "FUNDING",
    created_at: "2026-01-01T00:00:00Z",
  },
];

// ─── Trackers ────────────────────────────────────────────────────────────────

const mockTracker1: DreamTrackerItem = {
  dream_tracker_id: "mock-1",
  user_id: "user-1",
  program_id: "prog-1",
  admission_id: "adm-1",
  funding_id: "fund-lpdp",
  title: "University of Bristol + LPDP",
  subtitle: "Fall 2027",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  source_type: "MANUAL",
  req_submission_id: null,
  source_rec_result_id: null,
  deadline_at: "2026-06-30T00:00:00Z",
  progress: { percentage: 40, completed_documents: 2, total_documents: 5 },
  summary: {
    completion_percentage: 40,
    completed_requirements: 2,
    total_requirements: 5,
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
    { dream_milestone_id: "ms-1", title: "Pendaftaran Dibuka", description: "", deadline_date: "2026-01-01T00:00:00Z", is_required: true, status: "DONE", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-2", title: "Batas Pendaftaran", description: "", deadline_date: "2026-06-30T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-3", title: "Wawancara", description: "", deadline_date: "2026-08-01T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-4", title: "Pengumuman", description: "", deadline_date: "2026-09-01T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
  ],
  fundings: [
    { funding_id: "fund-lpdp", nama_beasiswa: "LPDP Scholarship", deskripsi: "Beasiswa LPDP dari Kementerian Keuangan RI", provider: "Kementerian Keuangan RI", tipe_pembiayaan: "SCHOLARSHIP", website: "https://lpdp.kemenkeu.go.id", status: "SELECTED" },
  ],
};

const mockTracker2: DreamTrackerItem = {
  dream_tracker_id: "mock-2",
  user_id: "user-1",
  program_id: "prog-1",
  admission_id: "adm-1",
  funding_id: "fund-chev",
  title: "University of Bristol + Chevening",
  subtitle: "Fall 2027",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  source_type: "MANUAL",
  req_submission_id: null,
  source_rec_result_id: null,
  deadline_at: "2026-06-30T00:00:00Z",
  progress: { percentage: 25, completed_documents: 1, total_documents: 4 },
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
    ...admissionRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t2", status: "NOT_UPLOADED" as const, can_upload: true, document_id: null, document_url: null })),
    ...cheveningRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t2" })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t2", title: "Pendaftaran Dibuka", description: "", deadline_date: "2026-01-01T00:00:00Z", is_required: true, status: "DONE", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-2-t2", title: "Batas Pendaftaran", description: "", deadline_date: "2026-06-30T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
  ],
  fundings: [
    { funding_id: "fund-chev", nama_beasiswa: "Chevening", deskripsi: "UK Government's global scholarship programme", provider: "UK Government", tipe_pembiayaan: "SCHOLARSHIP", website: "https://chevening.org", status: "SELECTED" },
  ],
};

const mockTracker3: DreamTrackerItem = {
  dream_tracker_id: "mock-3",
  user_id: "user-1",
  program_id: "prog-2",
  admission_id: "adm-2",
  funding_id: "fund-lpdp",
  title: "University of Edinburgh + LPDP",
  subtitle: "Fall 2027",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  source_type: "MANUAL",
  req_submission_id: null,
  source_rec_result_id: null,
  deadline_at: "2026-09-01T00:00:00Z",
  progress: { percentage: 20, completed_documents: 1, total_documents: 5 },
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
    ...admissionRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t3", status: "NOT_UPLOADED" as const, can_upload: true, document_id: null, document_url: null })),
    ...lpdpRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t3", status: "NOT_UPLOADED" as const, can_upload: true, needs_reupload: false, ai_messages: [] as string[] })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t3", title: "Pendaftaran Dibuka", description: "", deadline_date: "2026-01-01T00:00:00Z", is_required: true, status: "DONE", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-2-t3", title: "Batas Pendaftaran", description: "", deadline_date: "2026-09-01T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-3-t3", title: "Wawancara", description: "", deadline_date: "2026-10-01T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
  ],
  fundings: [
    { funding_id: "fund-lpdp", nama_beasiswa: "LPDP Scholarship", deskripsi: "Beasiswa LPDP dari Kementerian Keuangan RI", provider: "Kementerian Keuangan RI", tipe_pembiayaan: "SCHOLARSHIP", website: "https://lpdp.kemenkeu.go.id", status: "SELECTED" },
  ],
};

const mockTracker4: DreamTrackerItem = {
  dream_tracker_id: "mock-4",
  user_id: "user-1",
  program_id: "prog-2",
  admission_id: "adm-2",
  funding_id: "fund-chev",
  title: "University of Edinburgh + Chevening",
  subtitle: "Fall 2027",
  status: "ACTIVE",
  status_label: "Sedang Diproses",
  status_variant: "IN_PROGRESS",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-04-01T00:00:00Z",
  source_type: "MANUAL",
  req_submission_id: null,
  source_rec_result_id: null,
  deadline_at: "2026-09-01T00:00:00Z",
  progress: { percentage: 0, completed_documents: 0, total_documents: 4 },
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
    ...admissionRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t4", status: "NOT_UPLOADED" as const, can_upload: true, document_id: null, document_url: null })),
    ...cheveningRequirements.map((r) => ({ ...r, dream_req_status_id: r.dream_req_status_id + "-t4" })),
  ],
  milestones: [
    { dream_milestone_id: "ms-1-t4", title: "Pendaftaran Dibuka", description: "", deadline_date: "2026-01-01T00:00:00Z", is_required: true, status: "DONE", created_at: "", updated_at: "" },
    { dream_milestone_id: "ms-2-t4", title: "Batas Pendaftaran", description: "", deadline_date: "2026-09-01T00:00:00Z", is_required: true, status: "NOT_STARTED", created_at: "", updated_at: "" },
  ],
  fundings: [
    { funding_id: "fund-chev", nama_beasiswa: "Chevening", deskripsi: "UK Government's global scholarship programme", provider: "UK Government", tipe_pembiayaan: "SCHOLARSHIP", website: "https://chevening.org", status: "SELECTED" },
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const mockTrackerList: DreamTrackerListResponse = {
  items: [mockTracker1, mockTracker2, mockTracker3, mockTracker4],
};

export async function getMockSummary(): Promise<DreamTrackerDashboardSummary> {
  await delay(300);
  return mockSummary;
}

export async function getMockTrackers(): Promise<DreamTrackerListResponse> {
  await delay(400);
  return mockTrackerList;
}

export async function getMockTrackerById(id: string): Promise<DreamTrackerItem> {
  await delay(200);
  const found = mockTrackerList.items.find((t) => t.dream_tracker_id === id);
  if (!found) throw new Error("Tracker not found");
  return found;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
