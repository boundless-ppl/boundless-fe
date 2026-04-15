import { HomePageModule } from "@/modules/HomePageModule";
import { getSubscriptionPackages } from "@/features/payment/services/payment.service";
import { mapPlanPricesFromPackages } from "@/features/payment/utils/package-mapper";

export default async function Page() {
  const result = await getSubscriptionPackages();
  const initialPrices =
    result.data && !result.error
      ? mapPlanPricesFromPackages(result.data.packages)
      : undefined;

  return <HomePageModule initialPrices={initialPrices} />;
}