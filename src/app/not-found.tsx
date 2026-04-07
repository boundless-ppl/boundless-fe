import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-[90vh] overflow-hidden bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16">
      <Image
        src="/dunia.png"
        alt="World map"
        width={900}
        height={450}
        className="pointer-events-none absolute bottom-10 left-0 w-full opacity-[0.36]"
      />

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-[28px] border border-[#eadfce] bg-white/96 p-8 text-center shadow-[0_18px_40px_rgba(31,31,31,0.06)] backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f58a1f]">404</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-wider text-[#1f2937] sm:text-6xl">OOPS</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6b7280] sm:text-base">
            Mohon maaf, halaman yang Anda tuju tidak dapat ditemukan. Kemungkinan tautannya keliru, atau halaman tersebut sedang izin tidak masuk dulu hari ini.
          </p>

          <Button
            asChild
            className="mt-7 h-11 rounded-2xl bg-[#f58a1f] px-6 text-sm font-semibold text-white hover:bg-[#dd7611]"
          >
            <Link href="/">Kembali ke Homepage</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
