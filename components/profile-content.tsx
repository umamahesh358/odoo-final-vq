"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileSidebar } from "./profile/profile-sidebar"
import { PersonalInfoSection } from "./profile/personal-info-section"
import { AccountSettingsSection } from "./profile/account-settings-section"
import { BookingHistorySection } from "./profile/booking-history-section"
import { PreferencesSection } from "./profile/preferences-section"
import { HelpSupportSection } from "./profile/help-support-section"
import { MyFacilitySection } from "./profile/my-facility-section"
import { PlatformSettingsSection } from "./profile/platform-settings-section"
import { RoleSelectionModal } from "./profile/role-selection-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ProfileContentProps {
  initialSection?: string
}

export function ProfileContent({ initialSection = "personal-info" }: ProfileContentProps) {
  const [activeSection, setActiveSection] = useState(initialSection)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Update active section when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection)
  }, [initialSection])

  // Check if user needs to select a role
  useEffect(() => {
    if (user && !profile?.role && !user.user_metadata?.role) {
      setShowRoleSelection(true)
    }
  }, [user, profile])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate save operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHasUnsavedChanges(false)
      toast({
        title: "Changes Saved",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRoleSelection = async (selectedRole: string) => {
    try {
      const { error } = await updateProfile({ role: selectedRole })
      if (error) {
        throw error
      }
      setShowRoleSelection(false)
      toast({
        title: "Role Selected",
        description: `You are now registered as a ${selectedRole.replace("-", " ")}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal-info":
        return <PersonalInfoSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "account-settings":
        return <AccountSettingsSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "booking-history":
        return <BookingHistorySection />
      case "preferences":
        return <PreferencesSection onDataChange={() => setHasUnsavedChanges(true)} />
      case "help-support":
        return <HelpSupportSection />
      case "my-facility":
        return <MyFacilitySection />
      case "platform-settings":
        return <PlatformSettingsSection onDataChange={() => setHasUnsavedChanges(true)} />
      default:
        return <PersonalInfoSection onDataChange={() => setHasUnsavedChanges(true)} />
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your profile</h1>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  Menu
                </Button>
              </div>
              {hasUnsavedChanges && (
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile unless menu is open */}
            <div className={`lg:col-span-1 ${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
              <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section)
                  setIsMobileMenuOpen(false) // Close mobile menu when section is selected
                  // Update URL without page reload
                  const url = new URL(window.location.href)
                  url.searchParams.set("section", section)
                  window.history.replaceState({}, "", url.toString())
                }}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{renderActiveSection()}</div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onRoleSelect={handleRoleSelection}
        onClose={() => setShowRoleSelection(false)}
      />
    </>
  )
}
