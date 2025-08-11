"use client"

import { useState } from "react"
import { Globe, Clock, DollarSign, Mail, MessageSquare, Sliders } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface PreferencesSectionProps {
  onDataChange: () => void
}

export function PreferencesSection({ onDataChange }: PreferencesSectionProps) {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "Asia/Kolkata",
    currency: "INR",
    emailBookingConfirmation: true,
    emailPromotions: false,
    emailRecommendations: true,
    smsBookingReminders: true,
    smsPromotions: false,
  })

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    onDataChange()
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी (Hindi)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "te", label: "తెలుగు (Telugu)" },
  ]

  const timezones = [
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  ]

  const currencies = [
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
  ]

  return (
    <div className="space-y-6">
      {/* General Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timezone
              </Label>
              <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Currency
              </Label>
              <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Booking Confirmations</h4>
              <p className="text-sm text-gray-600">Receive email confirmations for your bookings</p>
            </div>
            <Switch
              checked={preferences.emailBookingConfirmation}
              onCheckedChange={(checked) => handlePreferenceChange("emailBookingConfirmation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Promotional Offers</h4>
              <p className="text-sm text-gray-600">Get notified about special deals and discounts</p>
            </div>
            <Switch
              checked={preferences.emailPromotions}
              onCheckedChange={(checked) => handlePreferenceChange("emailPromotions", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Venue Recommendations</h4>
              <p className="text-sm text-gray-600">Receive personalized venue suggestions</p>
            </div>
            <Switch
              checked={preferences.emailRecommendations}
              onCheckedChange={(checked) => handlePreferenceChange("emailRecommendations", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Booking Reminders</h4>
              <p className="text-sm text-gray-600">Get SMS reminders before your bookings</p>
            </div>
            <Switch
              checked={preferences.smsBookingReminders}
              onCheckedChange={(checked) => handlePreferenceChange("smsBookingReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Promotional Messages</h4>
              <p className="text-sm text-gray-600">Receive promotional SMS messages</p>
            </div>
            <Switch
              checked={preferences.smsPromotions}
              onCheckedChange={(checked) => handlePreferenceChange("smsPromotions", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
