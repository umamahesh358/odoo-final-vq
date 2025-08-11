export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Welcome Section Skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section Skeleton */}
        <div className="bg-white p-8 rounded-lg border">
          <div className="text-center space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-10 bg-gray-200 rounded w-32 mx-auto" />
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
