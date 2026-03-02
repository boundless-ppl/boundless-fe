import React from 'react'
import { GetStartedSection } from './sections/GetStartedSection'
import { ProductValuesSection } from './sections/ProductValuesSection'
import { UserProcedureSection } from './sections/UserProcedureSection'

export const HomePageModule = () => {
  return (
    <div>
      <GetStartedSection />
      <ProductValuesSection />
      <UserProcedureSection />
    </div>
  )
}
