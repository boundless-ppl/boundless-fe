import { Clock3, MessageCircleMore } from "lucide-react";

type PaymentProcessingNoticeProps = {
  transactionId: string;
  submittedAt: string;
};

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PaymentProcessingNotice({
  transactionId,
  submittedAt,
}: Readonly<PaymentProcessingNoticeProps>) {
  return (
    <section className="rounded-2xl border border-[#f6d2ab] bg-[#fff8f1] p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Clock3 className="mt-0.5 h-5 w-5 text-[#f58a1f]" />
        <div>
          <h2 className="text-xl font-semibold text-[#1d1d1d]">
            Bukti pembayaran sudah kami terima
          </h2>
          <p className="mt-2 text-sm text-[#6f6f6f]">
            Pembayaran Anda sedang kami proses. Verifikasi dapat memakan waktu
            hingga 24 jam.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#f1d8c3] bg-white p-4 text-sm text-[#4d4d4d]">
        <p>
          <span className="font-semibold text-[#1f1f1f]">ID Transaksi:</span>{" "}
          {transactionId}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-[#1f1f1f]">Waktu Upload:</span>{" "}
          {formatSubmittedAt(submittedAt)}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-[#e4e4e7] bg-white px-4 py-3 text-sm text-[#4b5563]">
        <p className="inline-flex items-center gap-2 font-medium text-[#1f2937]">
          <MessageCircleMore className="h-4 w-4 text-[#f58a1f]" />
          Butuh bantuan?
        </p>
        <p className="mt-1">
          Hubungi support: <span className="font-semibold">+6287874144135</span>
        </p>
      </div>
    </section>
  );
}
