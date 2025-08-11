"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Edit3, Camera, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    upcomingBookings: 0,
    favoriteVenues: 0,
    totalSpent: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()

  const [editedProfile, setEditedProfile] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    favorite_sports: profile?.favorite_sports || [],
  })

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        favorite_sports: profile.favorite_sports || [],
      })
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchUserStats()
      fetchRecentActivity()
    }
  }, [user])

  const fetchUserStats = async () => {
    if (!user) return

    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("status, final_amount, booking_date")
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching stats:", error)
        // Set default stats if table doesn't exist
        setStats({
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          upcomingBookings: 0,
          favoriteVenues: 0,
          totalSpent: 0,
        })
        return
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const newStats = {
        totalBookings: bookings?.length || 0,
        completedBookings: bookings?.filter((b) => b.status === "completed").length || 0,
        cancelledBookings: bookings?.filter((b) => b.status === "cancelled").length || 0,
        upcomingBookings:
          bookings?.filter((b) => {
            const bookingDate = new Date(b.booking_date)
            bookingDate.setHours(0, 0, 0, 0)
            return bookingDate >= today && b.status !== "completed" && b.status !== "cancelled"
          }).length || 0,
        favoriteVenues: 0,
        totalSpent: bookings?.reduce((sum, b) => sum + (b.final_amount || 0), 0) || 0,
      }

      setStats(newStats)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats({
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        upcomingBookings: 0,
        favoriteVenues: 0,
        totalSpent: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          status,
          sport,
          booking_date,
          venues (name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching activity:", error)
        return
      }

      const activity =
        data?.map((booking) => ({
          action:
            booking.status === "completed" ? "Completed" : booking.status === "cancelled" ? "Cancelled" : "Booked",
          venue: booking.venues?.name || "Unknown Venue",
          date: new Date(booking.booking_date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          sport: booking.sport,
        })) || []

      setRecentActivity(activity)
    } catch (error) {
      console.error("Error fetching activity:", error)
    }
  }

  const handleSave = async () => {
    const { error } = await updateProfile(editedProfile)

    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      favorite_sports: profile?.favorite_sports || [],
    })
    setIsEditing(false)
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2 w-1/4" />
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/2" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded" />
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={profile?.avatar_url || "/placeholder.svg?height=96&width=96"}
                      alt={profile?.full_name || "User"}
                    />
                    <AvatarFallback className="text-lg">{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-semibold mb-1">{profile?.full_name || "User"}</h2>
                <p className="text-gray-600 mb-4">
                  Member since{" "}
                  {new Date(profile?.created_at || "").toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{profile?.location || "Not provided"}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-transparent" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Favorite Sports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(profile?.favorite_sports || []).length > 0 ? (
                  profile?.favorite_sports?.map((sport) => (
                    <Badge key={sport} variant="secondary">
                      {sport}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No favorite sports selected</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{stats.totalBookings}</div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.completedBookings}</div>
                    <p className="text-sm text-gray-600">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{stats.upcomingBookings}</div>
                    <p className="text-sm text-gray-600">Upcoming</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</div>
                    <p className="text-sm text-gray-600">Cancelled</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.favoriteVenues}</div>
                    <p className="text-sm text-gray-600">Favorite Venues</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.action === "Completed"
                                ? "bg-green-500"
                                : activity.action === "Booked"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {activity.action} at {activity.venue}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.sport} • {activity.date}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <div className="mt-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Booking confirmations</span>
                        </label>
                        <label className="flex items-center space-x-2 mt-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Promotional offers</span>
                        </label>
                        <label className="flex items-center space-x-2 mt-2">
                          <input type="checkbox" />
                          <span className="text-sm">Venue recommendations</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="privacy">Privacy Settings</Label>
                      <div className="mt-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Show booking history</span>
                        </label>
                        <label className="flex items-center space-x-2 mt-2">
                          <input type="checkbox" />
                          <span className="text-sm">Allow friend requests</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="mr-2">Save Settings</Button>
                    <Button variant="outline">Reset to Default</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedProfile.full_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
