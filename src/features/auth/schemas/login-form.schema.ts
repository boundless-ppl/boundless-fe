import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
