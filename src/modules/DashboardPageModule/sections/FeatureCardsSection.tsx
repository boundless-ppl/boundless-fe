export const FeatureCardsSection = () => {
  return (
    <section className="grid gap-2 md:gap-4 md:grid-cols-3">
      <div className="rounded-[28px] border border-[#eadfce] bg-white p-6">
        <p className="text-sm font-medium text-[#f58a1f]">Tersedia sekarang</p>
        <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Globalmatch AI</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Unggah profilmu dan dapatkan rekomendasi universitas berdasarkan targetmu.
        </p>
      </div>
      <div className="rounded-[28px] border border-[#eadfce] bg-white p-6">
        <p className="text-sm font-medium text-[#f58a1f]">Tersedia sekarang</p>
        <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Dreamtracker</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Pantau milestone persiapanmu dan simpan progres aplikasi dalam satu tempat.
        </p>
      </div>
      <div className="rounded-[28px] border border-[#eadfce] bg-white p-6">
        <p className="text-sm font-medium text-[#6b7280]">Segera hadir</p>
        <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Scholarship Hub</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Rekomendasi pendanaan dan dukungan perencanaan akan hadir di sini berikutnya.
        </p>
      </div>
    </section>
  );
};
