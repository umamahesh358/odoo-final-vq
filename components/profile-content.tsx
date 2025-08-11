"use client"

import { useState } from "react"
import { ArrowLeft, User, Calendar, Settings, HelpCircle, Building, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { PersonalInfoSection } from "@/components/profile/personal-info-section"
import { BookingHistorySection } from "@/components/profile/booking-history-section"
import { PreferencesSection } from "@/components/profile/preferences-section"
import { HelpSupportSection } from "@/components/profile/help-support-section"
import { MyFacilitySection } from "@/components/profile/my-facility-section"
import { PlatformSettingsSection } from "@/components/profile/platform-settings-section"

export function ProfileContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")

  const userRole = user?.user_metadata?.role || "sports-enthusiast"

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "bookings", label: "Booking History", icon: Calendar },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    ...(userRole === "facility-owner" ? [{ id: "facility", label: "My Facility", icon: Building }] : []),
    ...(userRole === "admin" ? [{ id: "platform", label: "Platform Settings", icon: Shield }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Choose a section to manage</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                <TabsList className="grid w-full grid-rows-6 h-auto bg-transparent p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="w-full justify-start px-4 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-r-2 data-[state=active]:border-blue-600"
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="personal" className="mt-0">
              <PersonalInfoSection />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <BookingHistorySection />
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <PreferencesSection />
            </TabsContent>

            <TabsContent value="help" className="mt-0">
              <HelpSupportSection />
            </TabsContent>

            {userRole === "facility-owner" && (
              <TabsContent value="facility" className="mt-0">
                <MyFacilitySection />
              </TabsContent>
            )}

            {userRole === "admin" && (
              <TabsContent value="platform" className="mt-0">
                <PlatformSettingsSection />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
