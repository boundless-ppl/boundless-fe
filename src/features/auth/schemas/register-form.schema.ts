import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.email("Please enter a valid email."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/\d/, "Password must include a number.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include a special character."),
    confirmPassword: z.string(),
    acceptedPrivacyPolicy: z.boolean().refine((value) => value, {
      message: "You must accept the privacy policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
