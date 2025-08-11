"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Users, Wifi, Car, Droplets } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VenueBooking } from "./venue-booking"

interface Venue {
  id: string
  name: string
  location: string
  image: string
  rating: number
  reviewCount: number
  pricePerHour: number
  sports: string[]
  amenities: string[]
  availability: "available" | "busy" | "closed"
}

const venues: Venue[] = [
  {
    id: "1",
    name: "SportZone Arena",
    location: "Koramangala, Bangalore",
    image: "/indoor-basketball-court.png",
    rating: 4.5,
    reviewCount: 128,
    pricePerHour: 200,
    sports: ["Badminton", "Tennis", "Table Tennis"],
    amenities: ["Parking", "Washroom", "Drinking Water"],
    availability: "available",
  },
  {
    id: "2",
    name: "PlayCourt Central",
    location: "Indiranagar, Bangalore",
    image: "/outdoor-football-field.png",
    rating: 4.2,
    reviewCount: 95,
    pricePerHour: 500,
    sports: ["Football", "Cricket", "Basketball"],
    amenities: ["Parking", "Changing Rooms", "Equipment Rental"],
    availability: "available",
  },
  {
    id: "3",
    name: "Elite Sports Complex",
    location: "Whitefield, Bangalore",
    image: "/modern-sports-complex.png",
    rating: 4.8,
    reviewCount: 203,
    pricePerHour: 800,
    sports: ["Swimming", "Tennis", "Badminton", "Basketball"],
    amenities: ["Parking", "Washroom", "Changing Rooms", "Equipment Rental", "Air Conditioning"],
    availability: "available",
  },
  {
    id: "4",
    name: "Victory Courts",
    location: "HSR Layout, Bangalore",
    image: "/outdoor-tennis-courts.png",
    rating: 4.3,
    reviewCount: 87,
    pricePerHour: 350,
    sports: ["Tennis", "Badminton"],
    amenities: ["Parking", "Washroom", "Drinking Water"],
    availability: "busy",
  },
  {
    id: "5",
    name: "Champions Arena",
    location: "Bandra, Mumbai",
    image: "/indoor-volleyball-court.png",
    rating: 4.6,
    reviewCount: 156,
    pricePerHour: 600,
    sports: ["Volleyball", "Basketball", "Badminton"],
    amenities: ["Parking", "Air Conditioning", "Changing Rooms"],
    availability: "available",
  },
  {
    id: "6",
    name: "Metro Sports Hub",
    location: "T. Nagar, Chennai",
    image: "/indoor-badminton-court.png",
    rating: 4.1,
    reviewCount: 74,
    pricePerHour: 300,
    sports: ["Badminton", "Table Tennis"],
    amenities: ["Washroom", "Drinking Water", "Equipment Rental"],
    availability: "available",
  },
]

export function VenueGrid() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return <Car className="h-3 w-3" />
      case "wifi":
        return <Wifi className="h-3 w-3" />
      case "drinking water":
        return <Droplets className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">Available</Badge>
      case "busy":
        return <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">Busy</Badge>
      case "closed":
        return <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">Closed</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={venue.image || "/placeholder.svg"}
                alt={venue.name}
                className="w-full aspect-video object-cover"
              />
              {getAvailabilityBadge(venue.availability)}

              {/* Rating and Price Overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{venue.rating}</span>
              </div>

              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                <span className="text-sm font-medium text-teal-400">From ₹{venue.pricePerHour}/hour</span>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{venue.name}</h3>
              </div>

              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{venue.location}</span>
              </div>

              {/* Sports Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {venue.sports.slice(0, 3).map((sport) => (
                  <Badge key={sport} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    {sport}
                  </Badge>
                ))}
                {venue.sports.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{venue.sports.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-2 mb-4">
                {venue.amenities.slice(0, 3).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-1 text-gray-500">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs">{amenity}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedVenue(venue)}>
                  View Details
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  onClick={() => setSelectedVenue(venue)}
                  disabled={venue.availability === "closed"}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedVenue && (
        <VenueBooking venue={selectedVenue} isOpen={!!selectedVenue} onClose={() => setSelectedVenue(null)} />
      )}
    </>
  )
}
