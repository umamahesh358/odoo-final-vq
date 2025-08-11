"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { BookingsContent } from "@/components/bookings-content"

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BookingsContent bookings={filteredBookings} />
    </div>
  )
}
