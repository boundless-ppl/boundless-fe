"use client";

import { Suspense } from "react";
import { trackEvent } from "@/lib/track-event";
import { PaymentFormSection } from "./PaymentFormSection";
import {
  type PlanSelectedPayload,
  type ReceiptSubmittedPayload,
} from "@/features/payment/types/payment-form.types";

export const PaymentFormContainer = () => {
  const handlePlanSelected = ({ planId, price }: PlanSelectedPayload) => {
    trackEvent("payment_plan_selected", {
      plan_id: planId,
      price,
    });
  };

  const handleReceiptSubmitted = async ({
    planId,
    amount,
    adminFee,
    total,
    fileName,
  }: ReceiptSubmittedPayload) => {
    trackEvent("payment_receipt_uploaded", {
      plan_id: planId,
      amount,
      admin_fee: adminFee,
      total,
      file_name: fileName,
    });
  };

  return (
    <Suspense fallback={<div />}>
      <PaymentFormSection
        onPlanSelected={handlePlanSelected}
        onReceiptSubmitted={handleReceiptSubmitted}
      />
    </Suspense>
  );
};
