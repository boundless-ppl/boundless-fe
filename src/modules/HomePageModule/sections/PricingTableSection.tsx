import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES_NEW, PLAN_FEATURES, PRICING_PLANS } from "../constant";

export default function PricingTableSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-4 font-sans">
      <div className="max-w-[1052px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#FA8613] text-[13px] md:text-[15px] font-semibold tracking-[1.5px] uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-[#2B2B2B] text-3xl md:text-[44px] font-bold leading-tight mb-4">
            Investasi Terbaik untuk{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FA8613] to-[#FFC994]">
              Masa Depanmu
            </span>
          </h2>
          <p className="text-[#6B6B6B] text-base md:text-[17px] max-w-[560px] mx-auto">
            Dapatkan akses penuh ke semua fitur Boundless dan mulai perjalanan studi abroadmu hari ini.
          </p>
        </div>

        {/* Feature Cards (Top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURES_NEW.map((f) => (
            <div key={f.title} className="rounded-[20px] border border-[#F0E6D8] bg-[#FDF6EE] p-6 flex flex-col gap-3 transition-transform hover:scale-[1.02]">
              <span className="text-[30px]">{f.icon}</span>
              <p className="text-[#2B2B2B] text-[16px] font-semibold">{f.title}</p>
              <p className="text-[#6B6B6B] text-[14px] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-[24px] p-7 flex flex-col gap-6 transition-all",
                plan.highlight 
                  ? "border-[1.6px] border-[#FA8613] bg-gradient-to-b from-[#FFF8F0] to-white shadow-[0_8px_40px_0_rgba(250,134,19,0.15)] md:-mt-4" 
                  : "border-[1.6px] border-[#E8E8E8] bg-white shadow-sm"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-white text-[13px] font-semibold bg-gradient-to-r from-[#FA8613] to-[#FFC994] whitespace-nowrap shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <p className="text-[#FA8613] text-[14px] font-semibold tracking-[0.7px] uppercase">{plan.name}</p>
                {plan.discount && (
                  <span className="bg-[#FFF0E0] text-[#FA8613] text-[12px] font-semibold px-[10px] py-[2px] rounded-full w-fit">
                    {plan.discount}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[#2B2B2B] text-[32px] font-bold leading-none">{plan.price}</p>
                <p className="text-[13px] text-[#9B9B9B]">
                  {plan.subtext.split('·')[0]} · <span className="text-[#6B6B6B]">{plan.subtext.split('·')[1]}</span>
                </p>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {PLAN_FEATURES.map((item) => (
                  <li key={item} className="flex items-center gap-[10px]">
                    <Check size={16} strokeWidth={3} color={plan.checkColor} className="shrink-0" />
                    <span className="text-[#2B2B2B] text-[14px] leading-tight">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-4 rounded-[12px] text-[15px] font-semibold transition-all active:scale-95",
                  plan.highlight
                    ? "text-white bg-gradient-to-r from-[#FA8613] to-[#F6A040] shadow-md hover:opacity-90"
                    : "text-[#6B6B6B] border-[1.6px] border-[#E8E8E8] bg-white hover:bg-gray-50"
                )}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[#9B9B9B] text-[13px] mt-10">
          Semua paket termasuk akses ke semua fitur. Tidak ada biaya tersembunyi.
        </p>
      </div>
    </section>
  );
}