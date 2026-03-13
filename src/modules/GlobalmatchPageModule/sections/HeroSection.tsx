"use client";

import { useState } from "react";
import { ArrowRight, Globe2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UploadModal } from "../components/UploadModal/index"; 

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 py-10 font-sans md:px-6 md:py-14">
      <div className="relative mx-auto max-w-4xl">
        <Card className="overflow-hidden rounded-[28px] border-[#eadfce] bg-white shadow-[0_20px_48px_rgba(31,41,55,0.08)]">
          <CardContent className="p-7 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mt-2 text-[26px] font-semibold text-[#1f2937]">
                  Upload CV atau transkrip Anda
                </h2>
              </div>
            </div>

            <p className="text-[15px] leading-7 text-[#6b7280]">
              Anda bisa mulai dengan CV saja, transkrip saja, atau keduanya. Sistem akan memakai dokumen yang tersedia untuk menyusun rekomendasi program yang relevan.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-4 rounded-[20px] border border-[#ece4d8] bg-[#fcfaf7] px-4 py-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white">
                  <Upload className="h-5 w-5 text-[#f58a1f]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1f2937]">Upload dokumen</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                    Pilih dokumen yang sudah tersedia sekarang. Anda tidak perlu menunggu CV dan transkrip lengkap dua-duanya.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-[20px] border border-[#ece4d8] bg-[#fcfaf7] px-4 py-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white">
                  <Globe2 className="h-5 w-5 text-[#f58a1f]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1f2937]">Tambahkan preferensi</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                    Semakin jelas preferensi Anda, semakin terarah shortlist yang dihasilkan.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "mt-7 h-auto w-full rounded-[22px] bg-[#f58a1f] px-6 py-4 text-left text-[15px] font-semibold text-white transition-all hover:bg-[#dd7611] hover:shadow-lg",
                "flex items-center justify-between gap-3"
              )}
            >
              <span className="flex items-center gap-3">
                <Upload className="h-5 w-5" />
                Mulai upload dokumen
              </span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <UploadModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </section>
  );
};
