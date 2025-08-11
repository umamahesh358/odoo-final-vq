"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera, Mail, Phone, MapPin, Calendar, User, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface PersonalInfoSectionProps {
  onDataChange: () => void
}

export function PersonalInfoSection({ onDataChange }: PersonalInfoSectionProps) {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    role: profile?.role || user?.user_metadata?.role || "sports-enthusiast",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        role: profile.role || user?.user_metadata?.role || "sports-enthusiast",
      })
    }
  }, [profile, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    onDataChange()
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
        onDataChange()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        throw error
      }
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved successfully.",
      })
      setIsEditingRole(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "facility-owner":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "facility-owner":
        return "Facility Owner"
      case "admin":
        return "Administrator"
      case "sports-enthusiast":
      default:
        return "Sports Enthusiast"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={avatarPreview || profile?.avatar_url || "/placeholder.svg?height=96&width=96"}
                alt={profile?.full_name || "User"}
              />
              <AvatarFallback className="text-xl">{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors shadow-lg"
            >
              <Camera className="h-4 w-4" />
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{profile?.full_name || "User"}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getRoleBadgeColor(formData.role)}>{getRoleDisplayName(formData.role)}</Badge>
              {!isEditingRole && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingRole(true)} className="h-6 px-2 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Change
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Member since{" "}
              {new Date(profile?.created_at || user?.created_at || "").toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Role Selection (when editing) */}
        {isEditingRole && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sports-enthusiast">Sports Enthusiast</SelectItem>
                      <SelectItem value="facility-owner">Facility Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    This determines what features and sections you'll see in your dashboard.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Save Role
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingRole(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="email" value={user?.email || ""} disabled className="pl-10 bg-gray-50" />
              <Button variant="link" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">
                Change
              </Button>
            </div>
            <p className="text-xs text-gray-500">Email changes require verification</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Account created:</span>
              <span className="font-medium">
                {new Date(user?.created_at || "").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-xs">{user?.id?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
