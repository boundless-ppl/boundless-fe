import { HomePageModule } from "@/modules/HomePageModule";
import { getSubscriptionPackages } from "@/features/payment/services/payment.service";
import { mapPlanPricesFromPackages } from "@/features/payment/utils/package-mapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@/features/auth/constants/auth.constants";
import { isAccessTokenExpired } from "@/features/auth/utils/access-token";

export default async function Page() {
  let accessToken: string | undefined;

  try {
    const cookieStore = await cookies();
    accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  } catch {
    // Skip redirect when request cookies are unavailable (e.g. isolated unit tests).
  }

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    redirect("/dashboard");
  }

  const result = await getSubscriptionPackages();
  const initialPrices =
    result.data && !result.error
      ? mapPlanPricesFromPackages(result.data.packages)
      : undefined;

  return <HomePageModule initialPrices={initialPrices} />;
}
