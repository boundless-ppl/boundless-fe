"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

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
import { loginFormSchema, type LoginFormSchema } from "@/features/auth/schemas/login-form.schema";

export const LoginFormSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const nextPathParam = searchParams.get("next");
  const safeNextPath = nextPathParam?.startsWith("/") ? nextPathParam : null;

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    setAuthError(null);

    try {
      await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      setIsNavigating(true);
      router.push(safeNextPath ?? "/dashboard");
    } catch (err: unknown) {
      setIsNavigating(false);
      if (err instanceof Error) {
        setAuthError(err.message ?? "Login failed.");
      } else {
        setAuthError("Login failed.");
      }
    }
  };

  return (
    <div className="overflow-hidden bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16 min-h-[90vh] flex items-center justify-center">
      <Image
        src="/dunia.png"
        alt="World map"
        width={900}
        height={450}
        className="pointer-events-none absolute bottom-10 w-full opacity-[0.36]"
      />

      <div className="relative flex w-full justify-center">
        <div className="relative w-full max-w-md rounded-[28px] border border-[#eadfce] bg-white/96 p-6 shadow-[0_18px_40px_rgba(31,31,31,0.06)] backdrop-blur sm:p-8">
          {(form.formState.isSubmitting || isNavigating) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[28px] bg-white/85 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-[#f58a1f]" />
              <p className="mt-3 text-sm font-medium text-[#9a4e0c]">
                Sedang masuk ke akun Anda...
              </p>
            </div>
          )}
          <div className="mb-7 text-center">
            <Image
              src="/boundless.png"
              alt="Boundless"
              width={220}
              height={64}
              className="mx-auto h-auto w-36 sm:w-40"
            />
            <h1 className="mt-6 text-2xl md:text-[1.8rem] font-bold tracking-tight text-[#1f2937]">
              Selamat Datang Kembali
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              Masuk untuk melanjutkan proses pendaftaran Anda.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#374151]">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        disabled={form.formState.isSubmitting || isNavigating}
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
                          disabled={form.formState.isSubmitting || isNavigating}
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                          {...field}
                        />
                        <button
                          type="button"
                          disabled={form.formState.isSubmitting || isNavigating}
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

              {authError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isNavigating}
                className="h-11 w-full rounded-2xl bg-[#f58a1f] text-sm font-semibold text-white hover:bg-[#dd7611]"
              >
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {form.formState.isSubmitting || isNavigating ? "Memproses..." : "Masuk"}
                </span>
              </Button>

              <p className="text-center text-sm text-[#6b7280]">
                Belum memiliki akun?{" "}
                <Link
                  href={safeNextPath ? `/register?next=${encodeURIComponent(safeNextPath)}` : "/register"}
                  className="font-semibold text-[#f58a1f] hover:text-[#dd7611]"
                >
                  Buat akun
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
