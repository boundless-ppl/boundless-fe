'use client'
import { GetStartedSection } from './sections/GetStartedSection'
import { ProductValuesSection } from './sections/ProductValuesSection'
// import { UserProcedureSection } from './sections/UserProcedureSection'
import PricingTableSection from './sections/PricingTableSection'
import { useUserData } from '@/hooks/useUserData'
import { useAuth } from '@/lib/auth-context'

export const HomePageModule = () => {
  const { email, isAuthenticated } = useUserData()
  const { logout } = useAuth()
  console.log('isAuthenticated', isAuthenticated)

  return (
    <div>
      <GetStartedSection />
      <ProductValuesSection />
      {/* <UserProcedureSection /> */}
      <PricingTableSection />
    </div>
  )
}
