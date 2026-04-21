'use client'

import type { PaymentPlanId } from '@/features/payment/types/payment-form.types'
import { GetStartedSection } from './sections/GetStartedSection'
import { ProductValuesSection } from './sections/ProductValuesSection'
// import { UserProcedureSection } from './sections/UserProcedureSection'
import PricingTableSection from './sections/PricingTableSection'

type Props = {
  initialPrices?: Partial<Record<PaymentPlanId, number>>;
};

export const HomePageModule = ({ initialPrices }: Props) => {
  return (
    <div>
      <GetStartedSection />
      <ProductValuesSection />
      {/* <UserProcedureSection /> */}
      <PricingTableSection initialPrices={initialPrices} />
    </div>
  )
}
