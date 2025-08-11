export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />

          {/* Contact Support Cards */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center p-6 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-3 w-3/4 mx-auto" />
                  <div className="h-8 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="flex gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded w-20" />
              <div className="h-10 bg-gray-200 rounded w-20" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
