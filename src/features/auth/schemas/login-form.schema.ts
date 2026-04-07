import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Silakan masukkan email yang valid."),
  password: z.string().min(8, { message: "Kata sandi harus minimal 8 karakter." }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
