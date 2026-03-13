'use client'

import { GetStartedSection } from './sections/GetStartedSection'
import { ProductValuesSection } from './sections/ProductValuesSection'
// import { UserProcedureSection } from './sections/UserProcedureSection'
import PricingTableSection from './sections/PricingTableSection'

export const HomePageModule = () => {
  return (
    <div>
      <GetStartedSection />
      <ProductValuesSection />
      {/* <UserProcedureSection /> */}
      <PricingTableSection />
    </div>
  )
}
