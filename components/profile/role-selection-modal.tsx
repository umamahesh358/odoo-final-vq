"use client"

import { useState } from "react"
import { Users, Building, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RoleSelectionModalProps {
  isOpen: boolean
  onRoleSelect: (role: string) => void
  onClose: () => void
}

export function RoleSelectionModal({ isOpen, onRoleSelect, onClose }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roles = [
    {
      id: "sports-enthusiast",
      title: "Sports Enthusiast",
      description: "I want to book and play at sports facilities",
      icon: Users,
      features: [
        "Browse and book venues",
        "Manage your bookings",
        "Save favorite venues",
        "Rate and review facilities",
        "Get personalized recommendations",
      ],
      color: "bg-blue-50 border-blue-200 hover:border-blue-300",
    },
    {
      id: "facility-owner",
      title: "Facility Owner",
      description: "I own or manage sports facilities",
      icon: Building,
      features: [
        "List and manage your facilities",
        "Handle bookings and payments",
        "View analytics and reports",
        "Manage court schedules",
        "Communicate with customers",
      ],
      color: "bg-green-50 border-green-200 hover:border-green-300",
    },
  ]

  const handleSubmit = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)
    try {
      await onRoleSelect(selectedRole)
    } catch (error) {
      console.error("Error selecting role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to QuickCourt!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Let's set up your account. Choose your role to get started:
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${role.color} ${
                  isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${isSelected ? "bg-blue-600 text-white" : "bg-white"}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{role.title}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-blue-600 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">What you can do:</h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
