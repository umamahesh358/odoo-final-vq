"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, Calendar, MapPin, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"

interface Booking {
  id: string
  venue_name: string
  booking_date: string
  time_slots: string[]
  sport: string
  status: string
  final_amount: number
  booking_id: string
  location: string
}

export function BookingHistorySection() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 5

  useEffect(() => {
    if (user) {
      fetchBookingHistory()
    }
  }, [user])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venues (
            name,
            location
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching booking history:", error)
        // Set mock data on error
        setBookings([
          {
            id: "1",
            venue_name: "Ace Sports Complex",
            booking_date: "2024-01-15",
            time_slots: ["10:00", "11:00"],
            sport: "Basketball",
            status: "completed",
            final_amount: 1600,
            booking_id: "QC123456",
            location: "Koramangala, Bangalore",
          },
          {
            id: "2",
            venue_name: "Green Valley Courts",
            booking_date: "2024-01-10",
            time_slots: ["14:00"],
            sport: "Tennis",
            status: "confirmed",
            final_amount: 800,
            booking_id: "QC123457",
            location: "Indiranagar, Bangalore",
          },
        ])
        return
      }

      const formattedBookings =
        data?.map((booking) => ({
          id: booking.id,
          venue_name: booking.venues?.name || "Unknown Venue",
          booking_date: booking.booking_date,
          time_slots: booking.time_slots,
          sport: booking.sport,
          status: booking.status,
          final_amount: booking.final_amount,
          booking_id: booking.booking_id,
          location: booking.venues?.location || "Unknown Location",
        })) || []

      setBookings(formattedBookings)
    } catch (error) {
      console.error("Error fetching booking history:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportBookingHistory = () => {
    // Create CSV content
    const headers = ["Booking ID", "Venue", "Date", "Time", "Sport", "Status", "Amount"]
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.booking_id,
          booking.venue_name,
          booking.booking_date,
          booking.time_slots.join(";"),
          booking.sport,
          booking.status,
          booking.final_amount,
        ].join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "booking-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
  const startIndex = (currentPage - 1) * bookingsPerPage
  const endIndex = startIndex + bookingsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking History
          </CardTitle>
          <Button onClick={exportBookingHistory} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.venue_name}</h3>
                      <p className="text-sm text-gray-600">Booking ID: {booking.booking_id}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{booking.time_slots.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{booking.sport}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="font-semibold text-lg">₹{booking.final_amount}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {booking.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Download Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
              {searchTerm || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length}{" "}
              bookings
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
