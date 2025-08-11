"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Star, TrendingUp, Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface DashboardStats {
  upcomingBookings: number
  monthlyBookings: number
  savedVenues: number
}

interface RecentBooking {
  id: string
  venue_name: string
  booking_date: string
  status: string
  sport: string
  time_slots: string[]
}

interface RecommendedVenue {
  id: string
  name: string
  location: string
  rating: number
  price_per_hour: number
  image_url: string
  sports: string[]
}

export function UserDashboard() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    monthlyBookings: 0,
    savedVenues: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [recommendedVenues, setRecommendedVenues] = useState<RecommendedVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // Get bookings data
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, venues(name)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (bookings) {
        const upcoming = bookings.filter((b) => new Date(b.booking_date) >= today && b.status !== "cancelled")
        const thisMonth = bookings.filter((b) => new Date(b.created_at) >= firstDayOfMonth)

        setStats({
          upcomingBookings: upcoming.length,
          monthlyBookings: thisMonth.length,
          savedVenues: 3, // Mock data - would come from favorites table
        })

        // Set recent bookings
        const recent = bookings.slice(0, 3).map((booking) => ({
          id: booking.id,
          venue_name: booking.venues?.name || "Unknown Venue",
          booking_date: booking.booking_date,
          status: booking.status,
          sport: booking.sport,
          time_slots: booking.time_slots,
        }))
        setRecentBookings(recent)
      }

      // Fetch recommended venues
      const { data: venues } = await supabase.from("venues").select("*").order("rating", { ascending: false }).limit(4)

      if (venues) {
        setRecommendedVenues(venues)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set mock data on error
      setStats({ upcomingBookings: 2, monthlyBookings: 5, savedVenues: 3 })
      setRecentBookings([])
      setRecommendedVenues([])
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-gray-600">Ready to book your next game?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats.upcomingBookings}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-green-600">{stats.monthlyBookings}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Venues</p>
                <p className="text-3xl font-bold text-purple-600">{stats.savedVenues}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Find & Book CTA */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Find & Book Courts</h2>
          <p className="text-blue-100 mb-6">Discover amazing sports venues near you and book instantly</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => router.push("/")}>
            <MapPin className="h-5 w-5 mr-2" />
            Explore Venues
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Recent Bookings</h2>
            <Button variant="outline" size="sm" onClick={() => router.push("/bookings")}>
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.venue_name}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.time_slots.join(", ")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.sport}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent bookings</p>
                  <Button className="mt-4" onClick={() => router.push("/")}>
                    Book Your First Venue
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recommended Venues */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recommended Venues</h2>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedVenues.length > 0 ? (
              recommendedVenues.map((venue) => (
                <Card key={venue.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={venue.image_url || "/placeholder.svg?height=120&width=200&text=Venue"}
                      alt={venue.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      {venue.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                      <span className="text-sm font-bold">₹{venue.price_per_hour}/hr</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recommendations available</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
