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
  requiresPremium?: boolean
  comingSoon?: boolean
  hideWhenLoggedIn?: boolean
}

export function Navbar({ className, ...props }: Readonly<React.HTMLAttributes<HTMLElement>>) {
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const [comingSoonItem, setComingSoonItem] = React.useState<string | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const profileMenuRef = React.useRef<HTMLDivElement | null>(null)
  const isPremiumUser = Boolean(user?.isPremium)

  const isProtectedPath = ["/dashboard", "/globalmatch", "/payment", "/profile"].some(
    (protectedPath) => pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  )

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    setIsOpen(false)
    setIsProfileMenuOpen(false)

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
    { href: "/", label: "Beranda", loggedIn: false, hideWhenLoggedIn: true },
    { href: "/dashboard", label: "Dashboard", loggedIn: true },
    { href: "/scholarship", label: "Scholarship Hub", loggedIn: false },
    { href: "/globalmatch", label: "Globalmatch AI", loggedIn: true },
    { href: "/dreamtracker", label: "Dreamtracker", loggedIn: true, requiresPremium: true },
  ]

  const getNameInitials = (fullName?: string, email?: string) => {
    const normalizedName = (fullName ?? "").replace(/\s+/g, "").trim()
    if (normalizedName.length >= 2) {
      return normalizedName.slice(0, 2).toUpperCase()
    }

    const emailPrefix = (email ?? "").split("@")[0] ?? ""
    if (emailPrefix.length >= 2) {
      return emailPrefix.slice(0, 2).toUpperCase()
    }

    return "N/A"
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    globalThis.addEventListener("mousedown", handleClickOutside)

    return () => {
      globalThis.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  const canShowLink = (link: NavLink) => {
    if (link.requiresPremium && !(isMounted && isAuthenticated && isPremiumUser)) {
      return false
    }

    if (link.hideWhenLoggedIn && isMounted && isAuthenticated) {
      return false
    }

    return !link.loggedIn || (isMounted && isAuthenticated)
  }
  const renderNavItem = (link: NavLink) => {
    if (!canShowLink(link)) {
      return null
    }

    if (link.comingSoon) {
      return (
        <button
          key={link.label}
          type="button"
          onClick={() => setComingSoonItem(link.label)}
          className="text-black transition-colors hover:text-foreground/80"
        >
          {link.label}
        </button>
      )
    }

    return (
      <Link
        key={link.href}
        href={link.href!}
        className="text-black transition-colors hover:text-foreground/80"
      >
        {link.label}
      </Link>
    )
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="px-4 md:px-8 lg:px-16 flex w-full h-16 items-center">
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
            {navLinks.map(renderNavItem)}
          </nav>
        </div>

        <div className="flex w-1/3 justify-end items-center gap-2">
          {isMounted && isAuthenticated && !isPremiumUser && (
            <Link
              href="/payment"
              className="md:hidden rounded-md bg-[#f58a1f] px-3 py-2 text-xs font-bold text-white"
            >
              Subscribe
            </Link>
          )}

          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`absolute w-6 h-0.5 bg-black transition-all duration-300 ${
                isOpen ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-black transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-black transition-all duration-300 ${
                isOpen ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>

          <div className="hidden md:flex items-center gap-2 md:gap-4">
            {isLoading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                {(!isMounted || !isAuthenticated) && (
                  <button className="bg-[linear-gradient(180deg,#4479B2_0%,#669DD9_100%)] backdrop-blur-sm shadow-[0px_2px_4px_0px_#00000040] px-3 py-2 rounded-md text-white font-bold">
                    <Link href="/register">Mulai</Link>
                  </button>
                )}

                {isMounted && isAuthenticated && (
                  <>
                    {!isPremiumUser && (
                      <Button asChild className="rounded-xl bg-[#f58a1f] px-4 text-white hover:bg-[#dd7611]">
                        <Link href="/payment">Subscribe Now</Link>
                      </Button>
                    )}

                    <div className="relative" ref={profileMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f58a1f] text-sm font-bold text-white shadow-[0_8px_18px_rgba(245,138,31,0.35)] transition hover:bg-[#dd7611]"
                        aria-label="Buka menu akun"
                      >
                        {getNameInitials(user?.nama_lengkap, user?.email)}
                      </button>

                      {isPremiumUser && (
                        <span className="absolute -right-2 -top-2 rounded-full bg-[#4479B2] px-2 py-0.5 text-[10px] font-semibold text-white">
                          PRO
                        </span>
                      )}

                      {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 z-20 w-60 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-[0_16px_35px_rgba(31,31,31,0.12)]">
                          <p className="text-sm text-[#6b7280]">
                            Hi, <span className="font-semibold text-[#1f2937]">{user?.email || "Pengguna"}</span>
                          </p>

                          {isPremiumUser && (
                            <p className="mt-2 inline-flex rounded-full bg-[#edf4ff] px-2 py-0.5 text-xs font-semibold text-[#4479B2]">
                              Premium Aktif
                            </p>
                          )}

                          <Button asChild variant="outline" className="mt-3 w-full">
                            <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                              Profile
                            </Link>
                          </Button>

                          <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="mt-3 w-full"
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut ? "Keluar..." : "Keluar"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden fixed top-12 left-0 w-full z-10">
          <div className="flex flex-col gap-4 mt-2 rounded-2xl border-b border-gray-200 bg-white shadow-md p-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              if (!canShowLink(link)) return null

              if (link.comingSoon) {
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      setComingSoonItem(link.label)
                      setIsOpen(false)
                    }}
                    className="text-left text-black"
                  >
                    {link.label}
                  </button>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setIsOpen(false)}
                  className="text-black"
                >
                  {link.label}
                </Link>
              )
            })}

            {isMounted && isAuthenticated && (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="text-black"
              >
                Profile
              </Link>
            )}

            {isMounted && isAuthenticated && !isPremiumUser && (
              <Link href="/payment" onClick={() => setIsOpen(false)}>
                <button className="w-full rounded-md bg-[#f58a1f] px-3 py-2 font-bold text-white">
                  Subscribe Now
                </button>
              </Link>
            )}

            <div className="border-t pt-4">
              {(!isMounted || !isAuthenticated) && (
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-[linear-gradient(180deg,#4479B2_0%,#669DD9_100%)] backdrop-blur-sm shadow-[0px_2px_4px_0px_#00000040] px-3 py-2 rounded-md text-white font-bold">
                    Mulai
                  </button>
                </Link>
              )}

              {isMounted && isAuthenticated && (
                <div className="flex flex-col gap-2">
                  {isPremiumUser && (
                    <span className="w-fit rounded-full bg-[#edf4ff] px-2 py-0.5 text-xs font-semibold text-[#4479B2]">
                      Premium Aktif
                    </span>
                  )}
                  {user?.email && (
                    <span className="text-sm text-foreground/60">
                      {user.email}
                    </span>
                  )}
                  <Button onClick={handleLogout} variant="destructive" disabled={isLoggingOut}>
                    {isLoggingOut ? "Keluar..." : "Keluar"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!comingSoonItem} onOpenChange={(open) => !open && setComingSoonItem(null)}>
        <DialogContent className="max-w-md rounded-3xl border-[#eadfce] p-8">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-semibold text-[#1f2937]">
              {comingSoonItem}
            </DialogTitle>
            <DialogDescription className="text-base leading-7 text-[#6b7280]">
              Fitur ini sedang disiapkan dan akan hadir segera. Sementara itu, kamu sudah bisa mencoba Globalmatch AI sekarang.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex items-center gap-3">
            <Button
              type="button"
              className="rounded-2xl bg-[#f58a1f] text-white hover:bg-[#dd7611]"
              asChild
            >
              <Link href="/globalmatch" onClick={() => setComingSoonItem(null)}>
                Buka Globalmatch AI
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
