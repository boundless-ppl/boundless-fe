export default function Loading() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-4 animate-pulse">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-gray-100" />
                <div className="h-5 w-20 rounded-full bg-gray-100" />
              </div>
              <div className="h-7 w-2/3 rounded bg-gray-100" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gray-100" />
          </div>
          <div className="mt-5 flex justify-between border-t border-gray-50 pt-5">
            <div className="h-10 w-52 rounded-xl bg-gray-100" />
            <div className="h-10 w-36 rounded-xl bg-gray-100" />
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="mb-4 h-3 w-24 rounded bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-5/6 rounded bg-gray-100" />
              <div className="h-3 w-4/6 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
