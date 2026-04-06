import { z } from "zod";
import { paymentPlanValues } from "../types/payment-form.types";

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
    }
  });

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;