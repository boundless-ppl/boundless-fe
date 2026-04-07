export function getSavingsLabel(
  planPrice: number,
  durationMonths: number,
  baseMonthlyPrice: number
): string | null {
  if (durationMonths <= 1 || planPrice <= 0 || baseMonthlyPrice <= 0) {
    return null;
  }

  const fullMonthlyTotal = baseMonthlyPrice * durationMonths;
  if (fullMonthlyTotal <= planPrice) {
    return null;
  }

  const savingsPercent = Math.round(
    ((fullMonthlyTotal - planPrice) / fullMonthlyTotal) * 100
  );

  if (savingsPercent <= 0) {
    return null;
  }

  return `Hemat ${savingsPercent}%`;
}