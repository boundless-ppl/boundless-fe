import { GraduationCap, Sparkles, Target, Zap } from "lucide-react";
import type { PaymentPlanId } from "@/features/payment/types/payment-form.types";

export type FeatureStatus = 'in-development' | 'coming-soon' | 'live';

export const FEATURE_FLAGS = {
  SHOW_PRICING: true,
};

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
    status: "live" as FeatureStatus
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
    title: "Akses GlobalMatch AI Tanpa Batas",
    description: "Dapatkan rekomendasi universitas yang dipersonalisasi berdasarkan profilmu, tanpa batasan penggunaan.",
    status: "live" as FeatureStatus,
    featureKey: "globalmatch-ai"
  },
  {
    title: "Dashboard Verifikasi Dokumen",
    description: "Unggah dan verifikasi semua dokumen pentingmu di satu tempat yang aman.",
    status: "live" as FeatureStatus,
    featureKey: "dreamtracker"
  },
  {
    title: "Pengisian Formulir Universitas Massal",
    description: "Isi formulir aplikasi ke banyak universitas sekaligus. Hemat waktu berjam-jam.",
    status: "coming-soon" as FeatureStatus,
    featureKey: "auto-fill"
  },
];

export const PLAN_FEATURES = [
  "GlobalMatch AI tanpa batas",
  "Dashboard verifikasi dokumen",
  "Pengisian formulir universitas massal",
  "Akses semua fitur baru",
];

export const PRICING_PLANS = [
  {
    paymentPlanId: "1month" as PaymentPlanId,
    durationMonths: 1,
    name: "1 Bulan",
    priceAmount: 79000,
    price: "Rp 79.000",
    subtext: "per bulan · Rp 79.000/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    checkColor: "#4479B2",
  },
  {
    paymentPlanId: "3month" as PaymentPlanId,
    durationMonths: 3,
    name: "3 Bulan",
    priceAmount: 199000,
    price: "Rp 199.000",
    subtext: "per 3 bulan · Rp 66.333/bulan",
    buttonText: "Mulai Sekarang",
    highlight: true,
    badge: "Populer",
    discount: "Hemat 16%",
    checkColor: "#FA8613",
  },
  {
    paymentPlanId: "1year" as PaymentPlanId,
    durationMonths: 12,
    name: "1 Tahun",
    priceAmount: 699000,
    price: "Rp 699.000",
    subtext: "per tahun · Rp 58.250/bulan",
    buttonText: "Pilih Paket",
    highlight: false,
    badge: "Terbaik",
    discount: "Hemat 26%",
    checkColor: "#4479B2",
  },
];
