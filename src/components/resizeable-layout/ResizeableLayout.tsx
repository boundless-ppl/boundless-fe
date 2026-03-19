"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FEATURE_BUTTONS, type FeatureButtonId } from "./constant";
import { cn } from "@/lib/utils";

interface City {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

function FeaturePlaceholder({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <div className="flex h-full min-h-80 items-center justify-center rounded-3xl border border-[#eadfce] bg-white p-8">
      <div className="max-w-md text-center">
        <h3 className="text-xl font-semibold text-[#2b2b2b]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#6b7280]">{description}</p>
      </div>
    </div>
  );
}

export default function ResizableLayout() {
  const [activeFeature, setActiveFeature] = useState<FeatureButtonId>("comparison-details");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleButtonClick = (buttonId: FeatureButtonId) => {
    setActiveFeature(buttonId);
  };

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setActiveFeature("comparison-details"); 
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case "comparison-details":
        return (
          <FeaturePlaceholder
            title="Detail negara tujuan"
            description={
              selectedCity
                ? `${selectedCity.city}, ${selectedCity.country} dipilih. Modul detail lama sudah tidak tersedia di codebase ini.`
                : "Pilih kota pada peta untuk melihat detail negara tujuan."
            }
          />
        );
      case "cv-analyzer":
        return (
          <FeaturePlaceholder
            title="Analisis CV"
            description="Komponen analisis CV lama sudah tidak tersedia di codebase ini. Jika fitur ini masih dibutuhkan, perlu dibuat ulang atau dipindahkan ke modul aktif."
          />
        );
      case "chatbot":
        return (
          <FeaturePlaceholder
            title="Bonbon AI"
            description="Komponen chatbot lama tidak ditemukan di project saat ini."
          />
        );
      default:
        return <div>Select a feature</div>;
    }
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-full border rounded-lg"
      >
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full min-h-120 items-center justify-center rounded-l-lg bg-[#fcfaf7] p-8">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-semibold text-[#2b2b2b]">Peta interaktif</h2>
              <p className="mt-3 text-sm leading-7 text-[#6b7280]">
                Komponen peta lama tidak tersedia di codebase ini. Layout ini sekarang memakai placeholder agar build tetap valid.
              </p>
              <button
                type="button"
                onClick={() =>
                  handleCityClick({
                    city: "Tokyo",
                    country: "Jepang",
                    lat: 35.6762,
                    lon: 139.6503,
                  })
                }
                className="mt-5 rounded-2xl bg-[#f58a1f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#dd7611]"
              >
                Coba pilih contoh kota
              </button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle orientation="horizontal" />
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="relative h-full">
              <div className="flex-1 px-8 translate-x-6 pt-4 top-0 mx-2 relative">
                {renderFeatureContent()}
              </div>
                    <div className="flex justify-start rotate-90 -translate-x-1/2 ml-6 gap-1 absolute top-1/4">
                  {FEATURE_BUTTONS.map((button) => (
                    <button
                      key={button.id}
                      type="button"
                      onClick={() => handleButtonClick(button.id)}
                      className={cn(
                        "flex items-center justify-center px-3 py-2 text-sm cursor-pointer transition-colors duration-200 rounded-md",
                        {
                          "bg-[#FFF3E6] text-muted-foreground border-gray-400 border shadow-[4px_0_0_rgba(0,0,0,0.1)]": activeFeature === button.id,
                          "hover:bg-muted text-muted-foreground hover:text-foreground": activeFeature !== button.id,
                        }
                      )}
                    >
                      {button.iconUrl ? (
                        <Image
                          src={button.iconUrl}
                          alt={`${button.label} icon`}
                          width={20}
                          height={20}
                          className="h-5 w-5"
                        />
                      ) : (
                        null
                      )}
                      <span className="ml-1">{button.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
