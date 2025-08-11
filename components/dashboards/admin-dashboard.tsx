"use client"

import { useState, useEffect } from "react"
import { Users, Building, Calendar, DollarSign, CheckCircle, Clock, TrendingUp, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface AdminStats {
  totalUsers: number
  activeFacilities: number
  dailyBookings: number
  platformRevenue: number
}

interface PendingFacility {
  id: string
  name: string
  location: string
  owner: string
  submitted: string
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  joined: string
}

export function AdminDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1250,
    activeFacilities: 45,
    dailyBookings: 156,
    platformRevenue: 240000,
  })
  const [pendingFacilities, setPendingFacilities] = useState<PendingFacility[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAdminData()
    }
  }, [user])

  const fetchAdminData = async () => {
    try {
      // Mock data for pending facilities
      setPendingFacilities([
        {
          id: "1",
          name: "Elite Sports Complex",
          location: "Koramangala, Bangalore",
          owner: "Rajesh Kumar",
          submitted: "2 hours ago",
        },
        {
          id: "2",
          name: "Victory Courts",
          location: "Indiranagar, Bangalore",
          owner: "Priya Sharma",
          submitted: "1 day ago",
        },
      ])

      // Mock data for recent users
      setRecentUsers([
        {
          id: "1",
          name: "Amit Patel",
          email: "amit@example.com",
          role: "sports-enthusiast",
          joined: "5 minutes ago",
        },
        {
          id: "2",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "facility-owner",
          joined: "1 hour ago",
        },
        {
          id: "3",
          name: "David Chen",
          email: "david@example.com",
          role: "sports-enthusiast",
          joined: "3 hours ago",
        },
      ])
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "facility-owner":
        return "bg-blue-100 text-blue-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const handleApproveFacility = (facilityId: string) => {
    setPendingFacilities((prev) => prev.filter((f) => f.id !== facilityId))
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview 📊</h1>
        <p className="text-gray-600">Monitor and manage the QuickCourt platform</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Facilities</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeFacilities}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Bookings</p>
                <p className="text-3xl font-bold text-purple-600">{stats.dailyBookings}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-orange-600">₹{(stats.platformRevenue / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
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
            <Button className="h-16 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Facilities
            </Button>
            <Button variant="outline" className="h-16 bg-transparent">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-16 bg-transparent">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingFacilities.length > 0 ? (
                pendingFacilities.map((facility) => (
                  <div key={facility.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{facility.location}</p>
                    <p className="text-sm text-gray-600 mb-3">Owner: {facility.owner}</p>
                    <p className="text-xs text-gray-500 mb-3">Submitted {facility.submitted}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveFacility(facility.id)}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending approvals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Joined {user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
