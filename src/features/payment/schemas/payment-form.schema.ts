import { z } from "zod";
import { validatePaymentProofFile } from "@/lib/file-validation";
import { paymentPlanValues } from "../types/payment-form.types";

const MAX_PAYMENT_PROOF_SIZE = 350 * 1024;

export const paymentFormSchema = z
  .object({
    planId: z.enum(paymentPlanValues),
    receiptFile: z.custom<File | null>((value) => value === null || value instanceof File),
  })
  .superRefine((values, ctx) => {
    if (!(values.receiptFile instanceof File)) {
      ctx.addIssue({
        code: "custom",
        path: ["receiptFile"],
        message: "Upload bukti transfer terlebih dahulu.",
      });
      return;
    }

    const validation = validatePaymentProofFile(
      values.receiptFile,
      MAX_PAYMENT_PROOF_SIZE
    );

    if (!validation.isValid) {
      ctx.addIssue({
        code: "custom",
        path: ["receiptFile"],
        message: validation.error ?? "Format atau ukuran file tidak valid.",
      });
    }
  });

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;