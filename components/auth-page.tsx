"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OTPVerificationModal } from "./otp-verification-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  email: string
  password: string
  fullName: string
  role: string
  avatar: File | null
  rememberMe: boolean
  agreeToTerms: boolean
}

interface FormErrors {
  email?: string
  password?: string
  fullName?: string
  role?: string
  agreeToTerms?: string
}

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    role: "",
    avatar: null,
    rememberMe: false,
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const { signIn, signUp, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to home")
      router.push("/")
    }
  }, [user, router])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {}

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (activeTab === "signup") {
      if (formData.fullName && formData.fullName.length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters"
      }

      if (formData.password) {
        const strength = calculatePasswordStrength(formData.password)
        setPasswordStrength(strength)
        if (strength < 50) {
          newErrors.password = "Password should be stronger"
        }
      }

      if (formData.role === "") {
        newErrors.role = "Please select your role"
      }
    }

    setErrors(newErrors)
  }, [formData, activeTab])

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleInputChange("avatar", file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Sign in form submitted")

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (errors.email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Calling signIn function...")
      const { error, data } = await signIn(formData.email, formData.password)

      if (error) {
        console.error("Sign in failed:", error)
        toast({
          title: "Sign In Failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        })
      } else {
        console.log("Sign in successful:", data?.user?.email)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        // The useEffect will handle the redirect when user state updates
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Sign up form submitted")

    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms & Privacy Policy",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Error",
        description: "Please fix the form errors before submitting",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Calling signUp function...")
      const { error, data } = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        role: formData.role,
      })

      if (error) {
        console.error("Sign up failed:", error)
        toast({
          title: "Sign Up Failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        })
      } else {
        console.log("Sign up successful, showing OTP modal")
        // Show OTP modal for email verification
        setPendingEmail(formData.email)
        setShowOTPModal(true)
        toast({
          title: "Account Created!",
          description: "Please check your email for a verification code.",
        })
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerificationSuccess = () => {
    console.log("OTP verification successful")
    toast({
      title: "Welcome to QuickCourt!",
      description: "Your account has been verified successfully.",
    })
    setShowOTPModal(false)
    router.push("/")
  }

  const handleEditEmail = () => {
    console.log("Edit email requested")
    setShowOTPModal(false)
    setActiveTab("signup")
    // Focus on email input after a short delay
    setTimeout(() => {
      const emailInput = document.getElementById("signup-email")
      emailInput?.focus()
    }, 100)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  // Don't render if user is already authenticated
  if (user) {
    return null
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">QuickCourt</h1>
              <p className="text-xl mb-2">Book Sports Venues Instantly</p>
              <p className="text-blue-100 text-lg">
                Connect with local sports facilities and book your favorite courts in seconds
              </p>
            </div>

            {/* Sports Icons/Imagery */}
            <div className="grid grid-cols-3 gap-6 mt-8 opacity-80">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                  🏀
                </div>
                <p className="text-sm">Basketball</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                  🎾
                </div>
                <p className="text-sm">Tennis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                  🏸
                </div>
                <p className="text-sm">Badminton</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-blue-100 text-sm">Join thousands of sports enthusiasts and facility owners</p>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
            <div className="absolute top-1/2 left-10 w-16 h-16 border border-white rounded-full" />
          </div>
        </div>

        {/* Right Panel - Auth Forms */}
        <div className="flex-1 lg:w-3/5 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">QuickCourt</h1>
              <p className="text-gray-600">Book Sports Venues Instantly</p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="signin" className="text-sm font-medium">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm font-medium">
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  {/* Sign In Tab */}
                  <TabsContent value="signin" className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                      <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                          {errors.email && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                              <XCircle className="h-3 w-3" />
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={formData.rememberMe}
                            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                          />
                          <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Button variant="link" className="p-0 text-sm text-blue-600 hover:text-blue-700">
                          Forgot Password?
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Sign Up Tab */}
                  <TabsContent value="signup" className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                      <p className="text-gray-600 mt-2">Join QuickCourt and start booking venues</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      {/* Avatar Upload */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={avatarPreview || ""} />
                            <AvatarFallback className="bg-gray-100">
                              <User className="h-8 w-8 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                          >
                            <Camera className="h-3 w-3" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            required
                          />
                          {errors.fullName && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                              <XCircle className="h-3 w-3" />
                              {errors.fullName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                          {formData.email && !errors.email && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                          )}
                          {errors.email && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                              <XCircle className="h-3 w-3" />
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                  style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                            </div>
                            {errors.password && (
                              <div className="flex items-center gap-1 text-red-500 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.password}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sports-enthusiast">Sports Enthusiast</SelectItem>
                            <SelectItem value="facility-owner">Facility Owner</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <XCircle className="h-3 w-3" />
                            {errors.role}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 mt-1"
                            checked={formData.agreeToTerms}
                            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                          />
                          <span className="text-sm text-gray-600">
                            I agree to the{" "}
                            <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                              Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                              Privacy Policy
                            </Button>
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="flex items-center gap-1 text-red-500 text-sm">
                            <XCircle className="h-3 w-3" />
                            {errors.agreeToTerms}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-600">
              <p>
                {activeTab === "signin" ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
                >
                  {activeTab === "signin" ? "Create one here" : "Sign in here"}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={pendingEmail}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onEditEmail={handleEditEmail}
      />
    </>
  )
}
