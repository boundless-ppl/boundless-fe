"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerFormSchema, type RegisterFormSchema } from "@/features/auth/schemas/register-form.schema";

export const RegisterFormSection = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedPrivacyPolicy: false,
    },
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    setAuthError(null);

    try {
      await register({
        nama_lengkap: data.name,
        email: data.email,
        role: "user",
        password: data.password,
      });

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message || "Registration failed.");
      } else {
        setAuthError("Registration failed.");
      }
    }
  };

  return (
    <div className="bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16 min-h-[90vh] flex items-center justify-center">
      <Image
        src="/dunia.png"
        alt="World map"
        width={900}
        height={450}
        className="pointer-events-none absolute bottom-10 w-full opacity-[0.36]"
      />
      
      <div className="relative flex w-full justify-center">
        <div className="w-full max-w-4xl rounded-2xl md:rounded-[28px] border border-[#eadfce] bg-white/96 p-5 shadow-[0_18px_40px_rgba(31,31,31,0.06)] backdrop-blur sm:p-6">
          <div className="mb-5 text-center">
            <Image
              src="/boundless.png"
              alt="Boundless"
              width={220}
              height={64}
              className="mx-auto h-auto w-32 sm:w-36"
            />
            <h1 className="mt-4 text-2xl md:text-[1.8rem] font-bold tracking-tight text-[#1f2937] sm:text-[2rem]">
              Buat Akun Anda
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-[#6b7280]">
              Mulai dengan proses pendaftaran yang sederhana.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="grid gap-3.5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#374151]">Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
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
                      <FormLabel className="text-sm font-medium text-[#374151]">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
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
                      <FormLabel className="text-sm font-medium text-[#374151]">Kata Sandi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan kata sandi Anda"
                            className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition-colors hover:text-[#1f2937]"
                            onClick={() => setShowPassword((value) => !value)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
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
                      <FormLabel className="text-sm font-medium text-[#374151]">Konfirmasi Kata Sandi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Konfirmasi kata sandi Anda"
                            className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition-colors hover:text-[#1f2937]"
                            onClick={() => setShowConfirmPassword((value) => !value)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-3">
                  <FormField
                    control={form.control}
                    name="acceptedPrivacyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <label className="flex items-start gap-3 text-sm leading-6 text-[#4b5563]">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(event) => field.onChange(event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-[#d1d5db] text-[#111827] focus:ring-[#111827]"
                          />
                          <span>
                            Saya menyetujui kebijakan privasi dan ketentuan penggunaan Boundless.{" "}
                            <Link href="/legal" className="font-medium text-[#1f2937] underline underline-offset-2">
                              Baca selengkapnya
                            </Link>
                          </span>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-3 text-sm text-[#4b5563]">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f2937]" />
                    <div>
                      <p className="font-medium text-[#1f2937]">Persyaratan Kata Sandi</p>
                      <p className="mt-1 leading-6">
                        Minimal 8 karakter, terdiri dari huruf besar, huruf kecil, angka, dan karakter khusus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {authError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full rounded-2xl bg-[#f58a1f] text-sm font-semibold text-white hover:bg-[#dd7611]"
              >
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {form.formState.isSubmitting ? "Membuat akun..." : "Buat Akun"}
                </span>
              </Button>

              <p className="text-center text-sm text-[#6b7280]">
                Sudah memiliki akun?{" "}
                <Link href="/login" className="font-semibold text-[#f58a1f] hover:text-[#dd7611]">
                  Masuk
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
