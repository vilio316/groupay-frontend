export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="block rounded-full animate-spin border-2 border-green border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-card-border rounded-xl bg-white overflow-hidden">
      <div className="h-44 bg-mist/20 animate-pulse" />
      <div className="p-3 space-y-3">
        <div className="h-4 bg-mist/20 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-mist/10 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-mist/10 rounded animate-pulse w-full" />
        <div className="flex justify-between items-center pt-1">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-mist/20 animate-pulse border-2 border-white"
              />
            ))}
          </div>
          <div className="w-5 h-5 bg-mist/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function BalanceSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 bg-mist/20 rounded animate-pulse w-1/4" />
      <div className="h-10 bg-mist/10 rounded animate-pulse w-1/2" />
      <div className="flex gap-2">
        <div className="h-8 bg-mist/20 rounded-xl animate-pulse flex-1" />
        <div className="h-8 bg-mist/20 rounded-xl animate-pulse flex-1" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-card-border rounded-xl bg-white"
        >
          <div className="w-10 h-10 rounded-full bg-mist/20 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-mist/20 rounded animate-pulse w-3/4" />
            <div className="h-2 bg-mist/10 rounded animate-pulse w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-full space-y-4">
      <div className="h-8 bg-mist/20 rounded animate-pulse w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
