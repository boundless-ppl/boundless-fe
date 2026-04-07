"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock3, Mail, MessageCircleMore, ShieldCheck } from "lucide-react";

import { getPaymentDetail } from "@/features/payment/services/payment.service";
import {
  clearPendingPayment,
  readPendingPayment,
  type PendingPaymentRecord,
} from "@/features/payment/utils/pending-payment";
import { useUserData } from "@/hooks/useUserData";

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

export const ProfileCardSection = () => {
  const { isAuthenticated, fullName, email, role } = useUserData();
  const [pendingPayment, setPendingPayment] = useState<PendingPaymentRecord | null>(null);

  useEffect(() => {
    let isActive = true;

    const checkPendingPayment = async () => {
      const record = readPendingPayment();
      if (!record) {
        if (isActive) {
          setPendingPayment(null);
        }
        return;
      }

      const result = await getPaymentDetail(record.paymentId);
      if (!isActive) {
        return;
      }

      if (result.data?.status === "pending") {
        setPendingPayment(record);
        return;
      }

      if (result.data?.status === "success" || result.data?.status === "failed") {
        clearPendingPayment();
        setPendingPayment(null);
        return;
      }

      setPendingPayment(record);
    };

    if (isAuthenticated) {
      void checkPendingPayment();
    }

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

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
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Berikut adalah data akun Anda yang tersimpan di sistem Boundless.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-2 md:gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Nama Lengkap</p>
              <p className="mt-2 text-base font-semibold text-[#1f2937]">{displayNameTitleCase}</p>
            </div>

            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Email</p>
              <p className="mt-2 flex items-center gap-2 text-base font-semibold text-[#1f2937]">
                <Mail className="h-4 w-4 text-[#f58a1f]" />
                {email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe6dc] bg-[#fcfaf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Role</p>
              <p className="mt-2 flex items-center gap-2 text-base font-semibold capitalize text-[#1f2937]">
                <ShieldCheck className="h-4 w-4 text-[#f58a1f]" />
                {role}
              </p>
            </div>

          </div>

          {pendingPayment && isAuthenticated && (
            <div className="mt-6 rounded-2xl border border-[#f6d2ab] bg-[#fff8f1] px-4 py-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2937]">
                <Clock3 className="h-4 w-4 text-[#f58a1f]" />
                Pembayaran Anda sedang kami proses
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Bukti pembayaran sudah diterima. Verifikasi membutuhkan waktu hingga 24 jam.
              </p>
              <p className="mt-2 text-sm text-[#4b5563]">
                ID transaksi: <span className="font-semibold text-[#1f2937]">{pendingPayment.transactionId}</span>
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
    </div>
  );
};
