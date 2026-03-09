"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, ShieldCheck, Star, Users } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RegisterFormValues } from "@/modules/RegisterPageModule/interface";

const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include a special character"),
    confirmPassword: z.string(),
    acceptedPrivacyPolicy: z.boolean().refine((value) => value, {
      message: "You must accept the privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema> & RegisterFormValues;

export const RegisterPageModule = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedPrivacyPolicy: false,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setAuthError(null);

    try {
      await register({
        nama_lengkap: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/login");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setAuthError(err.message || "Registration failed");
      } else {
        setAuthError("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 max-md:flex-none max-md:w-1/8 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-4 h-full gap-4 p-3 md:p-8">
            <div className="bg-orange-300/30 rounded-2xl flex items-center justify-center">
              <Users className="w-4 h-4 md:w-8 md:h-8 text-white/80" />
            </div>
            <div className="bg-orange-600/40 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 md:w-8 md:h-8 bg-cyan-300 rounded-full"></div>
            </div>
            <div className="bg-orange-300/30 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-300 rounded"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-300 rounded"></div>
              </div>
            </div>
            <div className="bg-orange-700/40 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
              <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-white/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="bg-orange-400/50 rounded-lg flex items-center justify-center">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-1 bg-cyan-300 rounded ${i === 2 ? "h-4 md:h-8" : "h-2 md:h-4"}`}></div>
                ))}
              </div>
            </div>
            <div className="bg-orange-600/60 rounded-2xl flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white/80" />
              </div>
            </div>
            <div className="bg-orange-300/40 rounded-lg flex items-center justify-center">
              <div className="w-12 h-2 bg-linear-to-r from-cyan-300 to-yellow-300 rounded-full"></div>
            </div>
            <div className="bg-orange-500/50 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                ))}
              </div>
            </div>

            <div className="bg-orange-400/40 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-300 to-red-400 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div className="bg-orange-700/50 rounded-lg flex items-center justify-center">
              <div className="flex flex-col space-y-1">
                <div className="w-4 md:w-8 h-1 bg-cyan-300 rounded"></div>
                <div className="w-2 md:w-6 h-1 bg-cyan-400 rounded"></div>
                <div className="w-5 md:w-10 h-1 bg-cyan-200 rounded"></div>
              </div>
            </div>
            <div className="bg-orange-300/50 rounded-2xl flex items-center justify-center">
              <Star className="w-4 md:w-8 h-4 md:h-8 text-yellow-300" fill="currentColor" />
            </div>
            <div className="bg-orange-600/40 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 md:w-8 md:h-8 bg-white/20 rounded rotate-45"></div>
            </div>

            <div className="bg-orange-500/60 rounded-lg flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1 md:w-2 h-3 md:h-6 bg-cyan-300 rounded"></div>
                <div className="w-1 md:w-2 h-2 md:h-4 bg-cyan-400 rounded"></div>
                <div className="w-1 md:w-2 h-4 md:h-8 bg-cyan-300 rounded"></div>
                <div className="w-1 md:w-2 h-1.5 md:h-3 bg-cyan-500 rounded"></div>
              </div>
            </div>
            <div className="bg-orange-400/30 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 md:w-10 md:h-10 border-4 border-dashed border-white/40 rounded-full"></div>
            </div>
            <div className="bg-orange-700/40 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 md:w-8 md:h-8 bg-linear-to-br from-cyan-300 to-cyan-500 rounded-full relative">
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="bg-orange-300/60 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-1">
                <div className="h-2 w-2 md:w-3 md:h-3 bg-white/40 rounded-full"></div>
                <div className="h-2 w-2 md:w-3 md:h-3 bg-yellow-300/80 rounded-full"></div>
                <div className="h-2 w-2 md:w-3 md:h-3 bg-yellow-300/80 rounded-full"></div>
                <div className="h-2 w-2 md:w-3 md:h-3 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-16 left-20 w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
        <div className="absolute bottom-24 right-16 w-6 h-6 bg-cyan-300/80 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-8 w-10 h-10 bg-yellow-300/60 rounded rotate-12"></div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Daftar ke Boundless</h1>
              <p className="max-md:text-sm text-gray-600">Bergabung hari ini untuk meraih masa depan Anda.</p>
            </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-xs text-gray-700 font-medium">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Jane Doe"
                        className="max-md:text-xs h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-xs text-gray-700 font-medium">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="max-md:text-xs h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-xs text-gray-700 font-medium">
                      Kata Sandi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi"
                          className="max-md:text-xs h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-md:text-xs text-gray-700 font-medium">
                      Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Konfirmasi kata sandi"
                          className="max-md:text-xs h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptedPrivacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 rounded-lg">
                      <input
                        id="acceptedPrivacyPolicy"
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="space-y-1">
                        <label htmlFor="acceptedPrivacyPolicy" className="max-md:text-xs text-sm text-gray-700">
                          Saya telah membaca dan setuju dengan{" "}
                            <Link href="/legal" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-600 hover:underline">
                            Kebijakan Privasi
                            </Link>
                          .
                        </label>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{authError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 md:h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating Account..." : "Register"}
              </Button>

              <div className="text-center max-md:text-xs text-sm">
                <span className="text-gray-600">Sudah memiliki akun? </span>
                <button
                  type="button"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </button>
                <span className="text-gray-600"> di sini </span>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
