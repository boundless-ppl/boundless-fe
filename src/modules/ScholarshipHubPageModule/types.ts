export interface ScholarshipFilters {
  search: string;
  tipe_pembiayaan: string;
  negara: string;
}

export const TIPE_PEMBIAYAAN_OPTIONS = ["Penuh", "Parsial"] as const;

export const NEGARA_OPTIONS = [
  "Indonesia",
  "United Kingdom",
  "United States",
  "Germany",
  "Australia",
  "Japan",
  "Singapore",
  "Europe",
] as const;
