"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UploadModal } from "../components/UploadModal/index"; 

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="flex-1 py-12 md:py-20 px-4 font-sans">
      <div className="max-w-[800px] mx-auto">
        
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge 
            className="bg-gradient-to-r from-[#fa8613] to-[#ffc994] border-none px-4 py-2 text-white text-[13px] font-semibold rounded-full"
          >
            GlobalMatch AI
          </Badge>
        </div>

        {/* Heading */}
        <h1 className="font-bold text-[#2b2b2b] text-[32px] md:text-[40px] lg:text-[48px] leading-tight mb-4 text-center">
          Dapatkan Rekomendasi Program yang Tepat untuk Anda
        </h1>

        {/* Subtitle */}
        <p className="font-normal text-[#9b9b9b] text-[14px] md:text-[16px] leading-relaxed mb-12 text-center max-w-[600px] mx-auto">
          Upload CV dan transkrip Anda, kami akan merekomendasikan program yang sesuai dengan profil akademis dan pengalaman Anda
        </p>

        {/* Upload Card */}
        <Card className="rounded-[24px] border-[#e8e8e8] shadow-sm overflow-hidden">
          <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
            <div className="bg-[#fff0e0] rounded-full p-6 mb-6">
              <Upload className="w-8 h-8 text-[#fa8613]" />
            </div>

            <h2 className="font-semibold text-[#2b2b2b] text-[20px] md:text-[24px] mb-3">
              Upload Dokumen Anda
            </h2>

            <p className="font-normal text-[#9b9b9b] text-[13px] md:text-[14px] mb-8 max-w-[400px]">
              Unggah CV dan transkrip nilai Anda untuk mendapatkan rekomendasi program studi yang paling sesuai
            </p>

            {/* Tombol yang mentrigger state modal */}
            <Button 
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "bg-gradient-to-r from-[#fa8613] to-[#ffc994] hover:brightness-90 hover:shadow-lg transition-all duration-300",
                "rounded-[24px] px-8 py-7 h-auto flex items-center gap-3 w-full md:w-auto text-white font-semibold text-[16px]"
              )}
            >
              <Upload className="w-5 h-5" />
              Submit CV & Transkrip untuk Rekomendasi
            </Button>

            <p className="font-normal text-[#9b9b9b] text-[12px] mt-4">
              Format didukung: PDF, DOC, DOCX (Max 10MB)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Modal yang sudah di-refactor (SOLID) dipanggil di sini */}
      {/* Ia akan otomatis menampilkan DocumentStep sebagai langkah pertama */}
      <UploadModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </section>
  );
};