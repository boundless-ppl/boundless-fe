"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { ScholarshipCard } from "./sections/ScholarshipCard";
import { SearchFilterSection } from "./sections/SearchFilterSection";
import { PaginationControls } from "./sections/PaginationControls";
import { getScholarships } from "@/features/scholarshiphub/services/scholarship.service";
import type { Scholarship } from "@/lib/api-types";
import type { ScholarshipFilters } from "./types";

const PAGE_SIZE = 12;

export const ScholarshipHubPageModule = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ScholarshipFilters>({
    search: "",
    tipe_pembiayaan: "",
    negara: "",
  });

  const fetchData = useCallback(
    async (currentPage: number, currentFilters: ScholarshipFilters) => {
      setIsLoading(true);
      try {
        const result = await getScholarships({
          page: currentPage,
          page_size: PAGE_SIZE,
          search: currentFilters.search || undefined,
          tipe_pembiayaan: currentFilters.tipe_pembiayaan || undefined,
          negara: currentFilters.negara || undefined,
        });
        setScholarships(result.data);
        setTotal(result.total);
        setTotalPages(result.total_pages);
      } catch {
        setScholarships([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchData(page, filters);
  }, [page, filters, fetchData]);

  function handleFilterChange(newFilters: ScholarshipFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Search & Filter */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <SearchFilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            totalResults={total}
            isLoading={isLoading}
          />
        </div>

        {/* List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
                >
                  <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
                  <div className="h-5 w-3/4 rounded bg-gray-100" />
                  <div className="mt-1 h-3 w-1/2 rounded bg-gray-100" />
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                    <div className="h-3 w-4/6 rounded bg-gray-100" />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-7 w-24 rounded-full bg-gray-100" />
                    <div className="h-7 w-24 rounded-xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : scholarships.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-200" />
              <p className="mt-4 text-base font-medium text-gray-400">
                Tidak ada beasiswa ditemukan
              </p>
              <p className="mt-1 text-sm text-gray-300">
                Coba ubah kata kunci atau hapus filter yang aktif.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};
