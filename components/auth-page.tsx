"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { OtpVerificationModal } from "@/components/otp-verification-modal"
import { RoleSelectionModal } from "@/components/profile/role-selection-modal"

export function AuthPage() {
  const { signIn, signUp, loading } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [pendingUserData, setPendingUserData] = useState<any>(null)

  // Sign In Form
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {}

    if (!signInData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!signInData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {}

    if (!signUpData.fullName) {
      newErrors.fullName = "Full name is required"
    }

    if (!signUpData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!signUpData.password) {
      newErrors.password = "Password is required"
    } else if (signUpData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignIn()) return

    try {
      await signIn(signInData.email, signInData.password)
      router.push("/dashboard")
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign in" })
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignUp()) return

    try {
      setPendingUserData(signUpData)
      setShowOtpModal(true)
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign up" })
    }
  }

  const handleOtpVerified = async () => {
    try {
      await signUp(pendingUserData.email, pendingUserData.password, {
        full_name: pendingUserData.fullName,
        phone: pendingUserData.phone,
      })
      setShowOtpModal(false)
      setShowRoleModal(true)
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create account" })
    }
  }

  const handleRoleSelected = () => {
    setShowRoleModal(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">QC</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Welcome to QuickCourt
            </CardTitle>
            <CardDescription>Book your favorite sports venues instantly</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700">
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    By signing up, you agree to our{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose QuickCourt?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-2">⚡</div>
              <h4 className="font-medium text-gray-900">Instant Booking</h4>
              <p className="text-sm text-gray-600">Book courts in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-2">🏆</div>
              <h4 className="font-medium text-gray-900">Premium Venues</h4>
              <p className="text-sm text-gray-600">Top-rated sports facilities</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-2">💳</div>
              <h4 className="font-medium text-gray-900">Secure Payments</h4>
              <p className="text-sm text-gray-600">Safe and easy transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={handleOtpVerified}
        email={pendingUserData?.email || ""}
      />

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelected={handleRoleSelected}
      />
    </div>
  )
}
