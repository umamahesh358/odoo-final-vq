import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">QuickCourt</h1>
          <p className="text-gray-600">Your local sports booking companion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
