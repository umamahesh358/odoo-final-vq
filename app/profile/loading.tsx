export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
