

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden animate-pulse">
      <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-6 py-4" />
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex space-x-4 px-6 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-neutral-200 dark:bg-neutral-850 rounded-sm flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 space-y-6 animate-pulse">
      <div className="h-6 bg-neutral-200 dark:bg-neutral-850 w-1/4 rounded-sm" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-850 w-1/6 rounded-sm" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-850 w-full rounded-sm" />
          </div>
        ))}
      </div>
      <div className="h-10 bg-neutral-200 dark:bg-neutral-850 w-1/4 rounded-sm" />
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-850 w-1/3 rounded-sm" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-850 w-2/3 rounded-sm" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-850 w-full rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-8 space-y-6 flex-1 animate-pulse select-none">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-28 rounded-xs" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Image Skeleton */}
        <div className="space-y-3">
          <div className="aspect-square w-full bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="flex space-x-2">
            <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
            <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
            <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
          </div>
        </div>
        {/* Product Details Skeleton */}
        <div className="space-y-4">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 w-20 rounded-xs" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-3/4 rounded-xs" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-800 w-36 rounded-xs" />
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 w-28 rounded-xs" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 w-28 rounded-xs" />
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
              <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 w-36 rounded-xs" />
            <div className="h-16 bg-neutral-200 dark:bg-neutral-800 w-full rounded-xs" />
          </div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-800 w-full rounded-md mt-4" />
        </div>
      </div>
    </div>
  );
}
