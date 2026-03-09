export interface FileData {
  name: string;
  size: string;
}

export interface PreferenceData {
  regions: string[];
  countries: string[];
  fields: string[];
  educationLevel: string;
  languages: string[];
  budget: string;
  scholarships: string[];
  startPeriod: string;
  additional: string;
}

export type ModalStep = "upload" | "preferences" | "summary";