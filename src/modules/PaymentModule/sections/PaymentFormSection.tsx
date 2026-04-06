"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  paymentFormSchema,
  type PaymentFormSchema,
} from "@/features/payment/schemas/payment-form.schema";
import { validateImageFile } from "@/lib/file-validation";
import type {
  PaymentFormSectionProps,
  PaymentPlanId,
} from "@/features/payment/types/payment-form.types";
import { PAYMENT_ADMIN_FEE, PAYMENT_PLANS } from "../constant";
import {
  BenefitsCard,
  PlanSelectorCard,
  QrisCard,
  SummaryCard,
  UploadCard,
} from "../components/PaymentFormCards";

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;
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

export const PaymentFormSection = ({
  onPlanSelected,
  onReceiptSubmitted,
}: PaymentFormSectionProps) => {
  const uploadSectionRef = useRef<HTMLElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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
  const total = selectedPlan.price + PAYMENT_ADMIN_FEE;

  const isMobileLayout = useSyncExternalStore(
    subscribeToMobileLayout,
    getMobileLayoutSnapshot,
    () => false
  );

  const onPlanSelect = (planId: PaymentPlanId) => {
    form.setValue("planId", planId, { shouldDirty: true, shouldValidate: true });
    onPlanSelected?.({
      planId,
      price: PAYMENT_PLANS.find((plan) => plan.id === planId)?.price ?? 0,
    });
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setUploadedFileName(null);
      form.setValue("receiptFile", null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    const validation = validateImageFile(file, MAX_RECEIPT_SIZE);

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

    await onReceiptSubmitted?.({
      planId: values.planId,
      amount: selectedPlan.price,
      adminFee: PAYMENT_ADMIN_FEE,
      total,
      fileName: receipt.name,
    });
  };

  const scrollToUploadSection = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Form {...form}>
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
            />
            <BenefitsCard />
            <QrisCard total={total} />
            <UploadCard
              control={form.control}
              uploadedFileName={uploadedFileName}
              receiptFile={receiptFile}
              isSubmitting={form.formState.isSubmitting}
              uploadInputId="payment-proof-upload-mobile"
              uploadSectionRef={uploadSectionRef}
              onFileSelect={handleFileSelect}
            />
            <SummaryCard price={selectedPlan.price} total={total} />
          </>
        ) : (
          <>
            <div className="space-y-4">
              <PlanSelectorCard
                control={form.control}
                selectedPlanId={selectedPlanId}
                onPlanSelect={onPlanSelect}
              />
              <QrisCard total={total} />
              <UploadCard
                control={form.control}
                uploadedFileName={uploadedFileName}
                receiptFile={receiptFile}
                isSubmitting={form.formState.isSubmitting}
                uploadInputId="payment-proof-upload-desktop"
                uploadSectionRef={uploadSectionRef}
                onFileSelect={handleFileSelect}
              />
            </div>

            <div className="space-y-4">
              <BenefitsCard />
              <SummaryCard price={selectedPlan.price} total={total} />
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
