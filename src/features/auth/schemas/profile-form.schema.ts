import { z } from "zod";

export const editProfileSchema = z.object({
  nama_lengkap: z.string().min(2, "Name must be at least 2 characters."),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/\d/, "Password must include a number.")
      .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Password must include a special character."),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
