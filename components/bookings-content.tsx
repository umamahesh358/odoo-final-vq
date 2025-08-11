"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  venueName: string
  sport: string
  date: string
  time: string
  duration: number
  status: "upcoming" | "completed" | "cancelled"
  price: number
  location: string
  image: string
}

const mockBookings: Booking[] = [
  {
    id: "1",
    venueName: "Elite Sports Complex",
    sport: "Basketball",
    date: "2024-01-15",
    time: "18:00",
    duration: 2,
    status: "upcoming",
    price: 80,
    location: "Downtown Sports Center",
    image: "/indoor-basketball-court.png",
  },
  {
    id: "2",
    venueName: "Tennis Club Pro",
    sport: "Tennis",
    date: "2024-01-10",
    time: "14:00",
    duration: 1,
    status: "completed",
    price: 50,
    location: "Riverside Tennis Club",
    image: "/outdoor-tennis-courts.png",
  },
  {
    id: "3",
    venueName: "Badminton Arena",
    sport: "Badminton",
    date: "2024-01-08",
    time: "20:00",
    duration: 1.5,
    status: "cancelled",
    price: 40,
    location: "City Sports Hub",
    image: "/indoor-badminton-court.png",
  },
  {
    id: "4",
    venueName: "Football Ground",
    sport: "Football",
    date: "2024-01-05",
    time: "16:00",
    duration: 2,
    status: "completed",
    price: 100,
    location: "Municipal Sports Ground",
    image: "/outdoor-football-field.png",
  },
  {
    id: "5",
    venueName: "Volleyball Center",
    sport: "Volleyball",
    date: "2024-01-03",
    time: "19:00",
    duration: 1,
    status: "completed",
    price: 60,
    location: "Community Sports Center",
    image: "/indoor-volleyball-court.png",
  },
]

export function BookingsContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesSport = sportFilter === "all" || booking.sport.toLowerCase() === sportFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesSport
  })

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your booking history is being exported to CSV.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const sports = [...new Set(mockBookings.map((booking) => booking.sport))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Track and manage your venue bookings</p>
          </div>
          <Button onClick={handleExport} className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filter Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport.toLowerCase()}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setSportFilter("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-6">
        {paginatedBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" || sportFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You haven't made any bookings yet. Start by exploring venues!"}
              </p>
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                Browse Venues
              </Button>
            </CardContent>
          </Card>
        ) : (
          paginatedBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.venueName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{booking.venueName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.time} ({booking.duration}h)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">${booking.price}</div>
                        <div className="space-y-2">
                          {booking.status === "upcoming" && (
                            <>
                              <Button size="sm" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline" className="w-full md:w-auto bg-transparent">
                                Cancel Booking
                              </Button>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <>
                              <Button size="sm" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                                Book Again
                              </Button>
                              <Button size="sm" variant="outline" className="w-full md:w-auto bg-transparent">
                                Leave Review
                              </Button>
                            </>
                          )}
                          {booking.status === "cancelled" && (
                            <Button size="sm" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                              Book Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
