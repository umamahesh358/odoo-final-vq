"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Database, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"

interface TableStatus {
  name: string
  exists: boolean
  rowCount: number
  error?: string
}

export function DatabaseStatus() {
  const [tables, setTables] = useState<TableStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [overallStatus, setOverallStatus] = useState<"success" | "error" | "loading">("loading")

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    const tableNames = ["venues", "bookings", "profiles", "reviews", "venue_availability"]
    const tableStatuses: TableStatus[] = []

    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        if (error) {
          tableStatuses.push({
            name: tableName,
            exists: false,
            rowCount: 0,
            error: error.message,
          })
        } else {
          tableStatuses.push({
            name: tableName,
            exists: true,
            rowCount: count || 0,
          })
        }
      } catch (err: any) {
        tableStatuses.push({
          name: tableName,
          exists: false,
          rowCount: 0,
          error: err.message,
        })
      }
    }

    setTables(tableStatuses)

    // Determine overall status
    const allTablesExist = tableStatuses.every((table) => table.exists)
    const hasData = tableStatuses.some((table) => table.rowCount > 0)

    if (allTablesExist && hasData) {
      setOverallStatus("success")
    } else {
      setOverallStatus("error")
    }

    setLoading(false)
  }

  const getStatusIcon = (table: TableStatus) => {
    if (table.exists) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (table: TableStatus) => {
    if (table.exists) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          {table.rowCount} rows
        </Badge>
      )
    } else {
      return <Badge variant="destructive">Missing</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking Database Status...
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Database Status
          {overallStatus === "success" && <Badge className="bg-green-100 text-green-800">Ready</Badge>}
          {overallStatus === "error" && <Badge variant="destructive">Issues Found</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tables.map((table) => (
            <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(table)}
                <div>
                  <h4 className="font-medium capitalize">{table.name.replace("_", " ")}</h4>
                  {table.error && <p className="text-sm text-red-600">{table.error}</p>}
                </div>
              </div>
              {getStatusBadge(table)}
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button onClick={checkDatabaseStatus} variant="outline" size="sm" className="bg-transparent">
              Refresh Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
