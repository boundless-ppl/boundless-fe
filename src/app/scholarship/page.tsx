import { Suspense } from "react";
import { ScholarshipHubPageModule } from "@/modules/ScholarshipHubPageModule";
import Loading from "./loading";

export const metadata = {
  title: "Scholarship Hub | Boundless",
  description: "Temukan beasiswa aktif untuk perjalanan akademikmu",
};

export default function ScholarshipHubPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScholarshipHubPageModule />
    </Suspense>
  );
}
