import type { RefObject } from "react";
import type { Control } from "react-hook-form";

import type { ApiResult, PaymentStatus } from "./payment-api.types";
import type { PaymentFormSchema } from "../schemas/payment-form.schema";

export const paymentPlanValues = ["1month", "3month", "6month"] as const;
export type PaymentPlanId = (typeof paymentPlanValues)[number];

export type PlanSelectedPayload = {
  planId: PaymentPlanId;
  price: number;
};

export type CreatePaymentPayload = {
  planId: PaymentPlanId;
  amount: number;
  total: number;
};

export type CreatePaymentData = {
  paymentId: string;
  transactionId: string;
  status: PaymentStatus;
};

export type CreatePaymentResult = ApiResult<CreatePaymentData>;

export type ReceiptSubmittedPayload = {
  paymentId: string;
  transactionId: string;
  planId: PaymentPlanId;
  amount: number;
  total: number;
  fileName: string;
  receiptFile: File;
};

export type PaymentSubmissionData = {
  paymentId: string;
  transactionId: string;
  status: PaymentStatus;
  proofDocumentId: string;
};

export type PaymentSubmissionResult = ApiResult<PaymentSubmissionData>;

export type PaymentFormSectionProps = {
  onPlanSelected?: (payload: PlanSelectedPayload) => void;
  onCreatePayment?: (
    payload: CreatePaymentPayload
  ) => Promise<CreatePaymentResult> | CreatePaymentResult;
  onReceiptSubmitted?: (
    payload: ReceiptSubmittedPayload
  ) => Promise<PaymentSubmissionResult> | PaymentSubmissionResult;
  isPackageLoading?: boolean;
  packageLoadError?: string | null;
  planPriceById?: Partial<Record<PaymentPlanId, number>>;
};

export type PlanSelectorCardProps = {
  control: Control<PaymentFormSchema>;
  selectedPlanId: PaymentPlanId;
  onPlanSelect: (planId: PaymentPlanId) => void;
  planPriceById?: Partial<Record<PaymentPlanId, number>>;
};

export type QrisCardProps = {
  total: number;
};

export type UploadCardProps = {
  control: Control<PaymentFormSchema>;
  uploadedFileName: string | null;
  receiptFile: File | null;
  isSubmitting: boolean;
  disableSubmit?: boolean;
  uploadInputId: string;
  uploadSectionRef: RefObject<HTMLElement | null>;
  onFileSelect: (file: File | null) => void;
};

export type SummaryCardProps = {
  price: number;
  total: number;
};