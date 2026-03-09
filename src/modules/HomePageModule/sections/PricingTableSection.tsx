import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

        {/* Feature Cards (Top) - Menggunakan UI Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURES_NEW.map((f) => (
            <Card 
              key={f.title} 
              className="rounded-[20px] border-[#F0E6D8] bg-[#FDF6EE] transition-transform hover:scale-[1.02] shadow-none"
            >
              <CardContent className="p-6 flex flex-col gap-3">
                <span className="text-[30px]">{f.icon}</span>
                <p className="text-[#2B2B2B] text-[16px] font-semibold">{f.title}</p>
                <p className="text-[#6B6B6B] text-[14px] leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative rounded-[24px] flex flex-col transition-all overflow-visible",
                plan.highlight 
                  ? "border-[1.6px] border-[#FA8613] bg-gradient-to-b from-[#FFF8F0] to-white shadow-[0_8px_40px_0_rgba(250,134,19,0.15)] md:-mt-4" 
                  : "border-[1.6px] border-[#E8E8E8] bg-white shadow-sm"
              )}
            >
              <CardContent className="p-7 flex flex-col gap-6">
                {plan.badge && (
                  <div className="absolute -top-[14px] left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1.5 rounded-full text-white text-[13px] font-semibold bg-gradient-to-r from-[#FA8613] to-[#FFC994] border-none whitespace-nowrap shadow-sm">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <p className="text-[#FA8613] text-[14px] font-semibold tracking-[0.7px] uppercase">{plan.name}</p>
                  {plan.discount && (
                    <Badge variant="secondary" className="bg-[#FFF0E0] text-[#FA8613] text-[12px] font-semibold px-[10px] py-[2px] rounded-full border-none">
                      {plan.discount}
                    </Badge>
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

                <Button
                  className={cn(
                    "w-full py-6 rounded-[12px] text-[15px] font-semibold transition-all active:scale-95 h-auto",
                    plan.highlight
                      ? "text-white bg-gradient-to-r from-[#FA8613] to-[#F6A040] shadow-md hover:opacity-90 border-none"
                      : "text-[#6B6B6B] border-[1.6px] border-[#E8E8E8] bg-white hover:bg-gray-50 shadow-none"
                  )}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
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