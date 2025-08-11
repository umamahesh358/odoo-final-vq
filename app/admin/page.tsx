"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/header"
import { AdminContent } from "@/components/admin-content"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }

    // Check if user has admin role
    if (!loading && user && user.user_metadata?.role !== "admin") {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user || user.user_metadata?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminContent />
    </div>
  )
}
