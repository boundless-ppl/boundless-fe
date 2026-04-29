import { Suspense } from "react";
import { RegisterFormSection } from "./sections/RegisterFormSection";

export const RegisterPageModule = () => {
  return (
    <Suspense fallback={<main className="min-h-[70vh] bg-[#f7efe4]" />}>
      <RegisterFormSection />
    </Suspense>
  );
};
