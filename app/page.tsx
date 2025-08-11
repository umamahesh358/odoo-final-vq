"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

const cities = ["Bangalore", "Mumbai", "Chennai", "Hyderabad", "Delhi", "Pune", "Kolkata", "Ahmedabad"]

const sports = ["Basketball", "Tennis", "Badminton", "Football", "Cricket", "Volleyball", "Swimming", "Table Tennis"]

const venues = [
  {
    id: 1,
    name: "SportZone Arena",
    location: "Koramangala, Bangalore",
    image: "/indoor-basketball-court.png",
    rating: 4.5,
    price: 200,
    sports: ["Basketball", "Tennis", "Badminton"],
    status: "Available",
    amenities: ["Air Conditioning", "Parking", "Changing Rooms"],
  },
  {
    id: 2,
    name: "PlayCourt Central",
    location: "Bandra, Mumbai",
    image: "/outdoor-tennis-courts.png",
    rating: 4.2,
    price: 500,
    sports: ["Tennis", "Cricket", "Football"],
    status: "Available",
    amenities: ["Parking", "Cafeteria", "Equipment Rental"],
  },
  {
    id: 3,
    name: "Elite Sports Complex",
    location: "Anna Nagar, Chennai",
    image: "/modern-sports-complex.png",
    rating: 4.8,
    price: 350,
    sports: ["Swimming", "Basketball", "Volleyball"],
    status: "Busy",
    amenities: ["Swimming Pool", "Gym", "Spa", "Parking"],
  },
  {
    id: 4,
    name: "Victory Courts",
    location: "Hitech City, Hyderabad",
    image: "/indoor-badminton-court.png",
    rating: 4.3,
    price: 180,
    sports: ["Badminton", "Table Tennis"],
    status: "Available",
    amenities: ["Air Conditioning", "Equipment Rental"],
  },
  {
    id: 5,
    name: "Champions Arena",
    location: "Connaught Place, Delhi",
    image: "/outdoor-football-field.png",
    rating: 4.6,
    price: 400,
    sports: ["Football", "Cricket"],
    status: "Closed",
    amenities: ["Floodlights", "Parking", "Changing Rooms"],
  },
  {
    id: 6,
    name: "Ace Sports Hub",
    location: "Koregaon Park, Pune",
    image: "/indoor-volleyball-court.png",
    rating: 4.4,
    price: 250,
    sports: ["Volleyball", "Basketball"],
    status: "Available",
    amenities: ["Air Conditioning", "Parking", "Cafeteria"],
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter states
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRating, setSelectedRating] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const [filteredVenues, setFilteredVenues] = useState(venues)

  const amenities = [
    "Air Conditioning",
    "Parking",
    "Changing Rooms",
    "Equipment Rental",
    "Cafeteria",
    "Swimming Pool",
    "Gym",
    "Spa",
    "Floodlights",
  ]

  useEffect(() => {
    let filtered = venues

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((venue) => venue.location.includes(selectedCity))
    }

    // Filter by sport
    if (selectedSport) {
      filtered = filtered.filter((venue) => venue.sports.includes(selectedSport))
    }

    // Filter by selected sports in sidebar
    if (selectedSports.length > 0) {
      filtered = filtered.filter((venue) => venue.sports.some((sport) => selectedSports.includes(sport)))
    }

    // Filter by price range
    filtered = filtered.filter((venue) => venue.price >= priceRange[0] && venue.price <= priceRange[1])

    // Filter by rating
    if (selectedRating) {
      const minRating = Number.parseFloat(selectedRating)
      filtered = filtered.filter((venue) => venue.rating >= minRating)
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((venue) => selectedAmenities.every((amenity) => venue.amenities.includes(amenity)))
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredVenues(filtered)
  }, [selectedCity, selectedSport, selectedSports, priceRange, selectedRating, selectedAmenities, searchQuery])

  const handleSportToggle = (sport: string) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const clearAllFilters = () => {
    setSelectedSports([])
    setPriceRange([0, 1000])
    setSelectedRating("")
    setSelectedAmenities([])
    setSearchQuery("")
    setSelectedCity("")
    setSelectedSport("")
    setSelectedDate("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "Busy":
        return "bg-orange-500"
      case "Closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Court</h1>
            <p className="text-xl text-gray-600">Book local sports venues instantly</p>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg border">
              <div className="flex-1">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Select City" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Secondary Search Row */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search courts, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Sport Type */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Sport Type</h3>
                  <div className="space-y-2">
                    {sports.map((sport) => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox
                          id={sport}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={() => handleSportToggle(sport)}
                          className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={sport} className="text-sm text-gray-300">
                          {sport}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={0}
                      step={50}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}/hour</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Rating</h3>
                  <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                    {["4.5", "4.0", "3.5", "3.0"].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={rating}
                          id={`rating-${rating}`}
                          className="border-gray-600 text-blue-600"
                        />
                        <Label htmlFor={`rating-${rating}`} className="text-sm text-gray-300 flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {rating}+ & above
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                          className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={amenity} className="text-sm text-gray-300">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Venue Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Venues ({filteredVenues.length})</h2>
            </div>

            {filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVenues.map((venue) => (
                  <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={venue.image || "/placeholder.svg"}
                        alt={venue.name}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />

                      {/* Status Badge */}
                      <Badge className={`absolute top-3 right-3 ${getStatusColor(venue.status)} text-white`}>
                        {venue.status}
                      </Badge>

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-2 py-1 rounded">
                        <span className="text-sm font-medium">From ₹{venue.price}/hour</span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{venue.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{venue.location}</p>

                      {/* Sports Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {venue.sports.map((sport) => (
                          <Badge key={sport} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
