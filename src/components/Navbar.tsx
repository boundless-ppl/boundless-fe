"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type NavLink = {
  href?: string
  label: string
  loggedIn: boolean
  comingSoon?: boolean
}

export function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const [comingSoonItem, setComingSoonItem] = React.useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const isProtectedPath = ["/dashboard", "/globalmatch", "/payment"].some(
    (protectedPath) => pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  )

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()

      if (isProtectedPath) {
        const currentSearch = typeof window !== "undefined" ? window.location.search : ""
        const nextTarget = `${pathname}${currentSearch}`
        router.replace(`/login?next=${encodeURIComponent(nextTarget)}`)
        return
      }

      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const navLinks: NavLink[] = [
    { href: "/", label: "Beranda", loggedIn: false },
    { href: "/dashboard", label: "Dashboard", loggedIn: true },
    { href: "/globalmatch", label: "Globalmatch", loggedIn: true },
    { label: "Beasiswa", loggedIn: true, comingSoon: true },
    { label: "Dreamtracker", loggedIn: true, comingSoon: true },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="pl-4 pr-4 flex w-full h-16 items-center">
        <div className="flex w-1/3 justify-start">
          <Link href="/" className="flex items-center">
            <Image
              src="/LOGO_BLACK.svg"
              alt="Boundless Logo"
              width={150}
              height={40}
              className="h-6 w-auto"
            />
          </Link>
        </div>

        <div className="flex w-1/3 justify-center">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) =>
              !link.loggedIn || (isMounted && isAuthenticated) ? (
                link.comingSoon ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => setComingSoonItem(link.label)}
                    className="text-black transition-colors hover:text-foreground/80"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="text-black transition-colors hover:text-foreground/80"
                  >
                    {link.label}
                  </Link>
                )
              ) : null
            )}
          </nav>
        </div>

        <div className="flex w-1/3 justify-end">
          <div className="flex items-center gap-2 md:gap-4">
            {isLoading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                {(!isMounted || !isAuthenticated) && (
                  <button className="bg-[linear-gradient(180deg,_#4479B2_0%,_#669DD9_100%)] backdrop-blur-sm shadow-[0px_2px_4px_0px_#00000040] px-3 py-2 rounded-md text-white font-bold">
                    <Link href="/register">Mulai</Link>
                  </button>
                )}

                {isMounted && isAuthenticated && (
                  <>
                    {user?.email && (
                      <span className="text-sm text-foreground/60 hidden md:inline">
                        {user.email}
                      </span>
                    )}
                    <Button onClick={handleLogout} variant="destructive" disabled={isLoggingOut}>
                      {isLoggingOut ? "Keluar..." : "Keluar"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog open={!!comingSoonItem} onOpenChange={(open) => !open && setComingSoonItem(null)}>
        <DialogContent className="max-w-md rounded-3xl border-[#eadfce] p-8">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-semibold text-[#1f2937]">
              {comingSoonItem}
            </DialogTitle>
            <DialogDescription className="text-base leading-7 text-[#6b7280]">
              Fitur ini sedang disiapkan dan akan hadir segera. Sementara itu, kamu sudah bisa mencoba Globalmatch sekarang.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex items-center gap-3">
            <Button
              type="button"
              className="rounded-2xl bg-[#f58a1f] text-white hover:bg-[#dd7611]"
              asChild
            >
              <Link href="/globalmatch" onClick={() => setComingSoonItem(null)}>
                Buka Globalmatch
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => setComingSoonItem(null)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
