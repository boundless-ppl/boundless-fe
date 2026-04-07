import type { SubscriptionPackage } from "@/features/payment/types/payment-api.types";
import type { PaymentPlanId } from "@/features/payment/types/payment-form.types";

const PLAN_DURATION_MONTHS: Record<PaymentPlanId, number> = {
  "1month": 1,
  "3month": 3,
  "1year": 12,
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

  if (planId === "1year") {
    return (
      packages.find((pkg) => pkg.duration_months >= 12) ??
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
    "1year": resolvePackageByPlanId("1year", packages)?.price_amount,
  };
}
