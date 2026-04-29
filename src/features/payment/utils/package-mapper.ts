import type { SubscriptionPackage } from "@/features/payment/types/payment-api.types";
import type { PaymentPlanId } from "@/features/payment/types/payment-form.types";

const PLAN_DURATION_MONTHS: Record<PaymentPlanId, number> = {
  "1month": 1,
  "3month": 3,
  "6month": 6,
};

export function resolvePackageByPlanId(
  planId: PaymentPlanId,
  packages: SubscriptionPackage[]
): SubscriptionPackage | null {
  const targetDuration = PLAN_DURATION_MONTHS[planId];
  const exact = packages.find((pkg) => pkg.duration_months === targetDuration);
  if (exact) {
    return exact;
  }

  if (planId === "6month") {
    return (
      packages.find((pkg) => pkg.duration_months >= 6) ??
      [...packages].sort((a, b) => b.duration_months - a.duration_months)[0] ??
      null
    );
  }

  return null;
}

export function mapPlanPricesFromPackages(
  packages: SubscriptionPackage[]
): Partial<Record<PaymentPlanId, number>> {
  return {
    "1month": resolvePackageByPlanId("1month", packages)?.price_amount,
    "3month": resolvePackageByPlanId("3month", packages)?.price_amount,
    "6month": resolvePackageByPlanId("6month", packages)?.price_amount,
  };
}
