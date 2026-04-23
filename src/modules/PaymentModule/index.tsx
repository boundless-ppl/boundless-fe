import { PaymentFormContainer } from "./sections/PaymentFormContainer";

export const PaymentModule = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-orange-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1d] sm:text-6xl">
            Berlangganan ke Boundless
          </h1>
          <p className="mt-3 text-sm text-[#a2a2a2] sm:text-base">
            Pilih paket dan upload bukti pembayaran transfer
          </p>
        </div>

        <PaymentFormContainer />
      </div>
    </main>
  );
};