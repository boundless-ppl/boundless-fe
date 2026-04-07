import { FeatureCardsSection } from "./sections/FeatureCardsSection";
import { HeroSection } from "./sections/HeroSection";

export const DashboardPageModule = () => {
  return (
    <main className="bg-[#f8f5ef] px-4 py-10 md:px-8 lg:px-16 min-h-[90vh]">
      <div className="mx-auto max-w-6xl space-y-8">
        <HeroSection />
        <FeatureCardsSection />
      </div>
    </main>
  );
};
