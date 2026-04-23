export type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

export type PaymentStatus = "pending" | "success" | "failed";

export type SubscriptionPackage = {
  subscription_id: string;
  package_key: string;
  name: string;
  description: string;
  duration_months: number;
  price_amount: number;
  normal_amount: number;
  benefits: string[];
};

export type ListSubscriptionPackagesResponse = {
  packages: SubscriptionPackage[];
};

export type CreatePaymentRequest = {
  subscription_id: string;
};

export type PaymentSummary = {
  payment_id: string;
  transaction_id: string;
  status: PaymentStatus;
  package_name: string;
  duration_months: number;
  total_amount: number;
  benefits: string[];
  qris_image_url: string;
  created_at: string;
  expired_at: string;
};

export type UploadPaymentProofResponse = {
  document_id: string;
  original_filename: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  document_type: string;
  uploaded_at: string;
};

export type PaymentDetailResponse = PaymentSummary & {
  proof_document_id?: string;
  paid_at?: string;
  premium_active_at?: string;
  premium_expired_at?: string;
};