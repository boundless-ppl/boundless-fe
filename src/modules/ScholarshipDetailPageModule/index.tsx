"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ScholarshipDetailHeader } from "./sections/ScholarshipDetailHeader";
import { ScholarshipDetailInfo } from "./sections/ScholarshipDetailInfo";
import { UniversityListSection } from "./sections/UniversityListSection";
import { getScholarshipById } from "@/features/scholarshiphub/services/scholarship.service";
import type { Scholarship } from "@/lib/api-types";

type Props = {
  scholarshipId: string;
};

export const ScholarshipDetailPageModule = ({ scholarshipId }: Props) => {
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      try {
        const data = await getScholarshipById(scholarshipId);
        setScholarship(data);
      } catch {
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchDetail();
  }, [scholarshipId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf8f4]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-4">
          {/* skeleton back link */}
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          {/* skeleton header */}
          <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-3 w-20 rounded bg-gray-100" />
                <div className="h-6 w-2/3 rounded bg-gray-100" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gray-100" />
            </div>
            <div className="mt-5 flex justify-between border-t border-gray-50 pt-5">
              <div className="h-10 w-48 rounded-xl bg-gray-100" />
              <div className="h-10 w-36 rounded-xl bg-gray-100" />
            </div>
          </div>
          {/* skeleton content */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-4 h-3 w-24 rounded bg-gray-100" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-5/6 rounded bg-gray-100" />
                <div className="h-3 w-4/6 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-[#f58a1f]" />
        </div>
      </main>
    );
  }

  if (isNotFound || !scholarship) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f4]">
        <div className="mx-auto max-w-md rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_40px_rgba(31,31,31,0.06)]">
          <h1 className="text-xl font-semibold text-gray-800">Beasiswa tidak ditemukan</h1>
          <p className="mt-2 text-sm text-gray-500">
            Beasiswa yang kamu cari tidak tersedia atau telah berakhir.
          </p>
          <Link
            href="/scholarshiphub"
            className="mt-6 inline-flex rounded-xl bg-[#f58a1f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#dd7611] transition-colors"
          >
            Lihat Semua Beasiswa
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        <ScholarshipDetailHeader scholarship={scholarship} />
        <ScholarshipDetailInfo scholarship={scholarship} />
        {scholarship.universitas && scholarship.universitas.length > 0 && (
          <UniversityListSection universities={scholarship.universitas} />
        )}
      </div>
    </main>
  );
};
