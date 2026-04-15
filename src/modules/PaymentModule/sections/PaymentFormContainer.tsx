"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import {
  createPayment,
  getSubscriptionPackages,
  uploadPaymentProof,
} from "@/features/payment/services/payment.service";
import {
  mapPlanPricesFromPackages,
  resolvePackageByPlanId,
} from "@/features/payment/utils/package-mapper";
import { useUserData } from "@/hooks/useUserData";
import { PaymentFormSection } from "./PaymentFormSection";
import { PaymentProcessingNotice } from "../components/PaymentProcessingNotice";
import { PremiumActiveNotice } from "../components/PremiumActiveNotice";
import {
  type CreatePaymentPayload,
  type CreatePaymentResult,
  type PlanSelectedPayload,
  type PaymentPlanId,
  type PaymentSubmissionResult,
  type ReceiptSubmittedPayload,
} from "@/features/payment/types/payment-form.types";
import type { SubscriptionPackage } from "@/features/payment/types/payment-api.types";

export const PaymentFormContainer = () => {
  const { isPremium, premiumStartAt, premiumEndAt, hasPendingPayment, transactionId } = useUserData();
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
      "6month": resolvePackageByPlanId("6month", packages),
    } satisfies Record<PaymentPlanId, SubscriptionPackage | null>;
  }, [packages]);

  const planPriceById = useMemo(
    () => mapPlanPricesFromPackages(packages),
    [packages]
  );

  const handlePlanSelected = ({ planId, price }: PlanSelectedPayload) => {
    const selectedPackage = packageByPlan[planId];

    trackEvent("payment_plan_selected", {
      plan_id: planId,
      price,
      subscription_id: selectedPackage?.subscription_id,
      package_key: selectedPackage?.package_key,
    });
  };

  const handleCreatePayment = async ({
    planId,
    amount,
    total,
  }: CreatePaymentPayload): Promise<CreatePaymentResult> => {
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

    trackEvent("payment_created", {
      plan_id: planId,
      amount,
      total,
      payment_id: paymentResult.data.payment_id,
      transaction_id: paymentResult.data.transaction_id,
      subscription_id: selectedPackage.subscription_id,
      package_key: selectedPackage.package_key,
    });

    return {
      data: {
        paymentId: paymentResult.data.payment_id,
        transactionId: paymentResult.data.transaction_id,
        status: paymentResult.data.status,
      },
      error: null,
    };
  };

  const handleReceiptSubmitted = async ({
    paymentId,
    transactionId,
    planId,
    amount,
    total,
    fileName,
    receiptFile,
  }: ReceiptSubmittedPayload): Promise<PaymentSubmissionResult> => {
    const selectedPackage = packageByPlan[planId];
    if (!selectedPackage) {
      return {
        data: null,
        error: "Paket tidak ditemukan. Silakan pilih paket lain.",
      };
    }

    const proofResult = await uploadPaymentProof(paymentId, receiptFile);
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
      payment_id: paymentId,
      transaction_id: transactionId,
      proof_document_id: proofResult.data.document_id,
      subscription_id: selectedPackage.subscription_id,
      package_key: selectedPackage.package_key,
    });

    return {
      data: {
        paymentId,
        transactionId,
        status: "pending",
        proofDocumentId: proofResult.data.document_id,
      },
      error: null,
    };
  };

  const handleReceiptSubmittedWithPendingState: typeof handleReceiptSubmitted =
    async (payload) => {
      const result = await handleReceiptSubmitted(payload);
      if (result.data?.paymentId && result.data?.transactionId) {
        // const record: PendingPaymentRecord = {
        //   paymentId: result.data.paymentId,
        //   transactionId: result.data.transactionId,
        //   submittedAt: new Date().toISOString(),
        // };
        // savePendingPayment(record);
        // setPendingPayment(record);
      }

      return result;
    };

  if (isPackageLoading) {
    return (
      <div className="rounded-2xl border border-[#eadfce] bg-[#fff8f1] px-4 py-3 text-sm text-[#8f8f8f] text-center">
        Menyiapkan data pembayaran...
      </div>
    );
  }

  if (isPremium) {
    return (
      <PremiumActiveNotice
        premiumStartAt={premiumStartAt}
        premiumEndAt={premiumEndAt}
      />
    );
  }

  if (hasPendingPayment) {
    return (
      <PaymentProcessingNotice
        transactionId={transactionId ?? "-"}
      />
    );
  }

  return (
    <Suspense fallback={<div />}>
      <PaymentFormSection
        onPlanSelected={handlePlanSelected}
        onCreatePayment={handleCreatePayment}
        onReceiptSubmitted={handleReceiptSubmittedWithPendingState}
        isPackageLoading={isPackageLoading}
        packageLoadError={packageLoadError}
        planPriceById={planPriceById}
      />
    </Suspense>
  );
};
