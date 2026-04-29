"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PHRASES = ["Welcome to Boundless", "Lanjutkan persiapan studi ke luar negeri"];
const TYPING_SPEED = 60;
const DELETING_SPEED = 30;
const PAUSE_AFTER_TYPE = 3000;
const PAUSE_AFTER_DELETE = 400;

export const HeroSection = () => {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];

    if (!isDeleting && displayed === current) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      const timeout = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setIsDeleting(false);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <section className="relative rounded-[32px] overflow-hidden min-h-[280px] flex items-center justify-center px-6 py-16 sm:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/dunia.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FA8613]/80 via-[#fcae61]/70 to-[#FA8613]/90" />

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-white min-h-[1.5em]">
          {displayed}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="mt-3 text-base leading-7 text-white/80">
          Temukan universitas impianmu, lacak progres, dan cari beasiswa — semua dalam satu platform. Globalmatch AI, Dreamtracker, dan Scholarship Hub sudah siap untukmu.
        </p>
        <div className="mt-6">
          <Link
            href="/globalmatch"
            className="inline-block rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/30"
          >
            Coba Globalmatch AI
          </Link>
        </div>
      </div>
    </section>
  );
};
