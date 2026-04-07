import type { PaymentPlanId } from "@/features/payment/types/payment-form.types";

export const PAYMENT_PLANS = [
  {
    id: "1month",
    label: "1 Bulan",
    badge: null,
    price: 79000,
    savingsLabel: null,
  },
  {
    id: "3month",
    label: "3 Bulan",
    badge: "Populer",
    price: 199000,
    savingsLabel: "Hemat 16%",
  },
  {
    id: "1year",
    label: "1 Tahun",
    badge: "Terbaik",
    price: 699000,
    savingsLabel: "Hemat 26%",
  },
] as const satisfies ReadonlyArray<{
  id: PaymentPlanId;
  label: string;
  badge: string | null;
  price: number;
  savingsLabel: string | null;
}>;

export const PAYMENT_BENEFITS = [
  "GlobalMatch AI tanpa batas",
  "Dashboard verifikasi dokumen",
  "Pengisian formulir universitas massal",
  "Akses semua fitur baru",
];

export const PAYMENT_INSTRUCTIONS = [
  "Buka aplikasi mobile banking Anda",
  "Pilih menu QRIS atau Bayar dengan QR",
  "Scan kode QR di samping",
  "Pastikan jumlah sesuai",
  "Selesaikan pembayaran",
  "Screenshot/foto bukti transfer",
  "Upload bukti transfer di form",
  "Tunggu verifikasi admin (maks 24 jam)",
];