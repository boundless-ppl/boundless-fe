import { Crown, MessageCircleMore } from "lucide-react";

type PremiumActiveNoticeProps = {
  premiumStartAt: string | null;
  premiumEndAt: string | null;
};

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

export function PremiumActiveNotice({
  premiumStartAt,
  premiumEndAt,
}: PremiumActiveNoticeProps) {
  return (
    <section className="rounded-2xl border border-[#b8d0ef] bg-[#edf4ff] p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Crown className="mt-0.5 h-5 w-5 text-[#4479B2]" />
        <div>
          <h2 className="text-xl font-semibold text-[#1d1d1d]">
            Premium Anda aktif
          </h2>
          <p className="mt-2 text-sm text-[#5f6f84]">
            Akun Anda sudah premium. Semua fitur berbayar, termasuk Dreamtracker,
            siap digunakan.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#d7e4f6] bg-white p-4 text-sm text-[#44546a]">
        <p>
          <span className="font-semibold text-[#1f2937]">Premium mulai:</span>{" "}
          {formatDateTime(premiumStartAt)}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-[#1f2937]">Premium berakhir:</span>{" "}
          {formatDateTime(premiumEndAt)}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-[#e4e4e7] bg-white px-4 py-3 text-sm text-[#4b5563]">
        <p className="inline-flex items-center gap-2 font-medium text-[#1f2937]">
          <MessageCircleMore className="h-4 w-4 text-[#4479B2]" />
          Butuh bantuan?
        </p>
        <p className="mt-1">
          Hubungi support: <span className="font-semibold">+6287874144135</span>
        </p>
      </div>
    </section>
  );
}
