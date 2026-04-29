import Link from "next/link"

export const FeatureCardsSection = () => {
  return (
    <section className="grid gap-2 md:gap-4 md:grid-cols-2">
      <Link href="/globalmatch" className="group flex flex-col rounded-[28px] border border-[#eadfce] bg-white p-6 transition-all hover:shadow-md hover:border-[#d4c4ae] hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#f58a1f]">Tersedia sekarang</p>
            <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Globalmatch AI</h2>
          </div>
          <span className="mt-1 text-[#c47a2b] opacity-40 transition-opacity group-hover:opacity-100">›</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Unggah profilmu dan dapatkan rekomendasi universitas berdasarkan targetmu.
        </p>
      </Link>

      <Link href="/scholarship" className="group flex flex-col rounded-[28px] border border-[#eadfce] bg-white p-6 transition-all hover:shadow-md hover:border-[#d4c4ae] hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#f58a1f]">Tersedia sekarang</p>
            <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Scholarship Hub</h2>
          </div>
          <span className="mt-1 text-[#c47a2b] opacity-40 transition-opacity group-hover:opacity-100">›</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Temukan beasiswa yang sesuai dengan profilmu dan rencanakan pendanaanmu sejak dini.
        </p>
      </Link>

      <Link href="/dreamtracker" className="group flex flex-col rounded-[28px] border border-[#eadfce] bg-white p-6 transition-all hover:shadow-md hover:border-[#d4c4ae] hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#f58a1f]">Tersedia sekarang</p>
            <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Dreamtracker</h2>
          </div>
          <span className="mt-1 text-[#c47a2b] opacity-40 transition-opacity group-hover:opacity-100">›</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Pantau milestone persiapanmu dan simpan progres aplikasi dalam satu tempat.
        </p>
      </Link>

      <div className="flex flex-col rounded-[28px] border border-[#eadfce] bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">Segera hadir</p>
            <h2 className="mt-2 text-xl font-semibold text-[#1f2937]">Autofill Extension</h2>
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Isi formulir pendaftaran universitas secara otomatis berdasarkan data yang sudah kamu kumpulkan di sini.
        </p>
      </div>
    </section>
  )
}
