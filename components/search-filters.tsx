"use client"

import { useState } from "react"
import { Filter, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export function SearchFilters() {
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const sports = ["Basketball", "Tennis", "Badminton", "Football", "Cricket", "Volleyball"]

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Enter location"
              className="pl-10"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 min-w-48">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              className="pl-10"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
              {selectedSports.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSports.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Venues</SheetTitle>
              <SheetDescription>Refine your search to find the perfect venue</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Sports</h3>
                <div className="grid grid-cols-2 gap-2">
                  {sports.map((sport) => (
                    <Button
                      key={sport}
                      variant={selectedSports.includes(sport) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSport(sport)}
                      className="justify-start"
                    >
                      {sport}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                    <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                    <SelectItem value="2000+">₹2000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-3">Amenities</h3>
                <div className="space-y-2">
                  {["Parking", "Washroom", "Drinking Water", "Equipment Rental"].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {selectedSports.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
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
