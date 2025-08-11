"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Copy, ExternalLink, Database, Play } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { testConnection, checkTablesExist } from "@/lib/supabase-client"
import { DatabaseStatus } from "./database-status"

export function DatabaseSetupGuide() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [tablesStatus, setTablesStatus] = useState<"idle" | "checking" | "success" | "error">("idle")

  const testDatabaseConnection = async () => {
    setConnectionStatus("testing")
    const isConnected = await testConnection()
    setConnectionStatus(isConnected ? "success" : "error")

    if (isConnected) {
      setTablesStatus("checking")
      const tablesExist = await checkTablesExist()
      setTablesStatus(tablesExist ? "success" : "error")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "testing":
      case "checking":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <Database className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Setup Complete! 🎉</h1>
        <p className="text-gray-600">Your QuickCourt database is ready to use</p>
      </div>

      {/* Database Status */}
      <DatabaseStatus />

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(connectionStatus)}
            Database Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Project: <code className="bg-gray-100 px-2 py-1 rounded">ybnrjwhujzdlruxkfols</code>
              </p>
              <Badge variant={connectionStatus === "success" ? "default" : "secondary"}>
                {connectionStatus === "success"
                  ? "Connected"
                  : connectionStatus === "error"
                    ? "Connection Failed"
                    : connectionStatus === "testing"
                      ? "Testing..."
                      : "Not Tested"}
              </Badge>
            </div>
            <Button onClick={testDatabaseConnection} disabled={connectionStatus === "testing"}>
              <Play className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Alert>
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription>
          <strong>Setup Complete!</strong> Your database tables have been created and populated with sample data. You
          can now use all features of QuickCourt including venue browsing, booking, and user management.
        </AlertDescription>
      </Alert>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div>
                <h4 className="font-medium">Database Setup Complete</h4>
                <p className="text-sm text-gray-600">All tables created and sample data loaded</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Test the Application</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Go back to the home page and browse venues, create bookings, and test user features
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to Home Page
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Create User Account</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Sign up for a new account to test the full booking experience
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/auth">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Account
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Monitor Database</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Use Supabase dashboard to monitor your database and manage data
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://supabase.com/dashboard/project/ybnrjwhujzdlruxkfols"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Supabase Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Script */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Script</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Run this script in your Supabase SQL Editor to verify everything is working:
          </p>
          <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
            <div className="flex items-center justify-between">
              <span>Copy and run: scripts/verify-setup.sql</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("-- Run scripts/verify-setup.sql in Supabase SQL Editor")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
