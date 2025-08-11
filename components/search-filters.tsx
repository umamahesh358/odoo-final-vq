"use client"

import { useState } from "react"
import { MapPin, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

const cities = ["Bangalore", "Mumbai", "Chennai", "Hyderabad", "Delhi", "Pune", "Kolkata", "Ahmedabad"]

const sports = ["Basketball", "Tennis", "Badminton", "Football", "Cricket", "Volleyball", "Swimming", "Table Tennis"]

export function SearchFilters() {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  return (
    <div className="mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
        {/* Location Dropdown */}
        <div className="flex-1 min-w-64">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="h-12">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Select Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sport Selection */}
        <div className="flex-1 min-w-64">
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport.toLowerCase()}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <div className="flex-1 min-w-48">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              className="pl-10 h-12"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Search Courts Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courts, venues, or facilities..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {selectedSports.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSports.map((sport) => (
            <Badge key={sport} variant="secondary" className="gap-1">
              {sport}
              <button
                onClick={() => toggleSport(sport)}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Separate Filters Sidebar Component
export function FiltersSidebar() {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)

  const sports = ["Badminton", "Tennis", "Football", "Cricket", "Basketball", "Swimming", "Table Tennis"]

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  return (
    <div className="w-80 bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Sport Type */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Sport Type</h3>
        <div className="space-y-3">
          {sports.map((sport) => (
            <label key={sport} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                checked={selectedSports.includes(sport)}
                onChange={() => toggleSport(sport)}
              />
              <span className="text-sm">{sport}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Price Range</h3>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="mb-4" />
          <div className="text-sm text-gray-300">
            ₹{priceRange[0]} - ₹{priceRange[1]}/hour
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
              />
              <span className="text-sm">{rating}+ Stars</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Amenities</h3>
        <div className="space-y-3">
          {["Parking", "Washroom", "Drinking Water", "Equipment Rental", "Air Conditioning", "Changing Rooms"].map(
            (amenity) => (
              <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ),
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800"
        onClick={() => {
          setSelectedSports([])
          setPriceRange([0, 1000])
          setMinRating(0)
        }}
      >
        Clear All Filters
      </Button>
    </div>
  )
}
