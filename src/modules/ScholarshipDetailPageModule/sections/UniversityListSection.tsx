import { Award, ExternalLink, Globe2 } from "lucide-react";
import type { ScholarshipUniversity } from "@/lib/api-types";

type Props = {
  universities: ScholarshipUniversity[];
};

export const UniversityListSection = ({ universities }: Props) => {
  if (!universities || universities.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
          <Globe2 className="h-4 w-4 text-[#f58a1f]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Universitas Terkait
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {universities.map((uni) => (
          <div
            key={uni.university_id}
            className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-orange-200 hover:bg-orange-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {uni.ranking && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 group-hover:border-orange-200 group-hover:text-orange-600 transition-colors">
                      <Award className="h-2.5 w-2.5" />
                      #{uni.ranking}
                    </span>
                  )}
                  {uni.tipe && (
                    <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-400 capitalize group-hover:border-orange-200 transition-colors">
                      {uni.tipe === "public" ? "Negeri" : "Swasta"}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-800 leading-snug">{uni.nama}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {uni.kota}, {uni.negara}
                </p>
                {uni.deskripsi && (
                  <p className="mt-2 text-xs leading-5 text-gray-500 line-clamp-2">
                    {uni.deskripsi}
                  </p>
                )}
              </div>
            </div>

            {uni.website && (
              <a
                href={uni.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#f58a1f] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Website resmi
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
