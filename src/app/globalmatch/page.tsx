"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlobalmatchPageModule } from "@/modules/GlobalmatchPageModule"
import { useAuth } from "@/lib/auth-context"

const GlobalmatchPage = () => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#fbf6ef] px-6 py-12">
        <div className="rounded-[28px] border border-[#eadfce] bg-white px-8 py-10 text-center shadow-[0_18px_40px_rgba(31,31,31,0.06)]">
          <h1 className="text-2xl font-semibold text-[#1f2937]">Mengalihkan ke halaman masuk</h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#6b7280]">
            Globalmatch hanya tersedia untuk pengguna yang sudah login.
          </p>
        </div>
      </main>
    )
  }

  return <GlobalmatchPageModule />
}

export default GlobalmatchPage
