// components/ui/EmailListSkeleton.tsx
export function EmailListSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
          >
            {/* Priority indicator bar skeleton */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 rounded-l-xl" />
            
            <div className="ml-2">
              {/* Header skeleton */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Subject skeleton */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-1" />
                    {/* Status badge skeleton */}
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </div>
                  
                  {/* Sender info skeleton */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                </div>
                
                {/* Date skeleton */}
                <div className="flex-shrink-0 text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              </div>

              {/* Email preview skeleton */}
              <div className="mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* ID badge skeleton */}
                  <div className="h-8 bg-gray-200 rounded-lg w-24" />
                  {/* Action buttons skeleton */}
                  <div className="flex gap-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-md" />
                  </div>
                </div>
                
                {/* Open button skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}