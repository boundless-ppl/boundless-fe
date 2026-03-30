import { Suspense } from "react";
import { LoginFormSection } from "./sections/LoginFormSection";

export const LoginPageModule = () => {
  return (
    <Suspense fallback={<div />}>
      <LoginFormSection />
    </Suspense>
  );
};
