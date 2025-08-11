"use client"

import { User, Settings, History, Sliders, HelpCircle, Building, Shield, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

interface ProfileSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function ProfileSidebar({ activeSection, onSectionChange }: ProfileSidebarProps) {
  const { user, profile } = useAuth()

  // Get user role for conditional menu items
  const userRole = profile?.role || user?.user_metadata?.role || "sports-enthusiast"

  const menuItems = [
    { id: "personal-info", label: "Personal Info", icon: User },
    { id: "account-settings", label: "Account Settings", icon: Settings },
    { id: "booking-history", label: "Booking History", icon: History },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "help-support", label: "Help & Support", icon: HelpCircle },
  ]

  // Add role-specific menu items
  if (userRole === "facility-owner") {
    menuItems.splice(4, 0, { id: "my-facility", label: "My Facility", icon: Building })
  }

  if (userRole === "admin") {
    menuItems.splice(4, 0, { id: "platform-settings", label: "Platform Settings", icon: Shield })
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        {/* Profile Picture Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={profile?.avatar_url || "/placeholder.svg?height=80&width=80"}
                alt={profile?.full_name || "User"}
              />
              <AvatarFallback className="text-lg">{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 bg-white">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="font-semibold text-gray-900 mt-3">{profile?.full_name || "User"}</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
