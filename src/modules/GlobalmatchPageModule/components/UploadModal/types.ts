export interface FileData {
  file: File;
  name: string;
  size: string;
}

export interface SelectedFiles {
  cv: FileData | null;
  transcript: FileData | null;
}

export interface PreferenceData {
  countries: string[];
  fields: string[];
  customField: string;
  educationLevel: "master";
  languages: string[];
  budget: string;
  scholarships: string[];
  startPeriod: string;
  additional: string;
}

export type ModalStep = "upload" | "preferences" | "summary";
