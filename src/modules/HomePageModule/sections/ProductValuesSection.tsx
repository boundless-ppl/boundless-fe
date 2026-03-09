import React from "react";
import Image from "next/image";
import { FEATURES } from "../constant";
import { ProductValueCard } from "../components/ProductValueCard";

export const ProductValuesSection = () => {
  return (
    <section className="relative py-20 px-4">
      <Image
        src="/values-section.png"
        alt="Values Section Background"
        fill
        className="object-cover z-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How Boundless helps you
        </h2>
        <p className="text-xl text-white/90 mb-16">
          Everything You Need, All in One Place
        </p>

        <div className="w-auto flex flex-row gap-8 justify-center">
          {FEATURES.map((feature, index) => (
            <ProductValueCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
