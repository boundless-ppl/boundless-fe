import Link from "next/link";
import { Calendar, ExternalLink, Globe, MapPin } from "lucide-react";
import type { Scholarship } from "@/lib/api-types";

type Props = {
  scholarship: Scholarship;
};

function getDeadlineStatus(deadline: string): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 14) {
    return {
      label: `${daysLeft} hari lagi`,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    };
  }
  if (daysLeft <= 60) {
    return {
      label: `${daysLeft} hari lagi`,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    };
  }
  return {
    label: deadlineDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  };
}

function normalizeExternalUrl(value?: string): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export const ScholarshipCard = ({ scholarship }: Props) => {
  const deadlineStatus = getDeadlineStatus(scholarship.deadline);
  const externalUrl = normalizeExternalUrl(scholarship.link_pendaftaran);

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-[0_8px_24px_rgba(245,138,31,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {scholarship.tipe_pembiayaan && (
            <span className="mb-2 inline-block rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange-700">
              {scholarship.tipe_pembiayaan}
            </span>
          )}
          <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-[#f58a1f] transition-colors line-clamp-2">
            {scholarship.nama}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-gray-400">{scholarship.provider}</p>
        </div>

        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka website pendaftaran"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 transition-colors hover:bg-orange-100"
          >
            <ExternalLink className="h-5 w-5 text-[#f58a1f]" />
          </a>
        ) : (
          <span
            aria-label="Link pendaftaran belum tersedia"
            className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-gray-100"
            title="Link pendaftaran belum tersedia"
          >
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-500 line-clamp-3 flex-1">{scholarship.deskripsi}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {scholarship.negara && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
            <Globe className="h-3 w-3" />
            {scholarship.negara}
          </span>
        )}
        {scholarship.universitas && scholarship.universitas.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {scholarship.universitas.length} universitas
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-50 pt-4">
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${deadlineStatus.bg} ${deadlineStatus.text} ${deadlineStatus.border}`}>
          <Calendar className="h-3 w-3" />
          {deadlineStatus.label}
        </div>
        <Link
          href={`/scholarship/${scholarship.id}`}
          className="shrink-0 rounded-xl bg-[#f58a1f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#dd7611]"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};
