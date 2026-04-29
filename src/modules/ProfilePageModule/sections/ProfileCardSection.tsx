"use client";

import Image from "next/image";
import { Clock3, Eye, EyeOff, Mail, MessageCircleMore, Pencil, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/lib/auth-context";
import { updateProfileRequest, changePasswordRequest } from "@/features/auth/services/auth.service";
import {
  editProfileSchema,
  changePasswordSchema,
  type EditProfileSchema,
  type ChangePasswordSchema,
} from "@/features/auth/schemas/profile-form.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";

function getAvatarInitials(fullName: string, email: string) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? "";
  const fallback = email.split("@")[0] ?? "";
  const source = firstName || fallback || "BD";

  return source.slice(0, 2).toUpperCase();
}

function toTitleCasePerWord(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(" ");
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export const ProfileCardSection = () => {
  const { isAuthenticated, fullName, email, role, isPremium, premiumStartAt, premiumEndAt, hasPendingPayment, transactionId } = useUserData();
  const { tokens, refreshUser } = useAuth();

  // Modal state
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);

  // Edit name form
  const [editNameError, setEditNameError] = useState<string | null>(null);
  const editNameForm = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { nama_lengkap: fullName },
  });

  // Change password form
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const changePassForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  // Sync edit name form when fullName loads
  useEffect(() => {
    if (fullName) {
      editNameForm.reset({ nama_lengkap: fullName });
    }
  }, [fullName, editNameForm]);

  const handleEditNameOpenChange = (nextOpen: boolean) => {
    setEditNameOpen(nextOpen);

    if (!nextOpen) {
      setEditNameError(null);
    }
  };

  const handleChangePassOpenChange = (nextOpen: boolean) => {
    setChangePassOpen(nextOpen);

    if (!nextOpen) {
      setChangePassError(null);
      changePassForm.reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  };

  const onSubmitEditName = async (data: EditProfileSchema) => {
    setEditNameError(null);
    if (!tokens?.accessToken) return;
    try {
      await updateProfileRequest(tokens.accessToken, data.nama_lengkap);
      await refreshUser();
      setEditNameOpen(false);
    } catch (err: unknown) {
      setEditNameError(err instanceof Error ? err.message : "Gagal memperbarui nama.");
    }
  };

  const onSubmitChangePass = async (data: ChangePasswordSchema) => {
    setChangePassError(null);
    if (!tokens?.accessToken) return;
    try {
      await changePasswordRequest(tokens.accessToken, data.currentPassword, data.newPassword);
      setChangePassOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengganti password.";
      setChangePassError(message === "wrong current password" ? "Password saat ini tidak sesuai." : message);
    }
  };

  
  const displayName = fullName || "Pengguna Boundless";
  const displayNameTitleCase = toTitleCasePerWord(displayName);
  const avatarInitials = getAvatarInitials(fullName, email);

  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16">
      <Image
        src="/dunia.png"
        alt="World map"
        width={900}
        height={450}
        className="pointer-events-none absolute bottom-10 left-0 w-full opacity-[0.36]"
      />

      <div className="relative mx-auto flex w-full max-w-5xl justify-center">
        <div className="w-full rounded-[28px] border border-[#eadfce] bg-white/96 p-6 shadow-[0_18px_40px_rgba(31,31,31,0.06)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-[#f58a1f] to-[#dd7611] text-3xl font-bold text-white shadow-lg">
              {avatarInitials}
            </div>

            <div>
              <p className="text-sm font-medium text-[#6b7280]">Profile Pengguna</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1f2937] md:text-[1.8rem]">
                {displayNameTitleCase}
              </h1>
              {isPremium && (
                <p className="mt-2 inline-flex rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#4479B2]">
                  Premium Aktif
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Berikut adalah data akun Anda yang tersimpan di sistem Boundless.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-2 md:gap-4 md:grid-cols-2">
            {/* Nama Lengkap — dengan pencil icon */}
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Nama Lengkap</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-base font-semibold text-[#1f2937]">{displayNameTitleCase}</p>
                <button
                  type="button"
                  onClick={() => setEditNameOpen(true)}
                  className="shrink-0 rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#f58a1f]/10 hover:text-[#f58a1f]"
                  aria-label="Edit nama lengkap"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Email</p>
              <p className="mt-2 flex items-center gap-2 text-base font-semibold text-[#1f2937]">
                <Mail className="h-4 w-4 text-[#f58a1f]" />
                {email || "-"}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Role</p>
              <p className="mt-2 flex items-center gap-2 text-base font-semibold capitalize text-[#1f2937]">
                <ShieldCheck className="h-4 w-4 text-[#f58a1f]" />
                {role}
              </p>
            </div>

            {/* Ganti Password — serupa dengan card Nama Lengkap */}
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Password</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-base font-semibold tracking-widest text-[#1f2937]">••••••••</p>
                <button
                  type="button"
                  onClick={() => setChangePassOpen(true)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#f58a1f] transition-colors hover:bg-[#f58a1f]/10"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Status Langganan */}
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Status Langganan</p>
              <p className="mt-2 text-base font-semibold text-[#1f2937]">
                {isPremium ? "Premium Aktif" : "Belum Premium"}
              </p>
              {isPremium && (
                <p className="mt-1 text-sm text-[#6b7280]">
                  Aktif: {formatDateTime(premiumStartAt)} - Berakhir: {formatDateTime(premiumEndAt)}
                </p>
              )}
            </div>
          </div>

          {hasPendingPayment && isAuthenticated && (
            <div className="mt-6 rounded-2xl border border-[#f6d2ab] bg-[#fff8f1] px-4 py-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2937]">
                <Clock3 className="h-4 w-4 text-[#f58a1f]" />
                Pembayaran Anda sedang kami proses
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Bukti pembayaran sudah diterima. Verifikasi membutuhkan waktu hingga 24 jam.
              </p>
              <p className="mt-2 text-sm text-[#4b5563]">
                ID transaksi: <span className="font-semibold text-[#1f2937]">{transactionId}</span>
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#4b5563]">
                <MessageCircleMore className="h-4 w-4 text-[#f58a1f]" />
                Support: <span className="font-semibold text-[#1f2937]">+6287874144135</span>
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Anda belum login. Silakan login untuk melihat data profile Anda.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Edit Nama Lengkap */}
      <Dialog open={editNameOpen} onOpenChange={handleEditNameOpenChange}>
        <DialogContent className="rounded-[20px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1f2937]">Edit Nama Lengkap</DialogTitle>
          </DialogHeader>
          <Form {...editNameForm}>
            <form onSubmit={editNameForm.handleSubmit(onSubmitEditName)} className="space-y-4 pt-2">
              <FormField
                control={editNameForm.control}
                name="nama_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#374151]">Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {editNameError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editNameError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setEditNameOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={editNameForm.formState.isSubmitting}
                  className="rounded-2xl bg-[#f58a1f] text-white hover:bg-[#dd7611]"
                >
                  {editNameForm.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ganti Password */}
      <Dialog open={changePassOpen} onOpenChange={handleChangePassOpenChange}>
        <DialogContent className="rounded-[20px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1f2937]">Ganti Password</DialogTitle>
          </DialogHeader>
          <Form {...changePassForm}>
            <form onSubmit={changePassForm.handleSubmit(onSubmitChangePass)} className="space-y-4 pt-2">
              <FormField
                control={changePassForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#374151]">Password Saat Ini</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          placeholder="Masukkan password saat ini"
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition-colors hover:text-[#1f2937]"
                          onClick={() => setShowCurrent((v) => !v)}
                        >
                          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={changePassForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#374151]">Password Baru</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Buat password baru"
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition-colors hover:text-[#1f2937]"
                          onClick={() => setShowNew((v) => !v)}
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={changePassForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#374151]">Konfirmasi Password Baru</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Ulangi password baru"
                          className="h-11 rounded-2xl border-[#d7dbe2] bg-[#fcfcfd] px-4 pr-12 text-[15px] focus-visible:border-[#f58a1f] focus-visible:ring-[#f58a1f]/15"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition-colors hover:text-[#1f2937]"
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-3 text-sm text-[#4b5563]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f2937]" />
                  <p className="leading-5">
                    Min. 8 karakter, huruf besar, huruf kecil, angka, dan karakter spesial.
                  </p>
                </div>
              </div>

              {changePassError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {changePassError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setChangePassOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={changePassForm.formState.isSubmitting}
                  className="rounded-2xl bg-[#f58a1f] text-white hover:bg-[#dd7611]"
                >
                  {changePassForm.formState.isSubmitting ? "Mengubah..." : "Ganti Password"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
