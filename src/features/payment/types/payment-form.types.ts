import type { RefObject } from "react";
import type { Control } from "react-hook-form";

import type { PaymentFormSchema } from "../schemas/payment-form.schema";

export const paymentPlanValues = ["1month", "3month", "1year"] as const;
export type PaymentPlanId = (typeof paymentPlanValues)[number];

export type PlanSelectedPayload = {
  planId: PaymentPlanId;
  price: number;
};

export type ReceiptSubmittedPayload = {
  planId: PaymentPlanId;
  amount: number;
  adminFee: number;
  total: number;
  fileName: string;
};

export type PaymentFormSectionProps = {
  onPlanSelected?: (payload: PlanSelectedPayload) => void;
  onReceiptSubmitted?: (payload: ReceiptSubmittedPayload) => Promise<void> | void;
};

export type PlanSelectorCardProps = {
  control: Control<PaymentFormSchema>;
  selectedPlanId: PaymentPlanId;
  onPlanSelect: (planId: PaymentPlanId) => void;
};

export type QrisCardProps = {
  total: number;
};

export type UploadCardProps = {
  control: Control<PaymentFormSchema>;
  uploadedFileName: string | null;
  receiptFile: File | null;
  isSubmitting: boolean;
  uploadInputId: string;
  uploadSectionRef: RefObject<HTMLElement | null>;
  onFileSelect: (file: File | null) => void;
};

export type SummaryCardProps = {
  price: number;
  total: number;
};