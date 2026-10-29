export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Top Header skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-stone-200" />
          <div className="h-4 w-72 rounded bg-stone-100" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-stone-200" />
      </div>

      {/* Main card skeleton */}
      <div className="card overflow-hidden p-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-line">
          <div className="h-5 w-40 rounded bg-stone-200" />
          <div className="h-8 w-24 rounded bg-stone-100" />
        </div>
        <div className="space-y-3 pt-5">
          <div className="h-16 w-full rounded-xl bg-stone-100/90" />
          <div className="h-16 w-full rounded-xl bg-stone-100/90" />
          <div className="h-16 w-full rounded-xl bg-stone-100/90" />
          <div className="h-16 w-full rounded-xl bg-stone-100/90" />
        </div>
      </div>
    </div>
  );
}
