import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Nama harus terdiri dari minimal 2 karakter."),
    email: z.email("Silakan masukkan email yang valid."),
    password: z
      .string()
      .min(8, "Kata sandi harus terdiri dari minimal 8 karakter.")
      .regex(/[A-Z]/, "Kata sandi harus mengandung huruf kapital.")
      .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil.")
      .regex(/\d/, "Kata sandi harus mengandung angka.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Kata sandi harus mengandung karakter khusus."),
    confirmPassword: z.string(),
    acceptedPrivacyPolicy: z.boolean().refine((value) => value, {
      message: "Anda harus menyetujui kebijakan privasi.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
