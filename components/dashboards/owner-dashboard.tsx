"use client"

import { useState, useEffect } from "react"
import { DollarSign, Calendar, BarChart3, TrendingUp, Plus, Settings, Eye, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface OwnerStats {
  todayRevenue: number
  activeBookings: number
  courtOccupancy: number
  monthlyGrowth: number
}

interface RecentBooking {
  id: string
  customer_name: string
  court: string
  time: string
  status: string
  amount: number
}

export function OwnerDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<OwnerStats>({
    todayRevenue: 0,
    activeBookings: 0,
    courtOccupancy: 0,
    monthlyGrowth: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOwnerData()
    }
  }, [user])

  const fetchOwnerData = async () => {
    try {
      // Mock data for now - in real app, would fetch from owner's venues
      setStats({
        todayRevenue: 2400,
        activeBookings: 8,
        courtOccupancy: 78,
        monthlyGrowth: 15,
      })

      setRecentBookings([
        {
          id: "1",
          customer_name: "John Doe",
          court: "Court A",
          time: "10:00 AM",
          status: "confirmed",
          amount: 800,
        },
        {
          id: "2",
          customer_name: "Jane Smith",
          court: "Court B",
          time: "2:00 PM",
          status: "pending",
          amount: 600,
        },
        {
          id: "3",
          customer_name: "Mike Johnson",
          court: "Court C",
          time: "6:00 PM",
          status: "confirmed",
          amount: 1000,
        },
      ])
    } catch (error) {
      console.error("Error fetching owner data:", error)
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SportZone Arena Dashboard 🏟️</h1>
        <p className="text-gray-600">Manage your facility and track performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.todayRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeBookings}</p>
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
                <p className="text-sm font-medium text-gray-600">Court Occupancy</p>
                <p className="text-3xl font-bold text-purple-600">{stats.courtOccupancy}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-3xl font-bold text-orange-600">+{stats.monthlyGrowth}%</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add New Court
            </Button>
            <Button variant="outline" className="h-16 bg-transparent">
              <Settings className="h-5 w-5 mr-2" />
              Manage Facility
            </Button>
            <Button variant="outline" className="h-16 bg-transparent">
              <Eye className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer_name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.court} • {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                    <p className="text-sm font-medium text-gray-900 mt-1">₹{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Booking Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart integration placeholder</p>
                <p className="text-sm text-gray-400">Weekly booking trends would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
