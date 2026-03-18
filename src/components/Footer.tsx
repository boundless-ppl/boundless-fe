"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

export const Footer = () => {
  const [year, setYear] = React.useState<number | null>(null)

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const navLinks = [
    { href: "/", label: "Beranda", loggedIn: false },
    // { href: "/discover", label: "Jelajahi", loggedIn: true },
    // { href: "/timeline", label: "Rencana Persiapan", loggedIn: true },
    // { href: "/scholarships", label: "Beasiswa", loggedIn: true },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 md:px-8 lg:px-16 pt-8 md:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr_2fr] gap-10 items-start">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/LOGO_BLACK.svg"
                alt="Boundless Logo"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 md:max-w-sm text-justify">
              Menembus batas untuk pendidikan global. Bergabunglah dengan ribuan mahasiswa yang mempersiapkan studi ke luar negeri dengan penuh keyakinan.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Jelajahi</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/BONBON_FOOTER.svg"
              alt="Have a good day!"
              width={1200}
              height={200}
              className="h-32 md:h-40 w-auto"
            />
          </div>
        </div>

        <div className="mt-2 md:mt-12 border-t border-gray-100 py-4 text-xs md:text-sm text-gray-400 text-center">
          &copy; {year ?? ""} Boundless. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
