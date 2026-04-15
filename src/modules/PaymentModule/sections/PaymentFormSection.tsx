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
  CreatePaymentData,
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
  onCreatePayment,
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
  const [createdPayment, setCreatedPayment] = useState<CreatePaymentData | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const form = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      planId: "6month",
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

    setCreatedPayment(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setUploadedFileName(null);
    form.setValue("receiptFile", null, { shouldValidate: false, shouldDirty: false });
    form.clearErrors("receiptFile");
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

  const handleCreatePayment = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    setIsCreatingPayment(true);

    try {
      const result = await onCreatePayment?.({
        planId: selectedPlan.id,
        amount: selectedPlanPrice,
        total,
      });

      if (!result) {
        setCreatedPayment(null);
        setSubmitError("Gagal membuat pembayaran. Silakan coba lagi.");
        return;
      }

      if (result.error || !result.data) {
        setCreatedPayment(null);
        setSubmitError(result.error ?? "Gagal membuat pembayaran. Silakan coba lagi.");
        return;
      }

      setCreatedPayment(result.data);
      setSubmitSuccess("Pembayaran berhasil dibuat. Silakan transfer ke rekening BCA lalu upload bukti transfer.");
      uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setCreatedPayment(null);
      setSubmitError("Terjadi kesalahan saat membuat pembayaran. Silakan coba lagi.");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const onSubmit = async (values: PaymentFormSchema) => {
    if (!createdPayment?.paymentId || !createdPayment.transactionId) {
      setSubmitError("Buat pembayaran terlebih dahulu sebelum upload bukti transfer.");
      return;
    }

    const receipt = values.receiptFile;
    if (!(receipt instanceof File)) {
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const result = await onReceiptSubmitted?.({
        paymentId: createdPayment.paymentId,
        transactionId: createdPayment.transactionId,
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
        className={isMobileLayout ? "space-y-4" : "grid gap-4 lg:grid-cols-2 lg:items-start"}
      >
        {isMobileLayout ? (
          <>
            {!createdPayment ? (
              <>
                <PlanSelectorCard
                  control={form.control}
                  selectedPlanId={selectedPlanId}
                  onPlanSelect={onPlanSelect}
                  planPriceById={planPriceById}
                />
                <BenefitsCard />
                <SummaryCard price={selectedPlanPrice} total={total} />
                <section className="rounded-2xl border border-[#d8d6d2] bg-[#f8f8f8] p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-[#1d1d1d]">Langkah Selanjutnya</h3>
                  <p className="mt-2 text-sm text-[#8f8f8f]">
                    Setelah memilih paket, klik tombol di bawah untuk membuat pembayaran.
                  </p>
                  <Button
                    type="button"
                    onClick={handleCreatePayment}
                    disabled={isCreatingPayment || isPackageLoading || form.formState.isSubmitting}
                    className="mt-4 h-11 w-full rounded-xl bg-[#f58a1f] text-sm font-semibold text-white hover:bg-[#e57d15]"
                  >
                    {isCreatingPayment ? "Membuat Pembayaran..." : `Buat Pembayaran - ${selectedPlan.label}`}
                  </Button>
                </section>
              </>
            ) : null}
            {createdPayment ? (
              <>
                <SummaryCard price={selectedPlanPrice} total={total} />
                <QrisCard total={total} />
                <UploadCard
                  control={form.control}
                  uploadedFileName={uploadedFileName}
                  receiptFile={receiptFile}
                  isSubmitting={form.formState.isSubmitting}
                  disableSubmit={isPackageLoading || isCreatingPayment}
                  uploadInputId="payment-proof-upload-mobile"
                  uploadSectionRef={uploadSectionRef}
                  onFileSelect={handleFileSelect}
                />
              </>
            ) : null}
          </>
        ) : (
          <>
            <div className="space-y-4">
              {!createdPayment ? (
                <>
                  <PlanSelectorCard
                    control={form.control}
                    selectedPlanId={selectedPlanId}
                    onPlanSelect={onPlanSelect}
                    planPriceById={planPriceById}
                  />
                  <BenefitsCard />
                </>
              ) : null}
              {createdPayment ? (
                <>
                  <QrisCard total={total} />
                  <UploadCard
                    control={form.control}
                    uploadedFileName={uploadedFileName}
                    receiptFile={receiptFile}
                    isSubmitting={form.formState.isSubmitting}
                    disableSubmit={isPackageLoading || isCreatingPayment}
                    uploadInputId="payment-proof-upload-desktop"
                    uploadSectionRef={uploadSectionRef}
                    onFileSelect={handleFileSelect}
                  />
                </>
              ) : null}
            </div>

            <div className="space-y-4">
              <SummaryCard price={selectedPlanPrice} total={total} />
              {!createdPayment ? (
                <section className="rounded-2xl border border-[#d8d6d2] bg-[#f8f8f8] p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-[#1d1d1d]">Langkah Selanjutnya</h3>
                  <p className="mt-2 text-sm text-[#8f8f8f]">
                    Setelah memilih paket, klik tombol di bawah untuk membuat pembayaran.
                  </p>
                  <Button
                    type="button"
                    onClick={handleCreatePayment}
                    disabled={isCreatingPayment || isPackageLoading || form.formState.isSubmitting}
                    className="mt-4 h-11 w-full rounded-xl bg-[#f58a1f] text-sm font-semibold text-white hover:bg-[#e57d15]"
                  >
                    {isCreatingPayment ? "Membuat Pembayaran..." : `Buat Pembayaran - ${selectedPlan.label}`}
                  </Button>
                </section>
              ) : null}
            </div>
          </>
        )}
      </form>
    </Form>
  );
};
