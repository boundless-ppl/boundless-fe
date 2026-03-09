import { GraduationCap, Sparkles, Target, Zap } from "lucide-react";

export type FeatureStatus = 'in-development' | 'coming-soon' | 'live';

export const FEATURES = [
    {
      title: "Scholarship Hub",
      description: "View, filter, and access a complete list of Master's degree scholarships from a single, trustworthy source.",
      icon: GraduationCap
    },
    {
      title: "Globalmatch AI", 
      description: "Get AI-powered personalized recommendations of universities and topics tailored to your academic profile.",
      icon: Sparkles
    },
    {
      title: "Dreamtracker",
      description: "Track all your scholarship applications, deadlines, and progress in one organized dashboard.",
      icon: Target
    },
    {
      title: "Auto-Fill",
      description: "Save time by automatically populating application forms with your stored profile data.",
      icon: Zap
    }
  ];

export const FEATURE_STEPS = [
  {
    title: "Scholarship Hub",
    description: "View, filter, and access a complete list of Master's degree scholarships from a single, trustworthy source. Say goodbye to 50 open tabs.",
    bgColor: "bg-blue-600",
    accentColor: "border-blue-500",
    illustration: "/SCHOLARSHIP_HUB.jpg",
    status: "coming-soon" as FeatureStatus
  },
  {
    title: "Globalmatch AI",
    description: "Upload your CV and academic records to get AI-powered personalized recommendations of universities and topics tailored to your profile.",
    bgColor: "bg-violet-600",
    accentColor: "border-violet-500",
    illustration: "/SCHOLARSHIP_MATCHER.jpg",
    status: "live" as FeatureStatus
  },
  {
    title: "Dreamtracker",
    description: "Track all your scholarship applications, deadlines, and progress in one organized dashboard. Never miss a deadline again.",
    bgColor: "bg-emerald-600",
    accentColor: "border-emerald-500",
    illustration: "/DREAMTRACKER.jpg",
    status: "coming-soon" as FeatureStatus
  },
  {
    title: "Auto-Fill",
    description: "Save time by automatically populating application forms with your stored profile data. Apply to multiple scholarships faster.",
    bgColor: "bg-orange-600",
    accentColor: "border-orange-500",
    illustration: "/BONBON_AI.jpg",
    status: "coming-soon" as FeatureStatus
  }
];

export const FEATURES_NEW = [
  {
    icon: "🤖",
    title: "Unlimited GlobalMatch AI Access",
    description: "Get unlimited AI-powered university matching and recommendations tailored to your profile.",
  },
  {
    icon: "📋",
    title: "Document Verification Dashboard",
    description: "Upload and verify all your important documents in one secure place.",
  },
  {
    icon: "⚡",
    title: "Bulk University Form Filler",
    description: "Fill out application forms for multiple universities at once. Save hours of work.",
  },
];

export const PLAN_FEATURES = [
  "Unlimited GlobalMatch AI",
  "Dashboard verifikasi dokumen",
  "Bulk form filler universitas",
  "Akses semua fitur baru",
];

export const PRICING_PLANS = [
  {
    name: "1 Bulan",
    price: "Rp 79.000",
    subtext: "per bulan · Rp 79.000/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    checkColor: "#4479B2",
  },
  {
    name: "3 Bulan",
    price: "Rp 199.000",
    subtext: "per 3 bulan · Rp 66.333/bulan",
    buttonText: "Mulai Sekarang",
    highlight: true,
    badge: "Populer",
    discount: "Hemat 16%",
    checkColor: "#FA8613",
  },
  {
    name: "1 Tahun",
    price: "Rp 699.000",
    subtext: "per tahun · Rp 58.250/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    badge: "Terbaik",
    discount: "Hemat 26%",
    checkColor: "#4479B2",
  },
];
