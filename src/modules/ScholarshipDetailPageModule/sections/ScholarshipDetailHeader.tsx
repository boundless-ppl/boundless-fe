import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, ExternalLink } from "lucide-react";
import type { Scholarship } from "@/lib/api-types";

type Props = {
  scholarship: Scholarship;
};

function getDeadlineBadge(deadline: string): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = deadlineDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (daysLeft <= 14) {
    return {
      label: `${formatted} · ${daysLeft} hari lagi`,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    };
  }
  if (daysLeft <= 60) {
    return {
      label: `${formatted} · ${daysLeft} hari lagi`,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    };
  }
  return {
    label: formatted,
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  };
}

export const ScholarshipDetailHeader = ({ scholarship }: Props) => {
  const deadlineBadge = getDeadlineBadge(scholarship.deadline);

  return (
    <div className="space-y-4">
      <Link
        href="/scholarshiphub"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Scholarship Hub
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {scholarship.tipe_pembiayaan && (
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
                  {scholarship.tipe_pembiayaan}
                </span>
              )}
              {scholarship.negara && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                  {scholarship.negara}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{scholarship.nama}</h1>
            <p className="mt-1 text-sm font-medium text-gray-500">{scholarship.provider}</p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
            <BookOpen className="h-7 w-7 text-[#f58a1f]" />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-50 pt-5">
          <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${deadlineBadge.bg} ${deadlineBadge.text} ${deadlineBadge.border}`}>
            <Calendar className="h-4 w-4" />
            <span>Deadline: {deadlineBadge.label}</span>
          </div>

          <a
            href={scholarship.link_pendaftaran}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f58a1f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#dd7611]"
          >
            <ExternalLink className="h-4 w-4" />
            Daftar Sekarang
          </a>
        </div>
      </div>
    </div>
  );
};
