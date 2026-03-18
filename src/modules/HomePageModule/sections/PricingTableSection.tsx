import React from "react";
import { Check, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES_NEW, PLAN_FEATURES, PRICING_PLANS, FEATURE_FLAGS } from "../constant";

export default function PricingTableSection() {
  const isPricingActive = FEATURE_FLAGS.SHOW_PRICING;
  const launchHighlights = [
    "Akses penuh ke fitur yang sudah live",
    "Tanpa kartu kredit atau komitmen langganan",
    "Cocok untuk coba workflow studi abroad dari awal",
  ];
  
  return (
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-263 mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[#2B2B2B] text-3xl md:text-5xl font-bold leading-tight mb-4">
            {isPricingActive ? (
              <>
                Investasi Terbaik untuk{" "}
                <span className="text-[#FA8613]">Masa Depanmu</span>
              </>
            ) : (
              <>
                Semua <span className="text-[#FA8613]">gratis</span> selama peluncuran
              </>
            )}
          </h2>
          <p className="text-[#6B6B6B] text-base md:text-lg max-w-lg mx-auto">
            {isPricingActive 
              ? "Dapatkan akses penuh ke semua fitur Boundless dan mulai perjalanan studi abroadmu hari ini."
              : "Coba Boundless dengan akses penuh selama periode peluncuran. Jelajahi fitur inti kami sebelum harga resmi diumumkan."
            }
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5 mb-10 md:mb-14">
          {FEATURES_NEW.map((f) => (
            <Card 
              key={f.title} 
              className="rounded-2xl border border-[#eee] bg-[#faf8f5] shadow-none"
            >
              <CardContent className="px-5 md:px-6">
                <div className="flex items-start justify-between mb-3">
                  {f.status === 'live' && (
                    <Badge className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">
                      Aktif
                    </Badge>
                  )}
                  {f.status === 'in-development' && (
                    <Badge className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-200">
                      Dalam Pengembangan
                    </Badge>
                  )}
                  {f.status === 'coming-soon' && (
                    <Badge className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium border border-gray-200">
                      Segera Hadir
                    </Badge>
                  )}
                </div>
                <p className="text-[#2B2B2B] text-sm md:text-base font-semibold mb-1">{f.title}</p>
                <p className="text-[#888] text-sm leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isPricingActive ? (
          <>
            {/* Pricing Cards - Active */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {PRICING_PLANS.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "relative rounded-2xl flex flex-col overflow-visible",
                    plan.highlight 
                      ? "border-2 border-[#FA8613] bg-white shadow-lg md:-mt-4" 
                      : "border border-[#E8E8E8] bg-white shadow-sm"
                  )}
                >
                  <CardContent className="p-7 flex flex-col gap-6">
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="px-4 py-1 rounded-full text-white text-xs font-semibold bg-[#FA8613] border-none whitespace-nowrap">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <div>
                      <p className="text-[#FA8613] text-sm font-semibold tracking-wide uppercase">{plan.name}</p>
                      {plan.discount && (
                        <span className="inline-block mt-1 bg-orange-50 text-[#FA8613] text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {plan.discount}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-[#2B2B2B] text-3xl font-bold">{plan.price}</p>
                      <p className="text-sm text-[#999] mt-1">
                        {plan.subtext.split('·')[0]}· <span className="text-[#666]">{plan.subtext.split('·')[1]}</span>
                      </p>
                    </div>

                    <ul className="flex flex-col gap-3 flex-1">
                      {PLAN_FEATURES.map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <Check size={15} strokeWidth={2.5} color={plan.checkColor} className="shrink-0" />
                          <span className="text-[#2B2B2B] text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full py-5 rounded-xl text-sm font-semibold h-auto",
                        plan.highlight
                          ? "text-white bg-[#FA8613] hover:bg-[#e57a0f] border-none"
                          : "text-[#666] border border-[#ddd] bg-white hover:bg-gray-50"
                      )}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-[#aaa] text-sm mt-10">
              Semua paket termasuk akses ke semua fitur. Tidak ada biaya tersembunyi.
            </p>
          </>
        ) : (
            <div className="rounded-3xl border border-[#e8ddd0] bg-[#fffaf5] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                {/* Left side */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c76600] mb-5">
                    Akses Peluncuran
                  </p>

                  <h3 className="text-2xl md:text-[38px] font-bold leading-snug text-[#2B2B2B]">
                    Semua fitur aktif bisa dicoba gratis selama periode peluncuran
                  </h3>
                  <p className="mt-4 max-w-md text-sm md:text-base leading-7 text-[#777]">
                    Gunakan Boundless sekarang untuk mencoba GlobalMatch AI dan fondasi workflow studi abroad kami tanpa biaya, sambil kami menyiapkan struktur pricing final.
                  </p>

                  <div className="mt-8 grid gap-1 md:gap-3 sm:grid-cols-3">
                    {launchHighlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-white border border-[#eee] px-4 py-4"
                      >
                        <Check className="h-5 w-5 text-[#FA8613] mb-3" />
                        <p className="text-sm font-medium leading-snug text-[#2B2B2B]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - pricing card */}
                <div className="rounded-2xl border border-[#e8ddd0] bg-white p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FA8613]">
                      Waktu Terbatas
                    </span>
                    <span className="flex items-center gap-1.5 text-[#999] text-xs">
                      <Clock3 className="h-3.5 w-3.5" />
                      Harga diumumkan nanti
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#FA8613] px-5 py-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Penawaran Saat Ini
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-5xl font-bold leading-none">Gratis</span>
                      <span className="pb-1 text-sm text-white/70">akses penuh</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      Tidak ada biaya untuk akses selama fase early launch. Cukup daftar dan mulai eksplorasi.
                    </p>
                  </div>

                  <ul className="mt-5 space-y-3 text-sm text-[#555]">
                    <li className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FA8613]" />
                      Akses sekarang ideal untuk mencoba produk sebelum fitur premium dan paket berbayar dirilis.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FA8613]" />
                      Fokus kami saat ini adalah validasi produk dan pengalaman pengguna, bukan monetisasi dini.
                    </li>
                  </ul>

                  <Button className="mt-6 h-auto w-full rounded-xl bg-[#2B2B2B] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1a1a1a]">
                    Coba Boundless Sekarang
                  </Button>
                </div>
              </div>
            </div>

        )}
      </div>
    </section>
  );
}
