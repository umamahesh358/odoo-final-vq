"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserDashboard } from "./dashboards/user-dashboard"
import { OwnerDashboard } from "./dashboards/owner-dashboard"
import { AdminDashboard } from "./dashboards/admin-dashboard"
import { DashboardSkeleton } from "./dashboard-skeleton"

export function DashboardContent() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
        </div>
      </div>
    )
  }

  // Determine user role - check profile metadata or default to sports-enthusiast
  const userRole = profile?.role || user.user_metadata?.role || "sports-enthusiast"

  // Render appropriate dashboard based on role
  switch (userRole) {
    case "facility-owner":
      return <OwnerDashboard />
    case "admin":
      return <AdminDashboard />
    case "sports-enthusiast":
    default:
      return <UserDashboard />
  }
}
