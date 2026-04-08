"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import {
  createPayment,
  getPaymentDetail,
  getSubscriptionPackages,
  uploadPaymentProof,
} from "@/features/payment/services/payment.service";
import {
  mapPlanPricesFromPackages,
  resolvePackageByPlanId,
} from "@/features/payment/utils/package-mapper";
import {
  clearPendingPayment,
  readPendingPayment,
  savePendingPayment,
  type PendingPaymentRecord,
} from "@/features/payment/utils/pending-payment";
import { useAuth } from "@/lib/auth-context";
import { useUserData } from "@/hooks/useUserData";
import { PaymentFormSection } from "./PaymentFormSection";
import { PaymentProcessingNotice } from "../components/PaymentProcessingNotice";
import { PremiumActiveNotice } from "../components/PremiumActiveNotice";
import {
  type PlanSelectedPayload,
  type PaymentPlanId,
  type PaymentSubmissionResult,
  type ReceiptSubmittedPayload,
} from "@/features/payment/types/payment-form.types";
import type { SubscriptionPackage } from "@/features/payment/types/payment-api.types";

export const PaymentFormContainer = () => {
  const { refreshUser } = useAuth();
  const { isPremium, premiumStartAt, premiumEndAt } = useUserData();
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isPackageLoading, setIsPackageLoading] = useState(true);
  const [packageLoadError, setPackageLoadError] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPaymentRecord | null>(null);
  const [isCheckingPending, setIsCheckingPending] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkPendingPayment = async () => {
      const record = readPendingPayment();
      if (!record) {
        if (isActive) {
          setPendingPayment(null);
          setIsCheckingPending(false);
        }
        return;
      }

      const result = await getPaymentDetail(record.paymentId);
      if (!isActive) {
        return;
      }

      if (result.data?.status === "pending") {
        setPendingPayment(record);
        setIsCheckingPending(false);
        return;
      }

      if (result.data?.status === "success" || result.data?.status === "failed") {
        clearPendingPayment();
        setPendingPayment(null);
        if (result.data.status === "success") {
          await refreshUser();
        }
        setIsCheckingPending(false);
        return;
      }

      // Keep pending state when status cannot be checked (network, auth, or transient errors).
      setPendingPayment(record);
      setIsCheckingPending(false);
    };

    void checkPendingPayment();

    const intervalId = globalThis.setInterval(() => {
      void checkPendingPayment();
    }, 30_000);

    const handleFocus = () => {
      void checkPendingPayment();
    };

    globalThis.window.addEventListener("focus", handleFocus);

    return () => {
      isActive = false;
      globalThis.clearInterval(intervalId);
      globalThis.window.removeEventListener("focus", handleFocus);
    };
  }, [refreshUser]);

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

  const handleReceiptSubmittedWithPendingState: typeof handleReceiptSubmitted =
    async (payload) => {
      const result = await handleReceiptSubmitted(payload);
      if (result.data?.paymentId && result.data?.transactionId) {
        const record: PendingPaymentRecord = {
          paymentId: result.data.paymentId,
          transactionId: result.data.transactionId,
          submittedAt: new Date().toISOString(),
        };
        savePendingPayment(record);
        setPendingPayment(record);
      }

      return result;
    };

  if (isCheckingPending) {
    return (
      <div className="rounded-2xl border border-[#eadfce] bg-[#fff8f1] px-4 py-3 text-sm text-[#8f8f8f]">
        Mengecek status pembayaran Anda...
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

  if (pendingPayment) {
    return (
      <PaymentProcessingNotice
        transactionId={pendingPayment.transactionId}
        submittedAt={pendingPayment.submittedAt}
      />
    );
  }

  return (
    <Suspense fallback={<div />}>
      <PaymentFormSection
        onPlanSelected={handlePlanSelected}
        onReceiptSubmitted={handleReceiptSubmittedWithPendingState}
        isPackageLoading={isPackageLoading}
        packageLoadError={packageLoadError}
        planPriceById={planPriceById}
      />
    </Suspense>
  );
};
