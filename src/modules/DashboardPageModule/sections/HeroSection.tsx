import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="rounded-[32px] border border-[#eadfce] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(31,31,31,0.06)] sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#f58a1f]">
        Dashboard
      </p>
      <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-[#1f2937] sm:text-4xl">
        Lanjutkan persiapan studi ke luar negeri
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#6b7280]">
        Globalmatch AI telah tersedia. Fitur Scholarship Hub dan Dreamtracker saat ini sedang dalam tahap pengembangan dan akan segera hadir.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/globalmatch"
          className="rounded-xl md:rounded-2xl bg-[#f58a1f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#dd7611] max-md:w-full max-md:text-center"
        >
          Buka Globalmatch AI
        </Link>
        <Link
          href="/"
          className="rounded-xl md:rounded-2xl border border-[#d8d3ca] px-5 py-3 text-sm font-semibold text-[#1f2937] transition-colors hover:bg-[#f7f4ee] max-md:w-full max-md:text-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
};
