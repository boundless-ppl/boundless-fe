import Link from "next/link";
import { CheckCircle2, Gift, ListChecks, Lock } from "lucide-react";
import type { Scholarship } from "@/lib/api-types";

type Props = {
  scholarship: Scholarship;
  isLocked?: boolean;
};

function BlurOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/35">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/95 px-4 py-2 text-xs font-semibold text-[#a1460f] shadow-sm transition-colors hover:bg-orange-50"
      >
        <Lock className="h-3.5 w-3.5" />
        Login untuk buka detail
      </Link>
    </div>
  );
}

export const ScholarshipDetailInfo = ({ scholarship, isLocked = false }: Props) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Deskripsi</p>
        <p className="text-sm leading-7 text-slate-600">{scholarship.deskripsi}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {isLocked && <BlurOverlay />}
        <div className={isLocked ? "pointer-events-none select-none blur-[6px]" : ""}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <ListChecks className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Persyaratan</p>
          </div>
          <ul className="space-y-2.5">
            {scholarship.persyaratan.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-500">
                  {i + 1}
                </span>
                <span className="text-sm leading-6 text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {isLocked && <BlurOverlay />}
        <div className={isLocked ? "pointer-events-none select-none blur-[6px]" : ""}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
              <Gift className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Benefit</p>
          </div>
          <ul className="space-y-2.5">
            {scholarship.benefit.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span className="text-sm leading-6 text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
