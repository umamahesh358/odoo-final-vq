"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, MoreVertical, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import type { Booking } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function BookingsList() {
  const [bookings, setBookings] = useState<{
    upcoming: Booking[]
    past: Booking[]
    cancelled: Booking[]
  }>({
    upcoming: [],
    past: [],
    cancelled: [],
  })
  const [cancelBooking, setCancelBooking] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
        *,
        venues (
          name,
          location,
          contact_phone
        )
      `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching bookings:", error)
        // Set empty bookings if table doesn't exist
        setBookings({
          upcoming: [],
          past: [],
          cancelled: [],
        })
        return
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const categorizedBookings = {
        upcoming: [] as Booking[],
        past: [] as Booking[],
        cancelled: [] as Booking[],
      }

      data?.forEach((booking) => {
        const bookingDate = new Date(booking.booking_date)
        bookingDate.setHours(0, 0, 0, 0)

        if (booking.status === "cancelled") {
          categorizedBookings.cancelled.push(booking)
        } else if (bookingDate >= today && booking.status !== "completed") {
          categorizedBookings.upcoming.push(booking)
        } else {
          categorizedBookings.past.push(booking)
        }
      })

      setBookings(categorizedBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setBookings({
        upcoming: [],
        past: [],
        cancelled: [],
      })
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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      if (error) {
        throw error
      }

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      })

      fetchBookings() // Refresh the list
    } catch (error: any) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancelBooking(null)
    }
  }

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{booking.venues?.name}</h3>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{booking.venues?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                {booking.venues?.contact_phone && (
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Venue
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                {booking.status === "confirmed" && (
                  <DropdownMenuItem className="text-red-600" onClick={() => setCancelBooking(booking.id)}>
                    Cancel Booking
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{booking.time_slots.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Players</p>
              <p className="font-medium">{booking.player_count} people</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium text-lg">₹{booking.final_amount}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Booking ID: {booking.booking_id}</p>
            <p className="text-sm text-gray-500">Sport: {booking.sport}</p>
          </div>
          <div className="flex gap-2">
            {booking.status === "confirmed" && booking.venues?.contact_phone && (
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Venue
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({bookings.upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({bookings.past.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({bookings.cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {bookings.upcoming.length > 0 ? (
            bookings.upcoming.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming bookings</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/")}>
                Book a Venue
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {bookings.past.length > 0 ? (
            bookings.past.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No past bookings</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {bookings.cancelled.length > 0 ? (
            bookings.cancelled.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No cancelled bookings</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!cancelBooking} onOpenChange={() => setCancelBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone. You may be subject to
              cancellation charges as per the venue's policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelBooking && handleCancelBooking(cancelBooking)}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
