"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  paymentFormSchema,
  type PaymentFormSchema,
} from "@/features/payment/schemas/payment-form.schema";
import { validatePaymentProofFile } from "@/lib/file-validation";
import type {
  PaymentFormSectionProps,
  PaymentPlanId,
} from "@/features/payment/types/payment-form.types";
import { paymentPlanValues } from "@/features/payment/types/payment-form.types";
import { PAYMENT_PLANS } from "../constant";
import {
  BenefitsCard,
  PlanSelectorCard,
  QrisCard,
  SummaryCard,
  UploadCard,
} from "../components/PaymentFormCards";

const MAX_RECEIPT_SIZE = 350 * 1024;
const MOBILE_BREAKPOINT_QUERY = "(max-width: 1023px)";

const subscribeToMobileLayout = (onStoreChange: () => void) => {
  if (globalThis.window === undefined) {
    return () => {};
  }

  const mediaQuery = globalThis.window.matchMedia(MOBILE_BREAKPOINT_QUERY);
  const onChange = () => onStoreChange();
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
};

const getMobileLayoutSnapshot = () => {
  if (globalThis.window === undefined) {
    return false;
  }

  return globalThis.window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
};

const isPaymentPlanId = (value: string): value is PaymentPlanId =>
  paymentPlanValues.includes(value as PaymentPlanId);

export const PaymentFormSection = ({
  onPlanSelected,
  onReceiptSubmitted,
  isPackageLoading = false,
  packageLoadError = null,
  planPriceById = {},
}: PaymentFormSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedPlanParam = searchParams.get("plan");
  const hasAppliedInitialPlanFromQuery = useRef(false);
  const uploadSectionRef = useRef<HTMLElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const form = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      planId: "1year",
      receiptFile: null,
    },
  });

  const selectedPlanId = useWatch({ control: form.control, name: "planId" });
  const receiptFile = useWatch({ control: form.control, name: "receiptFile" });
  const selectedPlan = PAYMENT_PLANS.find((plan) => plan.id === selectedPlanId) ?? PAYMENT_PLANS[2];
  const selectedPlanPrice = planPriceById[selectedPlan.id] ?? selectedPlan.price;
  const total = selectedPlanPrice;

  const isMobileLayout = useSyncExternalStore(
    subscribeToMobileLayout,
    getMobileLayoutSnapshot,
    () => false
  );

  useEffect(() => {
    if (hasAppliedInitialPlanFromQuery.current) {
      return;
    }

    if (!requestedPlanParam || !isPaymentPlanId(requestedPlanParam)) {
      hasAppliedInitialPlanFromQuery.current = true;
      return;
    }

    form.setValue("planId", requestedPlanParam, { shouldDirty: false, shouldValidate: true });
    onPlanSelected?.({
      planId: requestedPlanParam,
      price:
        planPriceById[requestedPlanParam] ??
        PAYMENT_PLANS.find((plan) => plan.id === requestedPlanParam)?.price ??
        0,
    });
      hasAppliedInitialPlanFromQuery.current = true;
  }, [form, onPlanSelected, planPriceById, requestedPlanParam]);

  const onPlanSelect = (planId: PaymentPlanId) => {
    form.setValue("planId", planId, { shouldDirty: true, shouldValidate: true });

    const nextQuery = new URLSearchParams(searchParams.toString());
    nextQuery.set("plan", planId);
    const nextHref = `${pathname}?${nextQuery.toString()}`;
    router.replace(nextHref, { scroll: false });

    onPlanSelected?.({
      planId,
      price: planPriceById[planId] ?? PAYMENT_PLANS.find((plan) => plan.id === planId)?.price ?? 0,
    });
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setUploadedFileName(null);
      form.setValue("receiptFile", null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    const validation = validatePaymentProofFile(file, MAX_RECEIPT_SIZE);

    if (!validation.isValid) {
      form.setError("receiptFile", { message: validation.error });
      setUploadedFileName(null);
      form.setValue("receiptFile", null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    form.clearErrors("receiptFile");
    form.setValue("receiptFile", file, { shouldValidate: true, shouldDirty: true });
    setUploadedFileName(file.name);
  };

  const onSubmit = async (values: PaymentFormSchema) => {
    const receipt = values.receiptFile;
    if (!(receipt instanceof File)) {
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const result = await onReceiptSubmitted?.({
        planId: values.planId,
        amount: selectedPlanPrice,
        total,
        fileName: receipt.name,
        receiptFile: receipt,
      });

      if (!result) {
        setSubmitSuccess("Bukti pembayaran berhasil dikirim.");
        return;
      }

      if (result.error) {
        setSubmitError(result.error);
        return;
      }

      setSubmitSuccess(
        result.data?.transactionId
          ? `Bukti pembayaran berhasil dikirim. ID transaksi: ${result.data.transactionId}`
          : "Bukti pembayaran berhasil dikirim."
      );
    } catch {
      setSubmitError("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
    }
  };

  const scrollToUploadSection = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Form {...form}>
      {isPackageLoading && (
        <div className="mb-4 rounded-xl border border-[#eadfce] bg-[#fff8f1] px-4 py-3 text-sm text-[#8f8f8f]">
          Memuat paket langganan dari server...
        </div>
      )}

      {packageLoadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {packageLoadError}
        </div>
      )}

      {submitError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {submitSuccess}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={isMobileLayout ? "space-y-4 pb-24" : "grid gap-4 lg:grid-cols-2 lg:items-start"}
      >
        {isMobileLayout ? (
          <>
            <PlanSelectorCard
              control={form.control}
              selectedPlanId={selectedPlanId}
              onPlanSelect={onPlanSelect}
              planPriceById={planPriceById}
            />
            <BenefitsCard />
            <QrisCard total={total} />
            <UploadCard
              control={form.control}
              uploadedFileName={uploadedFileName}
              receiptFile={receiptFile}
              isSubmitting={form.formState.isSubmitting}
              disableSubmit={isPackageLoading}
              uploadInputId="payment-proof-upload-mobile"
              uploadSectionRef={uploadSectionRef}
              onFileSelect={handleFileSelect}
            />
            <SummaryCard price={selectedPlanPrice} total={total} />
          </>
        ) : (
          <>
            <div className="space-y-4">
              <PlanSelectorCard
                control={form.control}
                selectedPlanId={selectedPlanId}
                onPlanSelect={onPlanSelect}
                planPriceById={planPriceById}
              />
              <QrisCard total={total} />
              <UploadCard
                control={form.control}
                uploadedFileName={uploadedFileName}
                receiptFile={receiptFile}
                isSubmitting={form.formState.isSubmitting}
                disableSubmit={isPackageLoading}
                uploadInputId="payment-proof-upload-desktop"
                uploadSectionRef={uploadSectionRef}
                onFileSelect={handleFileSelect}
              />
            </div>

            <div className="space-y-4">
              <BenefitsCard />
              <SummaryCard price={selectedPlanPrice} total={total} />
            </div>
          </>
        )}
      </form>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d6d2] bg-[#f8f8f8]/95 px-4 py-3 backdrop-blur md:hidden">
        <Button
          type="button"
          onClick={scrollToUploadSection}
          className="h-11 w-full rounded-2xl bg-[#f58a1f] text-sm font-semibold text-white hover:bg-[#e57d15]"
        >
          Lanjutkan Pembayaran - {selectedPlan.label}
        </Button>
      </div>
    </Form>
  );
};
