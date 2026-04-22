export default function Loading() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-12 w-12 rounded-2xl bg-gray-100" />
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-gray-100" />
              <div className="h-3 w-64 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded-xl bg-gray-100" />
            <div className="h-10 w-32 rounded-xl bg-gray-100" />
            <div className="h-10 w-32 rounded-xl bg-gray-100" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
              <div className="h-5 w-3/4 rounded bg-gray-100" />
              <div className="mt-1 h-3 w-1/2 rounded bg-gray-100" />
              <div className="mt-3 space-y-1.5">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-5/6 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
