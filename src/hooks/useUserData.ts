"use client"

import { useAuth } from "@/lib/auth-context"

export function useUserData() {
  const { user, isAuthenticated } = useAuth()

  return {
    isAuthenticated,
    email: user?.email || "",
    userId: user?.userId || "",
    role: user?.role || "user",
  }
}