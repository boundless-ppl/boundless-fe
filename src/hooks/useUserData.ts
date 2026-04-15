"use client"

import { useAuth } from "@/lib/auth-context"

export function useUserData() {
  const { user, isAuthenticated } = useAuth()
  const premiumEndAt = user?.premiumEndAt ?? null
  const premiumEndDate = premiumEndAt ? new Date(premiumEndAt) : null
  const isPremiumActive = Boolean(
    user?.isPremium &&
      (!premiumEndDate || Number.isNaN(premiumEndDate.getTime()) || premiumEndDate.getTime())
  )

  return {
    isAuthenticated,
    fullName: user?.nama_lengkap || "",
    email: user?.email || "",
    userId: user?.userId || "",
    role: user?.role || "user",
    isPremium: isPremiumActive,
    premiumStartAt: user?.premiumStartAt ?? null,
    premiumEndAt,
  }
}