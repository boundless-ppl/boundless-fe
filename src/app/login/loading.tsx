export default function LoginLoading() {
  return (
    <main className="min-h-[90vh] bg-[#f7efe4] px-4 py-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-md animate-pulse rounded-[28px] border border-[#eadfce] bg-white p-8">
        <div className="mx-auto mb-6 h-8 w-32 rounded bg-[#f3e9db]" />
        <div className="mb-6 h-6 w-56 rounded bg-[#f3e9db]" />
        <div className="space-y-4">
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
          <div className="h-11 rounded-2xl bg-[#f6f0e7]" />
          <div className="h-11 rounded-2xl bg-[#f0c997]" />
        </div>
      </div>
    </main>
  );
}
