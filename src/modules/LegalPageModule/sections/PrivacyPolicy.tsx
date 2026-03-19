const policySections = [
  {
    id: 'pendahuluan',
    title: 'Pendahuluan',
    content: (
      <>
        <p>
          Boundless adalah platform digital yang membantu mahasiswa merencanakan dan
          mengelola proses pendaftaran studi ke luar negeri, termasuk pelacakan
          beasiswa, manajemen dokumen, serta analisis berbasis kecerdasan buatan (AI).
        </p>
        <p>
          Platform ini dioperasikan oleh seorang individual founder yang berdomisili di
          Depok, Indonesia sebagai bagian dari proyek akademik.
        </p>
        <p>
          Kebijakan Privasi ini disusun sesuai dengan{' '}
          <strong>
            Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)
          </strong>{' '}
          serta peraturan lain yang berlaku di Indonesia.
        </p>
        <p>
          Dengan menggunakan layanan Boundless, pengguna menyatakan telah membaca dan
          menyetujui kebijakan ini.
        </p>
      </>
    ),
  },
  {
    id: 'data-pribadi',
    title: 'Data Pribadi yang Kami Kumpulkan',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Data akun</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Nama lengkap</li>
            <li>Alamat email</li>
            <li>Kata sandi dalam bentuk terenkripsi</li>
            <li>Informasi akun Google jika menggunakan SSO</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Data akademik dan aplikasi</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Curriculum Vitae (CV)</li>
            <li>Transkrip akademik</li>
            <li>Data pelacakan beasiswa</li>
            <li>Status dan progres aplikasi</li>
            <li>Preferensi universitas atau program studi</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Data yang diproses oleh AI</h3>
          <p className="mt-3 text-slate-600">
            Dokumen atau konten yang diunggah pengguna dapat diproses oleh sistem
            kecerdasan buatan untuk menghasilkan analisis dan rekomendasi terkait proses
            aplikasi studi.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Data teknis</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Alamat IP</li>
            <li>Informasi perangkat dan browser</li>
            <li>Data interaksi pengguna dengan aplikasi</li>
            <li>Data analitik penggunaan</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'tujuan-penggunaan',
    title: 'Tujuan Penggunaan Data',
    content: (
      <ul className="list-disc space-y-2 pl-5 text-slate-600">
        <li>Membuat dan mengelola akun pengguna</li>
        <li>Menyediakan fitur DreamTracker dan pelacakan beasiswa</li>
        <li>Melakukan analisis dokumen berbasis AI</li>
        <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
        <li>Melakukan analisis performa sistem</li>
        <li>Mencegah penyalahgunaan layanan</li>
        <li>Memenuhi kewajiban hukum yang berlaku</li>
      </ul>
    ),
  },
  {
    id: 'transparansi-ai',
    title: 'Transparansi Pemrosesan AI',
    content: (
      <>
        <p>
          Boundless menggunakan teknologi kecerdasan buatan yang disediakan oleh
          penyedia layanan pihak ketiga untuk mendukung analisis dokumen dan pemberian
          rekomendasi.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Data dapat dikirim secara aman ke layanan AI</li>
          <li>Hasil AI bersifat otomatis dan tidak selalu 100% akurat</li>
          <li>
            Boundless tidak menggantikan keputusan resmi universitas atau lembaga
            pemberi beasiswa
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'keamanan-data',
    title: 'Penyimpanan dan Keamanan Data',
    content: (
      <>
        <p>
          Data pengguna disimpan menggunakan layanan komputasi awan dan sistem basis
          data yang memiliki standar keamanan industri.
        </p>
        <p>
          Boundless menerapkan langkah teknis dan organisasi yang wajar untuk
          melindungi data dari akses tidak sah, kebocoran, perubahan, maupun kehilangan
          data.
        </p>
      </>
    ),
  },
  {
    id: 'retensi-data',
    title: 'Retensi Data',
    content: (
      <>
        <p>Data pribadi disimpan selama akun pengguna masih aktif.</p>
        <p>
          Jika akun dihapus, data dapat disimpan sementara untuk tujuan backup,
          keamanan sistem, atau kewajiban hukum sebelum dihapus secara permanen dalam
          jangka waktu yang wajar.
        </p>
      </>
    ),
  },
  {
    id: 'layanan-pihak-ketiga',
    title: 'Layanan Pihak Ketiga',
    content: (
      <>
        <p>Boundless dapat menggunakan layanan pihak ketiga seperti:</p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Cloud hosting</li>
          <li>Sistem basis data</li>
          <li>Layanan autentikasi (SSO)</li>
          <li>Layanan analitik</li>
          <li>Layanan pemrosesan AI</li>
        </ul>
      </>
    ),
  },
  {
    id: 'hak-pengguna',
    title: 'Hak Pengguna',
    content: (
      <>
        <p>Sesuai UU PDP, pengguna memiliki hak untuk:</p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Mengakses data pribadi</li>
          <li>Meminta perbaikan data</li>
          <li>Menarik persetujuan pemrosesan data</li>
          <li>Meminta penghapusan data</li>
          <li>Membatasi pemrosesan data</li>
          <li>Mengajukan pengaduan kepada otoritas terkait</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookie-analitik',
    title: 'Cookie dan Analitik',
    content: (
      <p>
        Boundless menggunakan cookie dan teknologi serupa untuk meningkatkan
        pengalaman pengguna serta menganalisis penggunaan aplikasi.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Kontak',
    content: (
      <p>
        Jika memiliki pertanyaan terkait kebijakan privasi ini, pengguna dapat
        menghubungi Boundless melalui informasi kontak yang tersedia di bagian akhir
        dokumen ini.
      </p>
    ),
  },
]

const highlights = [
  'Kami hanya mengumpulkan data yang relevan untuk pembuatan akun, pengelolaan aplikasi, dan peningkatan layanan.',
  'Dokumen tertentu dapat diproses oleh layanan AI pihak ketiga untuk menghasilkan analisis dan rekomendasi.',
  'Pengguna memiliki hak untuk mengakses, memperbaiki, menarik persetujuan, dan meminta penghapusan data pribadi.',
]

export const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fed7aa_38%,#fdba74_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] px-6 py-10 sm:px-10 sm:py-14">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                Legal
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Privacy Policy
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base text-justify">
                  Dokumen ini menjelaskan bagaimana Boundless mengumpulkan,
                  menggunakan, menyimpan, dan melindungi data pribadi pengguna secara
                  jelas, proporsional, dan sesuai ketentuan perlindungan data yang
                  berlaku di Indonesia.
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-6">
                <span>Terakhir diperbarui: 11 Maret 2026</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                <span>Berlaku untuk seluruh layanan Boundless</span>
              </div>
            </div>
          </div>

          <div className="lg:grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Ringkasan
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 max-lg:mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Daftar Isi
                </h2>
                <nav className="mt-4 space-y-1">
                  {policySections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    >
                      <span className="min-w-6 font-medium text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="space-y-6">
              {policySections.map((section, index) => (
                <section
                  id={section.id}
                  key={section.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8"
                >
                  <div className="mb-5 md:flex items-center gap-4 max-md:space-y-5">
                    <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-2xl bg-orange-400 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
                        Section
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-orange-500">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                    {section.content}
                  </div>
                </section>
              ))}

              <section className="rounded-3xl border border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_100%)] p-6 sm:p-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                    Contact
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-950">
                    Pertanyaan mengenai privasi dan penggunaan data
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                    Untuk pertanyaan, permintaan akses data, atau pengajuan penghapusan
                    data pribadi, silakan hubungi kami melalui detail berikut.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Email
                    </p>
                    <a
                      href="mailto:boundless.startup@gmail.com"
                      className="mt-2 block text-sm md:text-base font-medium text-slate-950 hover:text-orange-500"
                    >
                      boundless.startup@gmail.com
                    </a>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Domisili
                    </p>
                    <p className="mt-2 text-sm md:text-base font-medium text-slate-950">
                      Depok, Indonesia
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
