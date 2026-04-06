import type {
  DreamTrackerDashboardSummary,
  DreamTrackerItem,
  DreamTrackerListResponse,
} from "@/lib/api-types";

export const mockSummary: DreamTrackerDashboardSummary = {
  total_applications: 3,
  in_progress_count: 2,
  completed_count: 1,
  deadline_near_count: 1,
};

const mockTracker1: DreamTrackerItem = {
  dream_tracker_id: "mock-1",
  user_id: "user-1",
  program_id: "prog-1",
  admission_id: "adm-1",
  funding_id: "fund-1",
  title: "LPDP Bristol 2027",
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
  progress: {
    percentage: 50,
    completed_documents: 2,
    total_documents: 4,
  },
  summary: {
    completion_percentage: 50,
    completed_requirements: 2,
    total_requirements: 4,
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
    {
      dream_req_status_id: "req-1",
      document_id: "doc-1",
      req_catalog_id: "cat-1",
      requirement_key: "ktp",
      requirement_label: "KTP",
      category: "IDENTITY",
      description: "Kartu Tanda Penduduk",
      status: "VERIFIED",
      notes: null,
      ai_status: "SUCCESS",
      ai_messages: ["valid document"],
      label: "KTP",
      is_required: true,
      status_label: "Berhasil diunggah",
      status_variant: "SUCCESS",
      message: "Document accepted",
      action_label: "Unggah Ulang",
      can_upload: false,
      needs_reupload: false,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_req_status_id: "req-2",
      document_id: null,
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
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_req_status_id: "req-3",
      document_id: null,
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
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_req_status_id: "req-4",
      document_id: null,
      req_catalog_id: "cat-4",
      requirement_key: "surat_rekomendasi",
      requirement_label: "Surat Rekomendasi",
      category: "RECOMMENDATION",
      description: "Surat rekomendasi dari dosen atau atasan",
      status: "REJECTED",
      notes: "Format tidak sesuai",
      ai_status: "FAILED",
      ai_messages: ["Format dokumen tidak sesuai dengan yang diminta"],
      label: "Surat Rekomendasi",
      is_required: true,
      status_label: "Ditolak",
      status_variant: "ERROR",
      message: "Format tidak sesuai",
      action_label: "Unggah Ulang",
      can_upload: true,
      needs_reupload: true,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  milestones: [
    {
      dream_milestone_id: "ms-1",
      title: "Open Regist",
      description: "Pendaftaran dibuka",
      deadline_date: "2026-01-01T00:00:00Z",
      is_required: true,
      status: "DONE",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_milestone_id: "ms-2",
      title: "Close",
      description: "Pendaftaran ditutup",
      deadline_date: "2026-06-30T00:00:00Z",
      is_required: true,
      status: "NOT_STARTED",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_milestone_id: "ms-3",
      title: "Wawancara",
      description: "Sesi wawancara",
      deadline_date: "2026-08-01T00:00:00Z",
      is_required: true,
      status: "NOT_STARTED",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
    {
      dream_milestone_id: "ms-4",
      title: "Pengumuman",
      description: "Pengumuman hasil seleksi",
      deadline_date: "2026-09-01T00:00:00Z",
      is_required: true,
      status: "NOT_STARTED",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ],
  fundings: [
    {
      funding_id: "fund-1",
      nama_beasiswa: "LPDP Scholarship",
      deskripsi: "Beasiswa LPDP dari Kementerian Keuangan RI",
      provider: "Kementerian Keuangan RI",
      tipe_pembiayaan: "SCHOLARSHIP",
      website: "https://lpdp.kemenkeu.go.id",
      status: "SELECTED",
    },
  ],
};

const mockTracker2: DreamTrackerItem = {
  dream_tracker_id: "mock-2",
  user_id: "user-1",
  program_id: "prog-2",
  admission_id: "adm-2",
  funding_id: "fund-2",
  title: "Chevening Edinburgh 2027",
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
  progress: {
    percentage: 25,
    completed_documents: 1,
    total_documents: 4,
  },
  summary: {
    completion_percentage: 25,
    completed_requirements: 1,
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
  requirements: mockTracker1.requirements.map((r) => ({
    ...r,
    dream_req_status_id: r.dream_req_status_id + "-b",
    status: "NOT_UPLOADED" as const,
    status_label: "Belum diunggah",
    status_variant: "DEFAULT",
    message: null,
    document_id: null,
    can_upload: true,
  })),
  milestones: mockTracker1.milestones.map((m) => ({
    ...m,
    dream_milestone_id: m.dream_milestone_id + "-b",
    status: "NOT_STARTED" as const,
  })),
  fundings: [
    {
      funding_id: "fund-2",
      nama_beasiswa: "Chevening",
      deskripsi: "UK Government's global scholarship programme",
      provider: "UK Government",
      tipe_pembiayaan: "SCHOLARSHIP",
      website: "https://chevening.org",
      status: "AVAILABLE",
    },
  ],
};

export const mockTrackerList: DreamTrackerListResponse = {
  items: [mockTracker1, mockTracker2],
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
