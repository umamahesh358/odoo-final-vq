import { DashboardContent } from "@/components/dashboard-content"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardContent />
    </div>
  )
}
