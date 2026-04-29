import type { PaymentPlanId } from "@/features/payment/types/payment-form.types";

export const PAYMENT_BENEFITS = [
  "GlobalMatch AI tanpa batas",
  "Dashboard verifikasi dokumen",
  "Pengisian formulir universitas massal",
  "Akses semua fitur baru",
];

export const PAYMENT_INSTRUCTIONS = [
  "Buka aplikasi mobile banking Anda",
  "Pilih menu transfer ke Bank BCA",
  "Masukkan nomor rekening 6610978370 (a/n Grace Karina)",
  "Pastikan jumlah sesuai",
  "Selesaikan pembayaran",
  "Screenshot/foto bukti transfer",
  "Upload bukti transfer di form",
  "Tunggu verifikasi admin (maks 24 jam)",
];

export const PAYMENT_PLAN_DURATION_MONTHS: Record<PaymentPlanId, number> = {
  "1month": 1,
  "3month": 3,
  "6month": 6,
};

export const PAYMENT_PLAN_LABELS: Record<PaymentPlanId, string> = {
  "1month": "1 Bulan",
  "3month": "3 Bulan",
  "6month": "6 Bulan",
};

export const PAYMENT_PLAN_BADGES: Partial<Record<PaymentPlanId, string>> = {
  "3month": "Populer",
  "6month": "Terbaik",
};