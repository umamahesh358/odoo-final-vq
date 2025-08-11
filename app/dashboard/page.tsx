"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { UserDashboard } from "@/components/dashboards/user-dashboard"
import { OwnerDashboard } from "@/components/dashboards/owner-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DashboardSkeleton />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderDashboard = () => {
    switch (profile?.role) {
      case "facility_owner":
        return <OwnerDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <UserDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderDashboard()}
    </div>
  )
}
