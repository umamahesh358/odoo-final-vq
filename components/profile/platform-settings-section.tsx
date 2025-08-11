"use client"

import { Shield, Users, Building, Settings, BarChart3, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface PlatformSettingsSectionProps {
  onDataChange: () => void
}

export function PlatformSettingsSection({ onDataChange }: PlatformSettingsSectionProps) {
  const platformStats = {
    totalUsers: 1250,
    activeFacilities: 45,
    pendingApprovals: 3,
    monthlyRevenue: 240000,
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{platformStats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{platformStats.activeFacilities}</div>
              <div className="text-sm text-gray-600">Active Facilities</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{platformStats.pendingApprovals}</div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ₹{(platformStats.monthlyRevenue / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
            </div>
            <Switch onCheckedChange={() => onDataChange()} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-approve Facilities</h4>
              <p className="text-sm text-gray-600">Automatically approve new facility registrations</p>
            </div>
            <Switch onCheckedChange={() => onDataChange()} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Send system notifications via email</p>
            </div>
            <Switch defaultChecked onCheckedChange={() => onDataChange()} />
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Manage Users</h4>
                <p className="text-sm text-gray-600">View and manage all platform users</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Role Management</h4>
                <p className="text-sm text-gray-600">Assign and modify user roles</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Banned Users</h4>
                <p className="text-sm text-gray-600">View and manage banned accounts</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">User Reports</h4>
                <p className="text-sm text-gray-600">Review user-reported issues</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Facility Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Facility Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Pending Approvals</h4>
                <p className="text-sm text-gray-600">3 facilities waiting for approval</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Action Required
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline">View All Facilities</Button>
              <Button variant="outline">Facility Analytics</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
