"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import {
  createPayment,
  getSubscriptionPackages,
  uploadPaymentProof,
} from "@/features/payment/services/payment.service";
import { PaymentFormSection } from "./PaymentFormSection";
import {
  type PlanSelectedPayload,
  type PaymentPlanId,
  type PaymentSubmissionResult,
  type ReceiptSubmittedPayload,
} from "@/features/payment/types/payment-form.types";
import type { SubscriptionPackage } from "@/features/payment/types/payment-api.types";

const PLAN_DURATION_MONTHS: Record<PaymentPlanId, number> = {
  "1month": 1,
  "3month": 3,
  "1year": 12,
};

function resolvePackageByPlanId(
  planId: PaymentPlanId,
  packages: SubscriptionPackage[]
): SubscriptionPackage | null {
  const targetDuration = PLAN_DURATION_MONTHS[planId];
  const exact = packages.find((pkg) => pkg.duration_months === targetDuration);
  if (exact) {
    return exact;
  }

  if (planId === "1year") {
    return (
      packages.find((pkg) => pkg.duration_months >= 12) ??
      [...packages].sort((a, b) => b.duration_months - a.duration_months)[0] ??
      null
    );
  }

  return null;
}

export const PaymentFormContainer = () => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isPackageLoading, setIsPackageLoading] = useState(true);
  const [packageLoadError, setPackageLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPackages = async () => {
      setIsPackageLoading(true);
      const result = await getSubscriptionPackages();

      if (!isActive) {
        return;
      }

      if (result.error || !result.data) {
        setPackageLoadError(result.error ?? "Gagal memuat paket langganan.");
        setPackages([]);
        setIsPackageLoading(false);
        return;
      }

      setPackages(result.data.packages);
      setPackageLoadError(null);
      setIsPackageLoading(false);
    };

    void loadPackages();

    return () => {
      isActive = false;
    };
  }, []);

  const packageByPlan = useMemo(() => {
    return {
      "1month": resolvePackageByPlanId("1month", packages),
      "3month": resolvePackageByPlanId("3month", packages),
      "1year": resolvePackageByPlanId("1year", packages),
    } satisfies Record<PaymentPlanId, SubscriptionPackage | null>;
  }, [packages]);

  const handlePlanSelected = ({ planId, price }: PlanSelectedPayload) => {
    const selectedPackage = packageByPlan[planId];

    trackEvent("payment_plan_selected", {
      plan_id: planId,
      price,
      subscription_id: selectedPackage?.subscription_id,
      package_key: selectedPackage?.package_key,
    });
  };

  const handleReceiptSubmitted = async ({
    planId,
    amount,
    total,
    fileName,
    receiptFile,
  }: ReceiptSubmittedPayload): Promise<PaymentSubmissionResult> => {
    if (isPackageLoading) {
      return {
        data: null,
        error: "Paket langganan sedang dimuat. Coba lagi sebentar.",
      };
    }

    if (packageLoadError) {
      return {
        data: null,
        error: packageLoadError,
      };
    }

    const selectedPackage = packageByPlan[planId];
    if (!selectedPackage) {
      return {
        data: null,
        error: "Paket tidak ditemukan. Silakan pilih paket lain.",
      };
    }

    const paymentResult = await createPayment({
      subscription_id: selectedPackage.subscription_id,
    });

    if (paymentResult.error || !paymentResult.data) {
      return {
        data: null,
        error: paymentResult.error ?? "Gagal membuat pembayaran.",
      };
    }

    const proofResult = await uploadPaymentProof(paymentResult.data.payment_id, receiptFile);
    if (proofResult.error || !proofResult.data) {
      return {
        data: null,
        error: proofResult.error ?? "Gagal upload bukti pembayaran.",
      };
    }

    trackEvent("payment_receipt_uploaded", {
      plan_id: planId,
      amount,
      total,
      file_name: fileName,
      payment_id: paymentResult.data.payment_id,
      transaction_id: paymentResult.data.transaction_id,
      proof_document_id: proofResult.data.document_id,
      subscription_id: selectedPackage.subscription_id,
      package_key: selectedPackage.package_key,
    });

    return {
      data: {
        paymentId: paymentResult.data.payment_id,
        transactionId: paymentResult.data.transaction_id,
        status: paymentResult.data.status,
        proofDocumentId: proofResult.data.document_id,
      },
      error: null,
    };
  };

  return (
    <Suspense fallback={<div />}>
      <PaymentFormSection
        onPlanSelected={handlePlanSelected}
        onReceiptSubmitted={handleReceiptSubmitted}
        isPackageLoading={isPackageLoading}
        packageLoadError={packageLoadError}
      />
    </Suspense>
  );
};
