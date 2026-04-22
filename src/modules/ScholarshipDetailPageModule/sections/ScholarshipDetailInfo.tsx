import { CheckCircle2, Gift, ListChecks } from "lucide-react";
import type { Scholarship } from "@/lib/api-types";

type Props = {
  scholarship: Scholarship;
};

export const ScholarshipDetailInfo = ({ scholarship }: Props) => {
  return (
    <div className="space-y-4">
      {/* Deskripsi */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Deskripsi
        </p>
        <p className="text-sm leading-7 text-slate-600">{scholarship.deskripsi}</p>
      </div>

      {/* Persyaratan */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            <ListChecks className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Persyaratan
          </p>
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

      {/* Benefit */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
            <Gift className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Benefit
          </p>
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
  );
};
