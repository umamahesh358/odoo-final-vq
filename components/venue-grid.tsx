"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Wifi, Car, Droplets, AlertCircle, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VenueBooking } from "./venue-booking"
import { supabase, testConnection } from "@/lib/supabase-client"
import type { Venue } from "@/lib/supabase"
import Link from "next/link"

// Mock data as fallback
const mockVenues: Venue[] = [
  {
    id: "1",
    name: "Ace Sports Complex",
    location: "Koramangala, Bangalore",
    description: "Modern sports complex with state-of-the-art facilities",
    image_url: "/modern-sports-complex.png",
    rating: 4.8,
    review_count: 124,
    price_per_hour: 800,
    amenities: ["Parking", "Wifi", "Washroom", "Equipment"],
    sports: ["Basketball", "Tennis", "Badminton"],
    contact_phone: "+91 98765 43210",
    contact_email: "info@acesports.com",
    address: "123 Koramangala Ring Road, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Green Valley Courts",
    location: "Indiranagar, Bangalore",
    description: "Premium outdoor courts with professional lighting",
    image_url: "/outdoor-tennis-courts.png",
    rating: 4.6,
    review_count: 89,
    price_per_hour: 600,
    amenities: ["Parking", "Washroom"],
    sports: ["Tennis", "Cricket"],
    contact_phone: "+91 98765 43211",
    contact_email: "contact@greenvalley.com",
    address: "456 Indiranagar Main Road, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Urban Sports Hub",
    location: "HSR Layout, Bangalore",
    description: "Indoor multi-sport facility with air conditioning",
    image_url: "/indoor-basketball-court.png",
    rating: 4.9,
    review_count: 203,
    price_per_hour: 1200,
    amenities: ["Parking", "Wifi", "Washroom", "Equipment"],
    sports: ["Basketball", "Volleyball", "Badminton"],
    contact_phone: "+91 98765 43212",
    contact_email: "hello@urbansports.com",
    address: "789 HSR Layout Sector 1, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Sporting Arena",
    location: "Whitefield, Bangalore",
    description: "Affordable courts with basic amenities",
    image_url: "/indoor-badminton-court.png",
    rating: 4.4,
    review_count: 67,
    price_per_hour: 500,
    amenities: ["Washroom", "Equipment"],
    sports: ["Badminton", "Tennis"],
    contact_phone: "+91 98765 43213",
    contact_email: "info@sportingarena.com",
    address: "321 Whitefield Main Road, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Champion Courts",
    location: "BTM Layout, Bangalore",
    description: "Outdoor sports facility with floodlights",
    image_url: "/outdoor-football-field.png",
    rating: 4.7,
    review_count: 156,
    price_per_hour: 900,
    amenities: ["Parking", "Washroom", "Wifi"],
    sports: ["Football", "Cricket"],
    contact_phone: "+91 98765 43214",
    contact_email: "contact@championcourts.com",
    address: "654 BTM Layout 2nd Stage, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Elite Sports Center",
    location: "Jayanagar, Bangalore",
    description: "Premium indoor facility with professional coaching",
    image_url: "/indoor-volleyball-court.png",
    rating: 4.5,
    review_count: 92,
    price_per_hour: 700,
    amenities: ["Parking", "Washroom"],
    sports: ["Volleyball", "Basketball"],
    contact_phone: "+91 98765 43215",
    contact_email: "info@elitesports.com",
    address: "987 Jayanagar 4th Block, Bangalore",
    availability_status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function VenueGrid() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      setError(null)

      // First test the connection
      const connectionOk = await testConnection()

      if (!connectionOk) {
        console.log("Database not available, using mock data")
        setVenues(mockVenues)
        setUsingMockData(true)
        return
      }

      // Try to fetch from database
      const { data, error } = await supabase.from("venues").select("*").order("rating", { ascending: false })

      if (error) {
        console.error("Error fetching venues:", error)

        // Check if it's a table not found error
        if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
          setError("Database tables not set up yet. Please run the SQL scripts in Supabase.")
        } else {
          setError(`Database error: ${error.message}`)
        }

        // Fallback to mock data
        setVenues(mockVenues)
        setUsingMockData(true)
        return
      }

      // Use database data if available, otherwise fallback to mock data
      if (data && data.length > 0) {
        setVenues(data)
        setUsingMockData(false)
      } else {
        setVenues(mockVenues)
        setUsingMockData(true)
      }
    } catch (error: any) {
      console.error("Error fetching venues:", error)
      setError(`Connection error: ${error.message}`)
      setVenues(mockVenues)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return <Car className="h-3 w-3" />
      case "wifi":
        return <Wifi className="h-3 w-3" />
      case "washroom":
        return <Droplets className="h-3 w-3" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="flex gap-2 mb-3">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-20" />
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
      {(error || usingMockData) && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Using demo data. Connect to Supabase to see live venue data."}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchVenues} className="bg-transparent">
                Retry Connection
              </Button>
              <Button variant="outline" size="sm" asChild className="bg-transparent">
                <Link href="/setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Database
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={venue.image_url || "/placeholder.svg?height=200&width=300&text=Sports+Venue"}
                alt={venue.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge
                  variant={venue.availability_status === "available" ? "default" : "secondary"}
                  className={venue.availability_status === "available" ? "bg-green-600" : ""}
                >
                  {venue.availability_status === "available" ? "Available" : "Limited"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{venue.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{venue.rating}</span>
                  <span className="text-sm text-gray-500">({venue.review_count})</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{venue.location}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {venue.sports.map((sport) => (
                  <Badge key={sport} variant="outline" className="text-xs">
                    {sport}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                {venue.amenities.slice(0, 3).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-1 text-gray-500">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs">{amenity}</span>
                  </div>
                ))}
                {venue.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">+{venue.amenities.length - 3} more</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">₹{venue.price_per_hour}</span>
                  <span className="text-sm text-gray-500">/hour</span>
                </div>
                <Button onClick={() => setSelectedVenue(venue)}>Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVenue && (
        <VenueBooking venue={selectedVenue} isOpen={!!selectedVenue} onClose={() => setSelectedVenue(null)} />
      )}
    </>
  )
}
