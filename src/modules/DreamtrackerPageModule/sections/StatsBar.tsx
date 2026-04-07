import type { DreamTrackerDashboardSummary } from "@/lib/api-types";
import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

type Props = {
  summary: DreamTrackerDashboardSummary | null;
};

export const StatsBar = ({ summary }: Props) => {
  const stats = [
    {
      label: "Total Aplikasi",
      value: summary?.total_applications ?? 0,
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      valuColor: "text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Belum Lengkap",
      value: summary?.incomplete_count ?? 0,
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-400",
      valuColor: "text-orange-500",
      border: "border-orange-100",
    },
    {
      label: "Selesai",
      value: summary?.completed_count ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      valuColor: "text-green-600",
      border: "border-green-100",
    },
    {
      label: "Deadline Mendekat",
      value: summary?.deadline_near_count ?? 0,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-400",
      valuColor: "text-red-500",
      border: "border-red-100",
    },
  ];

  return (
    <div className="bg-[#faf8f4] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm ${stat.border}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold leading-tight ${stat.valuColor}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
