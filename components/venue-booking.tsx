"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import type { Venue, VenueAvailability } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface VenueBookingProps {
  venue: Venue
  isOpen: boolean
  onClose: () => void
}

export function VenueBooking({ venue, isOpen, onClose }: VenueBookingProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [selectedSport, setSelectedSport] = useState("")
  const [players, setPlayers] = useState(2)
  const [step, setStep] = useState(1)
  const [availability, setAvailability] = useState<VenueAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchAvailability()
    }
  }, [isOpen, selectedDate, venue.id])

  useEffect(() => {
    if (profile) {
      setBookingData((prev) => ({
        ...prev,
        name: profile.full_name || "",
        phone: profile.phone || "",
        email: user?.email || "",
      }))
    }
  }, [profile, user])

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from("venue_availability")
        .select("*")
        .eq("venue_id", venue.id)
        .eq("date", selectedDate)

      if (error) {
        console.error("Error fetching availability:", error)
        // Set default availability if table doesn't exist
        setAvailability([])
        return
      }

      setAvailability(data || [])
    } catch (error) {
      console.error("Error fetching availability:", error)
      setAvailability([])
    }
  }

  const isSlotAvailable = (slot: string) => {
    const slotAvailability = availability.find((a) => a.time_slot === slot)
    return slotAvailability ? slotAvailability.is_available : true
  }

  const toggleSlot = (slot: string) => {
    if (!isSlotAvailable(slot)) return

    setSelectedSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]))
  }

  const totalAmount = selectedSlots.length * venue.price_per_hour
  const platformFee = Math.round(totalAmount * 0.05)
  const finalAmount = totalAmount + platformFee

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      // Generate booking ID
      const { data: bookingIdData } = await supabase.rpc("generate_booking_id")
      const bookingId =
        bookingIdData ||
        `QC${Math.floor(Math.random() * 999999)
          .toString()
          .padStart(6, "0")}`

      // Create booking
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          venue_id: venue.id,
          booking_date: selectedDate,
          time_slots: selectedSlots,
          sport: selectedSport,
          player_count: players,
          total_amount: totalAmount,
          platform_fee: platformFee,
          final_amount: finalAmount,
          booking_id: bookingId,
          user_name: bookingData.name,
          user_phone: bookingData.phone,
          user_email: bookingData.email,
          special_notes: bookingData.notes,
          status: "confirmed",
          payment_status: "completed",
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update venue availability
      const availabilityUpdates = selectedSlots.map((slot) => ({
        venue_id: venue.id,
        date: selectedDate,
        time_slot: slot,
        is_available: false,
      }))

      await supabase.from("venue_availability").upsert(availabilityUpdates, {
        onConflict: "venue_id,date,time_slot",
        ignoreDuplicates: false,
      })

      toast({
        title: "Booking Confirmed!",
        description: `Your booking ${bookingId} has been confirmed.`,
      })

      onClose()
      router.push("/bookings")
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{venue.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {venue.location}
                <div className="flex items-center gap-1 ml-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{venue.rating}</span>
                  <span className="text-gray-500">({venue.review_count} reviews)</span>
                </div>
              </DialogDescription>
            </div>
            {step > 1 && (
              <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Select Sport</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.sports.map((sport) => (
                      <Button
                        key={sport}
                        variant={selectedSport === sport ? "default" : "outline"}
                        onClick={() => setSelectedSport(sport)}
                      >
                        {sport}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="date" className="text-base font-semibold">
                    Select Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Available Time Slots</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                      const isUnavailable = !isSlotAvailable(slot)
                      const isSelected = selectedSlots.includes(slot)

                      return (
                        <Button
                          key={slot}
                          variant={isSelected ? "default" : "outline"}
                          disabled={isUnavailable}
                          onClick={() => toggleSlot(slot)}
                          className={`h-12 ${isUnavailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {slot}
                          {isUnavailable && <span className="text-xs block">Booked</span>}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="players" className="text-base font-semibold">
                    Number of Players
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="outline" size="icon" onClick={() => setPlayers(Math.max(1, players - 1))}>
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{players}</span>
                    <Button variant="outline" size="icon" onClick={() => setPlayers(Math.min(20, players + 1))}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Booking Details</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requirements or notes"
                      value={bookingData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Payment Details</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Demo Mode</p>
                  <p className="text-green-700 text-sm">
                    This is a demo. Your booking will be confirmed without actual payment.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-4">Booking Summary</h4>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>

                  {selectedSport && (
                    <div className="flex justify-between">
                      <span>Sport:</span>
                      <span className="font-medium">{selectedSport}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Players:</span>
                    <span className="font-medium">{players}</span>
                  </div>

                  {selectedSlots.length > 0 && (
                    <div>
                      <span className="block mb-1">Time Slots:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedSlots.map((slot) => (
                          <Badge key={slot} variant="secondary" className="text-xs">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedSlots.length > 0 && (
                  <div className="border-t pt-3 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({selectedSlots.length}h):</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform fee:</span>
                      <span>₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>₹{finalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  {step === 1 && (
                    <Button
                      className="w-full"
                      disabled={selectedSlots.length === 0 || !selectedSport}
                      onClick={() => setStep(2)}
                    >
                      Continue to Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}

                  {step === 2 && (
                    <Button
                      className="w-full"
                      onClick={() => setStep(3)}
                      disabled={!bookingData.name || !bookingData.phone || !bookingData.email}
                    >
                      Continue to Payment
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}

                  {step === 3 && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleBooking}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : `Confirm Booking (₹${finalAmount})`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
