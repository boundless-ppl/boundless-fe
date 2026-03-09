import React from 'react'

export const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-xl bg-gray-100 p-10 shadow-lg backdrop-blur-2xl border-2 border-white">
        {/* Header */}
        <header className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Kebijakan Privasi ini menjelaskan bagaimana Boundless mengumpulkan,
            menggunakan, menyimpan, dan melindungi data pribadi pengguna.
          </p>
          <p className="text-sm text-gray-500">
            Terakhir diperbarui: Februari 2026
          </p>
        </header>

        {/* 1 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Pendahuluan
          </h2>
          <p>
            Boundless adalah platform digital yang membantu mahasiswa dalam
            merencanakan dan mengelola proses pendaftaran studi ke luar negeri,
            termasuk pelacakan beasiswa, manajemen dokumen, serta analisis
            berbasis kecerdasan buatan (AI).
          </p>
          <p>
            Platform ini dioperasikan oleh seorang individual founder yang
            berdomisili di Depok, Indonesia sebagai bagian dari proyek
            akademik.
          </p>
          <p>
            Kebijakan Privasi ini disusun sesuai dengan{" "}
            <strong>
              Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data
              Pribadi (UU PDP)
            </strong>{" "}
            serta peraturan lain yang berlaku di Indonesia.
          </p>
          <p>
            Dengan menggunakan layanan Boundless, pengguna menyatakan telah
            membaca dan menyetujui kebijakan ini.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-10 space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. Data Pribadi yang Kami Kumpulkan
          </h2>

          <div>
            <h3 className="mb-2 font-semibold">Data Akun</h3>
            <ul className="list-disc space-y-1 pl-6 text-gray-700">
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Kata sandi dalam bentuk terenkripsi</li>
              <li>Informasi akun Google (jika menggunakan SSO)</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Data Akademik dan Aplikasi</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Curriculum Vitae (CV)</li>
              <li>Transkrip akademik</li>
              <li>Data pelacakan beasiswa</li>
              <li>Status dan progres aplikasi</li>
              <li>Preferensi universitas atau program studi</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Data yang Diproses oleh AI</h3>
            <p>
              Dokumen atau konten yang diunggah pengguna dapat diproses oleh
              sistem kecerdasan buatan untuk menghasilkan analisis dan
              rekomendasi terkait proses aplikasi studi.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Data Teknis</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Alamat IP</li>
              <li>Informasi perangkat dan browser</li>
              <li>Data interaksi pengguna dengan aplikasi</li>
              <li>Data analitik penggunaan</li>
            </ul>
          </div>
        </section>

        {/* 3 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Tujuan Penggunaan Data
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Membuat dan mengelola akun pengguna</li>
            <li>Menyediakan fitur DreamTracker dan pelacakan beasiswa</li>
            <li>Melakukan analisis dokumen berbasis AI</li>
            <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
            <li>Melakukan analisis performa sistem</li>
            <li>Mencegah penyalahgunaan layanan</li>
            <li>Memenuhi kewajiban hukum yang berlaku</li>
          </ul>
        </section>

        {/* 4 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            4. Transparansi Pemrosesan AI
          </h2>
          <p>
            Boundless menggunakan teknologi kecerdasan buatan yang disediakan
            oleh penyedia layanan pihak ketiga untuk mendukung analisis dokumen
            dan pemberian rekomendasi.
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>Data dapat dikirim secara aman ke layanan AI</li>
            <li>Hasil AI bersifat otomatis dan tidak selalu 100% akurat</li>
            <li>
              Boundless tidak menggantikan keputusan resmi universitas atau
              lembaga pemberi beasiswa
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            5. Penyimpanan dan Keamanan Data
          </h2>
          <p>
            Data pengguna disimpan menggunakan layanan komputasi awan dan
            sistem basis data yang memiliki standar keamanan industri.
          </p>
          <p>
            Boundless menerapkan langkah teknis dan organisasi yang wajar untuk
            melindungi data dari akses tidak sah, kebocoran, perubahan, maupun
            kehilangan data.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            6. Retensi Data
          </h2>
          <p>
            Data pribadi disimpan selama akun pengguna masih aktif.
          </p>
          <p>
            Jika akun dihapus, data dapat disimpan sementara untuk tujuan
            backup, keamanan sistem, atau kewajiban hukum sebelum dihapus
            secara permanen dalam jangka waktu yang wajar.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            7. Layanan Pihak Ketiga
          </h2>
          <p>
            Boundless dapat menggunakan layanan pihak ketiga seperti:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cloud hosting</li>
            <li>Sistem basis data</li>
            <li>Layanan autentikasi (SSO)</li>
            <li>Layanan analitik</li>
            <li>Layanan pemrosesan AI</li>
          </ul>
        </section>

        {/* 8 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            8. Hak Pengguna
          </h2>
          <p>Sesuai UU PDP, pengguna memiliki hak untuk:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mengakses data pribadi</li>
            <li>Meminta perbaikan data</li>
            <li>Menarik persetujuan pemrosesan data</li>
            <li>Meminta penghapusan data</li>
            <li>Membatasi pemrosesan data</li>
            <li>Mengajukan pengaduan kepada otoritas terkait</li>
          </ul>
        </section>

        {/* 9 */}
        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            9. Cookie dan Analitik
          </h2>
          <p>
            Boundless menggunakan cookie dan teknologi serupa untuk
            meningkatkan pengalaman pengguna serta menganalisis penggunaan
            aplikasi.
          </p>
        </section>

        {/* 10 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            10. Kontak
          </h2>
          <p>
            Jika memiliki pertanyaan terkait kebijakan privasi ini, pengguna
            dapat menghubungi:
          </p>

          <div className="rounded-lg bg-gray-100 p-4 text-sm">
            <p>Email: boundless.startup@gmail.com</p>
            <p>Domisili: Depok, Indonesia</p>
          </div>
        </section>
      </div>
    </main>
  )
}


