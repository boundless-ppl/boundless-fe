export default function RegisterLoading() {
  return (
    <main className="min-h-[90vh] bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl animate-pulse rounded-[28px] border border-[#eadfce] bg-white p-6">
        <div className="mx-auto mb-4 h-8 w-32 rounded bg-[#f3e9db]" />
        <div className="mx-auto mb-6 h-6 w-48 rounded bg-[#f3e9db]" />
        <div className="grid gap-3.5 md:grid-cols-2">
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
        </div>
        <div className="mt-4 h-11 rounded-2xl bg-[#f0c997]" />
      </div>
    </main>
  );
}
