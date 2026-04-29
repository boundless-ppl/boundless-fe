export default function DreamtrackerLoading() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row animate-pulse">
          <aside className="w-full lg:w-56 shrink-0">
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-3 h-3 w-28 rounded bg-gray-100" />
              <div className="space-y-2">
                <div className="h-14 rounded-lg bg-gray-100" />
                <div className="h-14 rounded-lg bg-gray-100" />
                <div className="h-14 rounded-lg bg-gray-100" />
              </div>
            </div>
          </aside>
          <div className="flex-1 min-w-0 space-y-4">
            <div className="h-40 rounded-2xl border border-gray-100 bg-white" />
            <div className="h-72 rounded-2xl border border-gray-100 bg-white" />
            <div className="h-52 rounded-2xl border border-gray-100 bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
