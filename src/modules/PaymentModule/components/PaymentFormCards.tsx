import { cva } from "class-variance-authority";
import { Check, Circle, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  type PlanSelectorCardProps,
  type QrisCardProps,
  type SummaryCardProps,
  type UploadCardProps,
  paymentPlanValues,
} from "@/features/payment/types/payment-form.types";
import { getSavingsLabel } from "@/features/payment/utils/savings";
import {
  PAYMENT_BENEFITS,
  PAYMENT_INSTRUCTIONS,
  PAYMENT_PLAN_BADGES,
  PAYMENT_PLAN_DURATION_MONTHS,
  PAYMENT_PLAN_LABELS,
} from "../constant";

const planCardVariants = cva(
  "relative block w-full cursor-pointer rounded-xl border bg-gray-50 px-4 py-3 text-left transition-colors",
  {
    variants: {
      selected: {
        true: "border-[#f58a1f]",
        false: "border-[#dfe1e5]",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export const formatIdr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const PlanSelectorCard = ({
  control,
  selectedPlanId,
  onPlanSelect,
  planPriceById,
}: PlanSelectorCardProps) => {
  const baseMonthlyPrice = planPriceById?.["1month"] ?? 0;

  return (
    <section className="rounded-2xl border border-[#d8d6d2] bg-white p-4 shadow-sm">
      <fieldset>
        <legend className="text-base font-semibold text-[#1d1d1d]">Pilih Paket</legend>
        <FormField
          control={control}
          name="planId"
          render={({ field }) => (
            <div className="mt-4 space-y-3" role="radiogroup" aria-label="Pilih Paket">
              {paymentPlanValues.map((planId) => {
                const isSelected = selectedPlanId === planId;
                const planPrice = planPriceById?.[planId] ?? 0;
                const savingsLabel = getSavingsLabel(
                  planPrice,
                  PAYMENT_PLAN_DURATION_MONTHS[planId],
                  baseMonthlyPrice
                );
                const inputId = `plan-${planId}`;
                const badge = PAYMENT_PLAN_BADGES[planId];
                const label = PAYMENT_PLAN_LABELS[planId];

                return (
                  <label
                    key={planId}
                    htmlFor={inputId}
                    className={planCardVariants({ selected: isSelected })}
                    aria-pressed={isSelected}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={field.name}
                      value={planId}
                      checked={isSelected}
                      onChange={() => {
                        field.onChange(planId);
                        onPlanSelect(planId);
                      }}
                      className="sr-only"
                    />

                    {badge ? (
                      <span className="absolute -top-2 left-3 rounded-full bg-[#f58a1f] px-2 py-0.5 text-[10px] font-medium text-white">
                        {badge}
                      </span>
                    ) : null}

                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <Check className="h-4 w-4 rounded-full border border-[#f58a1f] p-px text-[#f58a1f]" />
                      ) : (
                        <Circle className="h-4 w-4 text-[#c7c9cf]" />
                      )}
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#f58a1f]">{label}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-[30px] leading-none font-bold text-[#1f1f1f]">
                            {formatIdr(planPrice)}
                          </p>
                          {savingsLabel ? (
                            <span className="text-xs text-[#f58a1f]">{savingsLabel}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        />
      </fieldset>
    </section>
  );
};

export const BenefitsCard = () => {
  return (
    <section className="rounded-2xl border border-[#d8d6d2] bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-[#1d1d1d]">Apa yang Anda Dapatkan</h2>
      <ul className="mt-3 space-y-2">
        {PAYMENT_BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-[#353535]">
            <Check className="mt-0.5 h-4 w-4 rounded-full bg-[#fff2e3] p-0.5 text-[#f58a1f]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const QrisCard = ({ total }: QrisCardProps) => {
  return (
    <section className="rounded-2xl border border-[#d8d6d2] bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-[#1d1d1d]">Transfer Bank BCA</h3>
      <p className="mt-2 text-sm text-[#8f8f8f]">
        Lakukan transfer ke rekening berikut, lalu upload bukti pembayaran.
      </p>

      <div className="mt-4 rounded-xl border border-[#f1d8c3] bg-white p-4">
        <div className="rounded-lg border border-[#fbe3cc] bg-[#fff8f1] px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-[#9a9a9a]">Bank</p>
          <p className="text-base font-semibold text-[#1f1f1f]">BCA</p>

          <p className="mt-3 text-xs uppercase tracking-wide text-[#9a9a9a]">Atas Nama</p>
          <p className="text-base font-semibold text-[#1f1f1f]">Grace Karina</p>

          <p className="mt-3 text-xs uppercase tracking-wide text-[#9a9a9a]">Nomor Rekening</p>
          <p className="text-xl font-bold tracking-wide text-[#1f1f1f]">6610978370</p>
        </div>

        <p className="mt-4 text-sm text-[#9a9a9a]">Total Pembayaran:</p>
        <p className="text-3xl font-semibold text-[#1f1f1f]">{formatIdr(total)}</p>
      </div>
    </section>
  );
};

export const UploadCard = ({
  control,
  uploadedFileName,
  receiptFile,
  isSubmitting,
  disableSubmit,
  uploadInputId,
  uploadSectionRef,
  onFileSelect,
}: UploadCardProps) => {
  return (
    <section ref={uploadSectionRef} className="rounded-2xl border border-[#d8d6d2] bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-[#1d1d1d]">Upload Bukti Transfer</h3>
      <p className="mt-2 text-sm text-[#8f8f8f]">Upload bukti pembayaran (IMG/PDF, maks 350KB)</p>

      <FormField
        control={control}
        name="receiptFile"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel htmlFor={uploadInputId} className="sr-only">
              Upload bukti transfer
            </FormLabel>
            <FormControl>
              <>
                <input
                  id={uploadInputId}
                  type="file"
                  accept="application/pdf,image/png,image/jpg,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    onFileSelect(file);
                    field.onChange(file);
                  }}
                />
                <label
                  htmlFor={uploadInputId}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-[#d3d4d8] bg-white px-4 py-10 text-center"
                >
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#f58a1f]">
                    <Upload className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#1f1f1f]">Klik untuk upload bukti transfer</p>
                  <p className="mt-1 text-xs text-[#a1a1a8]">Pastikan nominal sesuai dengan total yang tertera.</p>
                  {uploadedFileName ? (
                    <p className="mt-3 text-xs font-medium text-[#f58a1f]">{uploadedFileName}</p>
                  ) : null}
                </label>
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        disabled={!receiptFile || isSubmitting || disableSubmit}
        className={cn(
          "mt-4 h-11 w-full rounded-xl font-medium",
          !receiptFile || isSubmitting || disableSubmit
            ? "bg-[#d6d8dd] text-[#8d919a] hover:bg-[#d6d8dd]"
            : "bg-[#f58a1f] text-white hover:bg-[#e57d15]"
        )}
      >
        Kirim Bukti Pembayaran
      </Button>
    </section>
  );
};

export const SummaryCard = ({ price, total }: SummaryCardProps) => {
  return (
    <section className="rounded-2xl border border-[#d8d6d2] bg-white p-4 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#1d1d1d]">Ringkasan</h2>
      <div className="mt-3 space-y-2 text-sm text-[#5f5f5f]">
        <div className="flex items-center justify-between">
          <span>Harga Langganan</span>
          <span>{formatIdr(price)}</span>
        </div>
      </div>

      <Separator className="my-4 bg-[#d9d9dd]" />

      <div className="flex items-center justify-between text-3xl font-semibold text-[#1c1c1c]">
        <span>Total</span>
        <span>{formatIdr(total)}</span>
      </div>

      <div className="mt-4 rounded-xl border border-[#f1d8c3] bg-[#fff8f1] p-3">
        <h3 className="text-sm font-semibold text-[#1f1f1f]">Instruksi Pembayaran:</h3>
        <ol className="mt-2 space-y-1 text-xs leading-5 text-[#f58a1f]">
          {PAYMENT_INSTRUCTIONS.map((instruction, index) => (
            <li key={instruction}> {index + 1}. {instruction}</li>
          ))}
        </ol>
      </div>
    </section>
  );
};