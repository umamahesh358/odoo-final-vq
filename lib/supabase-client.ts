"use client"

import { createClient } from "@supabase/supabase-js"

// Extract project reference from your connection string
const supabaseUrl = "https://ybnrjwhujzdlruxkfols.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your_anon_key_here"

if (!supabaseUrl) {
  throw new Error("Missing Supabase URL")
}

if (!supabaseAnonKey || supabaseAnonKey === "your_anon_key_here") {
  console.warn("Missing or placeholder Supabase anon key - using demo mode")
}

// Singleton pattern for client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-my-custom-header": "quickcourt-app",
        },
      },
    })
  }
  return supabaseClient
}

export const supabase = getSupabaseClient()

// Test connection function
export async function testConnection() {
  try {
    console.log("Testing Supabase connection...")
    const { data, error } = await supabase.from("venues").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error.message)
      return false
    }

    console.log("✅ Supabase connection successful")
    return true
  } catch (error: any) {
    console.error("❌ Supabase connection error:", error.message)
    return false
  }
}

// Function to check if tables exist
export async function checkTablesExist() {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["venues", "bookings", "profiles", "reviews", "venue_availability"])

    if (error) {
      console.error("Error checking tables:", error)
      return false
    }

    const tableNames = data?.map((row) => row.table_name) || []
    const requiredTables = ["venues", "bookings", "profiles", "reviews", "venue_availability"]
    const missingTables = requiredTables.filter((table) => !tableNames.includes(table))

    if (missingTables.length > 0) {
      console.warn("Missing tables:", missingTables)
      return false
    }

    console.log("✅ All required tables exist")
    return true
  } catch (error) {
    console.error("Error checking tables:", error)
    return false
  }
}
