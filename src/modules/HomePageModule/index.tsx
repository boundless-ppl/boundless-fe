'use client'
import { useUserData } from '@/hooks/useUserData'
import { useAuth } from '@/lib/auth-context'

export const HomePageModule = () => {
  const { email, isAuthenticated } = useUserData()
  const { logout } = useAuth()
  console.log('isAuthenticated', isAuthenticated)

  return (
    <div>
      Halo, {email}
      <button onClick={logout}>Logout</button>
    </div>
  )
}