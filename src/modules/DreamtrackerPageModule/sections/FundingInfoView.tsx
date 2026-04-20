"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, ExternalLink, Loader2, Plus } from "lucide-react";
import type { DreamFunding, DreamTrackerItem } from "@/lib/api-types";

type Props = {
  funding: DreamFunding;
  baseTracker: DreamTrackerItem;
  onBack: () => void;
  onAddFunding: (trackerId: string, funding: DreamFunding) => Promise<void>;
};

export const FundingInfoView = ({ funding, baseTracker, onBack, onAddFunding }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    try {
      setError(null);
      setIsAdding(true);
      await onAddFunding(baseTracker.dream_tracker_id, funding);
    } catch {
      setError("Gagal menambahkan beasiswa ke Dreamtracker. Coba lagi.");
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke {baseTracker.program.university_name}
      </button>

      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Beasiswa
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{funding.nama_beasiswa}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{funding.provider}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50">
            <BookOpen className="h-6 w-6 text-[#f58a1f]" />
          </div>
        </div>
      </div>

      {/* Detail info */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Detail Beasiswa
        </p>

        {funding.deskripsi ? (
          <p className="text-sm leading-6 text-slate-600">{funding.deskripsi}</p>
        ) : (
          <p className="text-sm leading-6 text-slate-400">
            Detail pendanaan belum tersedia penuh untuk beasiswa ini.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {funding.tipe_pembiayaan && (
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              {funding.tipe_pembiayaan}
            </span>
          )}
          {funding.website && (
            <a
              href={funding.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-orange-200 hover:text-orange-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Lihat website resmi
            </a>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Lacak beasiswa ini</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Tambahkan ke Dreamtracker untuk memantau dokumen dan deadline pendaftaran.
            </p>
          </div>
          <button
            type="button"
            disabled={isAdding}
            onClick={() => void handleAdd()}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#f58a1f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#dd7611] disabled:bg-[#f4b77c] transition-colors"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menambahkan...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Tambahkan ke Dreamtracker
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
        )}
      </div>

      {/* Related university */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Universitas Terkait
        </p>
        <button
          onClick={onBack}
          className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              {baseTracker.program.university_name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{baseTracker.program.program_name}</p>
          </div>
          <ArrowLeft className="h-4 w-4 rotate-180 text-gray-300 group-hover:text-[#f58a1f] transition-colors" />
        </button>
      </div>
    </div>
  );
};
