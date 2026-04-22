import { Suspense } from "react";
import { ScholarshipDetailPageModule } from "@/modules/ScholarshipDetailPageModule";
import Loading from "./loading";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Detail Beasiswa | Boundless",
};

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <ScholarshipDetailPageModule scholarshipId={id} />
    </Suspense>
  );
}
