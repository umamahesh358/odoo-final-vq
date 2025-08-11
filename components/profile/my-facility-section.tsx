"use client"

import { Building, Settings, BarChart3, Calendar, Users, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MyFacilitySection() {
  // Mock facility data - in real app, would fetch from user's facilities
  const facility = {
    name: "SportZone Arena",
    location: "Koramangala, Bangalore",
    status: "active",
    courts: 4,
    rating: 4.8,
    totalBookings: 156,
    monthlyRevenue: 45000,
  }

  return (
    <div className="space-y-6">
      {/* Facility Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Facility Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
              <p className="text-gray-600 mb-2">{facility.location}</p>
              <Badge className="bg-green-100 text-green-800">
                {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{facility.rating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{facility.courts}</div>
              <div className="text-sm text-gray-600">Total Courts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{facility.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">₹{facility.monthlyRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Manage Facility Details
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Plus className="h-5 w-5 mb-2" />
              Add New Court
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="h-5 w-5 mb-2" />
              Manage Bookings
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <BarChart3 className="h-5 w-5 mb-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-5 w-5 mb-2" />
              Customer Reviews
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Booking Analytics Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Analytics Dashboard</p>
              <p className="text-sm text-gray-400">Detailed booking analytics and insights</p>
              <Button className="mt-4 bg-transparent" variant="outline">
                View Full Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
