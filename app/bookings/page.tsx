"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Filter, Download, Calendar, Clock, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  venue_name: string
  sport_type: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  created_at: string
  venue_location?: string
  payment_method?: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  const mockBookings: Booking[] = [
    {
      id: "1",
      venue_name: "City Sports Complex",
      sport_type: "Basketball",
      booking_date: "2024-01-15",
      start_time: "14:00",
      end_time: "16:00",
      total_amount: 50,
      status: "confirmed",
      created_at: "2024-01-10T10:00:00Z",
      venue_location: "Downtown District",
      payment_method: "Credit Card",
    },
    {
      id: "2",
      venue_name: "Tennis Center Pro",
      sport_type: "Tennis",
      booking_date: "2024-01-20",
      start_time: "09:00",
      end_time: "10:30",
      total_amount: 35,
      status: "pending",
      created_at: "2024-01-12T15:30:00Z",
      venue_location: "Sports District",
      payment_method: "PayPal",
    },
    {
      id: "3",
      venue_name: "Badminton Arena",
      sport_type: "Badminton",
      booking_date: "2024-01-08",
      start_time: "18:00",
      end_time: "19:00",
      total_amount: 25,
      status: "completed",
      created_at: "2024-01-05T12:00:00Z",
      venue_location: "East Side",
      payment_method: "Credit Card",
    },
    {
      id: "4",
      venue_name: "Football Ground",
      sport_type: "Football",
      booking_date: "2024-01-25",
      start_time: "16:00",
      end_time: "18:00",
      total_amount: 80,
      status: "cancelled",
      created_at: "2024-01-14T09:15:00Z",
      venue_location: "North Park",
      payment_method: "Bank Transfer",
    },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    if (user) {
      fetchBookings()
    }
  }, [user, loading, router])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)

      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venues (
            name,
            location,
            sport_type
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.log("Using mock data for bookings")
        setBookings(mockBookings)
        setFilteredBookings(mockBookings)
      } else {
        // Transform Supabase data to match our interface
        const transformedBookings =
          data?.map((booking) => ({
            id: booking.id,
            venue_name: booking.venues?.name || "Unknown Venue",
            sport_type: booking.venues?.sport_type || "Unknown Sport",
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            total_amount: booking.total_amount,
            status: booking.status,
            created_at: booking.created_at,
            venue_location: booking.venues?.location,
            payment_method: booking.payment_method,
          })) || []

        setBookings(transformedBookings)
        setFilteredBookings(transformedBookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      // Fallback to mock data
      setBookings(mockBookings)
      setFilteredBookings(mockBookings)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.sport_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.venue_location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, bookings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Venue", "Sport", "Date", "Time", "Amount", "Status", "Location"].join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.venue_name,
          booking.sport_type,
          booking.booking_date,
          `${booking.start_time}-${booking.end_time}`,
          `$${booking.total_amount}`,
          booking.status,
          booking.venue_location || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bookings.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Your bookings have been exported to CSV.",
    })
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Manage and track your venue bookings</p>
            </div>
          </div>
          <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by venue, sport, or location..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "You haven't made any bookings yet. Start by browsing available venues."}
                </p>
                <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                  Browse Venues
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.venue_name}</h3>
                          <p className="text-blue-600 font-medium">{booking.sport_type}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.booking_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </span>
                        </div>
                        {booking.venue_location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.venue_location}</span>
                          </div>
                        )}
                        {booking.payment_method && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>{booking.payment_method}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${booking.total_amount}</p>
                        <p className="text-sm text-gray-500">Total Amount</p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "confirmed" && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                        {booking.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-gray-600">Page 1 of 1</span>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
