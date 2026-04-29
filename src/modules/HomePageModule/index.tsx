'use client'

import type { SubscriptionPackage } from '@/features/payment/types/payment-api.types'
import { GetStartedSection } from './sections/GetStartedSection'
import { ProductValuesSection } from './sections/ProductValuesSection'
// import { UserProcedureSection } from './sections/UserProcedureSection'
import PricingTableSection from './sections/PricingTableSection'

type Props = {
  initialPackages?: SubscriptionPackage[];
};

export const HomePageModule = ({ initialPackages }: Props) => {
  return (
    <div>
      <GetStartedSection />
      <ProductValuesSection />
      {/* <UserProcedureSection /> */}
      <PricingTableSection initialPackages={initialPackages} />
    </div>
  )
}
