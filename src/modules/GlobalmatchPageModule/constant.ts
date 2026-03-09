export const REGIONS = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
];

export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Denmark",
  "Singapore",
  "South Korea",
  "Japan",
  "Australia",
  "Canada",
];

export const FIELDS_OF_STUDY = [
  "Computer Science",
  "Data Science",
  "Artificial Intelligence",
  "Business Administration",
  "Engineering",
  "Social Sciences",
  "Natural Sciences",
  "Arts & Humanities",
];

export const EDUCATION_LEVELS = [
  { label: "S1/Bachelor", value: "bachelor" },
  { label: "S2/Master", value: "master" },
  { label: "S3/PhD", value: "phd" },
];

export const LANGUAGES = [
  "English",
  "German",
  "French",
  "Spanish",
  "Dutch",
  "Swedish",
  "Korean",
  "Japanese",
];

export const BUDGET_PREFERENCES = [
  { label: "No preference", value: "none" },
  { label: "Free tuition", value: "free" },
  { label: "Under $5,000/year", value: "under-5k" },
  { label: "Under $10,000/year", value: "under-10k" },
  { label: "Under $20,000/year", value: "under-20k" },
];

export const SCHOLARSHIP_TYPES = [
  { label: "Fully-funded", value: "fully-funded" },
  { label: "Partial scholarship", value: "partial" },
  { label: "Merit-based", value: "merit-based" },
  { label: "Need-based", value: "need-based" },
  { label: "No scholarship needed", value: "no-scholarship" },
];

export const START_PERIODS = [
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
  "Spring 2028",
];

export const GLOBALMATCH_FEATURE_FLAGS = {
  USE_MOCK_DATA: false,
  MOCK_API_DELAY: 2000,
} as const;