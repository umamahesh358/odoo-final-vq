"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  Building,
  DollarSign,
  Calendar,
  Eye,
  Ban,
  MessageSquare,
  RotateCcw,
  Check,
  X,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface KPIData {
  totalUsers: number
  activeFacilities: number
  dailyBookings: number
  platformRevenue: number
  userGrowth: number
  facilityGrowth: number
  bookingGrowth: number
  revenueGrowth: number
}

interface PendingFacility {
  id: string
  name: string
  owner: string
  location: string
  sport: string
  submittedDate: string
  images: string[]
  description: string
  pricing: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "banned" | "pending"
  joinDate: string
  lastActive: string
  bookings: number
}

const kpiData: KPIData = {
  totalUsers: 12847,
  activeFacilities: 342,
  dailyBookings: 156,
  platformRevenue: 89420,
  userGrowth: 12.5,
  facilityGrowth: 8.3,
  bookingGrowth: 15.7,
  revenueGrowth: 22.1,
}

const pendingFacilities: PendingFacility[] = [
  {
    id: "1",
    name: "Elite Basketball Arena",
    owner: "John Smith",
    location: "Downtown Sports District",
    sport: "Basketball",
    submittedDate: "2024-01-10",
    images: ["/indoor-basketball-court.png", "/modern-sports-complex.png"],
    description: "State-of-the-art basketball facility with professional-grade courts and modern amenities.",
    pricing: 80,
  },
  {
    id: "2",
    name: "Tennis Excellence Center",
    owner: "Sarah Johnson",
    location: "Riverside Tennis Club",
    sport: "Tennis",
    submittedDate: "2024-01-08",
    images: ["/outdoor-tennis-courts.png"],
    description: "Premium tennis courts with professional lighting and surface quality.",
    pricing: 60,
  },
]

const users: User[] = [
  {
    id: "1",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "sports-enthusiast",
    status: "active",
    joinDate: "2024-01-01",
    lastActive: "2024-01-12",
    bookings: 15,
  },
  {
    id: "2",
    name: "Lisa Chen",
    email: "lisa@example.com",
    role: "facility-owner",
    status: "active",
    joinDate: "2023-12-15",
    lastActive: "2024-01-11",
    bookings: 3,
  },
  {
    id: "3",
    name: "David Brown",
    email: "david@example.com",
    role: "sports-enthusiast",
    status: "banned",
    joinDate: "2023-11-20",
    lastActive: "2024-01-05",
    bookings: 8,
  },
]

export function AdminContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedFacility, setSelectedFacility] = useState<PendingFacility | null>(null)
  const [approvalReason, setApprovalReason] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [userFilter, setUserFilter] = useState("all")

  const handleApproveFacility = (facilityId: string) => {
    toast({
      title: "Facility Approved",
      description: "The facility has been approved and is now live on the platform.",
    })
  }

  const handleRejectFacility = (facilityId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Facility Rejected",
      description: "The facility owner has been notified of the rejection.",
    })
    setRejectionReason("")
  }

  const handleUserAction = (userId: string, action: string) => {
    const actionMessages = {
      ban: "User has been banned from the platform.",
      unban: "User has been unbanned and can access the platform again.",
      message: "Message sent to user successfully.",
      reset: "Password reset email sent to user.",
    }

    toast({
      title: "Action Completed",
      description: actionMessages[action as keyof typeof actionMessages],
    })
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesFilter = userFilter === "all" || user.status === userFilter || user.role === userFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "banned":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage platform operations and monitor key metrics</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="facilities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Facilities
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Users
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{kpiData.userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Facilities</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.activeFacilities}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{kpiData.facilityGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.dailyBookings}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{kpiData.bookingGrowth}%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${kpiData.platformRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{kpiData.revenueGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest actions and events on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New facility approved: Elite Basketball Arena</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">156 bookings completed today</p>
                    <p className="text-xs text-gray-600">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">2 facilities pending approval</p>
                    <p className="text-xs text-gray-600">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Facility Approvals</CardTitle>
              <CardDescription>Review and approve new facility submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingFacilities.map((facility) => (
                  <div key={facility.id} className="border rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Images */}
                      <div className="lg:w-1/3">
                        <div className="grid grid-cols-2 gap-2">
                          {facility.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`${facility.name} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="lg:w-2/3">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <strong>Owner:</strong> {facility.owner}
                              </p>
                              <p>
                                <strong>Location:</strong> {facility.location}
                              </p>
                              <p>
                                <strong>Sport:</strong> {facility.sport}
                              </p>
                              <p>
                                <strong>Pricing:</strong> ${facility.pricing}/hour
                              </p>
                              <p>
                                <strong>Submitted:</strong> {new Date(facility.submittedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>

                        <p className="text-gray-700 mb-4">{facility.description}</p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-green-600 hover:bg-green-700">
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Facility</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to approve "{facility.name}"? This will make it live on the
                                  platform.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Optional approval message..."
                                  value={approvalReason}
                                  onChange={(e) => setApprovalReason(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleApproveFacility(facility.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm Approval
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive">
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Facility</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting "{facility.name}".
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Reason for rejection (required)..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  required
                                />
                                <Button onClick={() => handleRejectFacility(facility.id)} variant="destructive">
                                  Confirm Rejection
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="sports-enthusiast">Sports Enthusiasts</SelectItem>
                    <SelectItem value="facility-owner">Facility Owners</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>

                      {user.status === "active" ? (
                        <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "ban")}>
                          <Ban className="h-3 w-3 mr-1" />
                          Ban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUserAction(user.id, "unban")}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Unban
                        </Button>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "message")}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "reset")}>
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
