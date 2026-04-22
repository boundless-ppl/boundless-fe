export default function GlobalmatchResultLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f1_0%,#f8fafc_38%,#ffffff_100%)]">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-7 w-80 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <div className="h-24 animate-pulse rounded-3xl bg-white" />
          <div className="h-44 animate-pulse rounded-3xl bg-white" />
          <div className="h-44 animate-pulse rounded-3xl bg-white" />
        </div>
      </div>
    </main>
  );
}
