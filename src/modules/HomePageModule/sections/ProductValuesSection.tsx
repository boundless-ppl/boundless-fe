import Image from "next/image";
import { FEATURES } from "../constant";
import { ProductValueCard } from "../components/ProductValueCard";

export const ProductValuesSection = () => {
  return (
    <section className="relative py-16 md:py-20">
      <Image
        src="/values-section.png"
        alt="Values Section Background"
        fill
        className="object-cover z-0"
      />

      <div className="relative z-10 px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Bagaimana Boundless Membantu Anda
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12 lg:mb-16">
          Semua yang Anda Butuhkan dalam Satu Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {FEATURES.map((feature) => (
            <ProductValueCard
              key={feature.title}
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
