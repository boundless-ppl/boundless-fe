"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ScholarshipFilters } from "../types";
import { NEGARA_OPTIONS, TIPE_PEMBIAYAAN_OPTIONS } from "../types";

type Props = {
  filters: ScholarshipFilters;
  onFilterChange: (filters: ScholarshipFilters) => void;
  totalResults: number;
  isLoading: boolean;
};

export const SearchFilterSection = ({ filters, onFilterChange, totalResults, isLoading }: Props) => {
  const hasActiveFilters =
    filters.search !== "" || filters.tipe_pembiayaan !== "" || filters.negara !== "";

  function handleClearAll() {
    onFilterChange({ search: "", tipe_pembiayaan: "", negara: "" });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari beasiswa atau penyelenggara..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#f58a1f] focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Filter tipe pembiayaan */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
          <select
            value={filters.tipe_pembiayaan}
            onChange={(e) => onFilterChange({ ...filters, tipe_pembiayaan: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#f58a1f] focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Semua Tipe</option>
            {TIPE_PEMBIAYAAN_OPTIONS.map((tipe) => (
              <option key={tipe} value={tipe}>
                {tipe}
              </option>
            ))}
          </select>

          {/* Filter negara */}
          <select
            value={filters.negara}
            onChange={(e) => onFilterChange({ ...filters, negara: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#f58a1f] focus:outline-none focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Semua Negara</option>
            {NEGARA_OPTIONS.map((negara) => (
              <option key={negara} value={negara}>
                {negara}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {isLoading ? (
            <span className="inline-block h-4 w-32 animate-pulse rounded bg-gray-100" />
          ) : (
            <>
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">{totalResults}</span> beasiswa aktif
            </>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Hapus filter
          </button>
        )}
      </div>
    </div>
  );
};
