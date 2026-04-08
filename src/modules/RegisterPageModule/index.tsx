import { Suspense } from "react";
import { RegisterFormSection } from "./sections/RegisterFormSection";

export const RegisterPageModule = () => {
  return (
    <Suspense fallback={<div />}>
      <RegisterFormSection />
    </Suspense>
  );
};
