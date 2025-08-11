import { VenueGrid } from "@/components/venue-grid"
import { SearchFilters } from "@/components/search-filters"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Court</h1>
          <p className="text-gray-600">Book local sports venues instantly</p>
        </div>
        <SearchFilters />
        <VenueGrid />
      </main>
    </div>
  )
}
