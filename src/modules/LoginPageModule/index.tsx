import { Suspense } from "react";
import { LoginFormSection } from "./sections/LoginFormSection";

export const LoginPageModule = () => {
  return (
    <Suspense fallback={<main className="min-h-[70vh] bg-[#f7efe4]" />}>
      <LoginFormSection />
    </Suspense>
  );
};
