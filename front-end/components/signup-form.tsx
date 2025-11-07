"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2Icon, AlertCircle } from "lucide-react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { redirect } from 'next/navigation'
import { isLoggedIn } from "@/lib/auth"
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    // Reset states
    setError('')
    setShowSuccessAlert(false)

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Show success alert
        setShowSuccessAlert(true)

        // Wait 1.5 seconds to show the success message, then redirect
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        // Signup failed
        setError(data.message || 'Signup failed. Please try again.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit()
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/oauth/google'
  }

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/oauth/github'
  }
  if (isLoggedIn()) redirect('/dash')
  return (

    <div className={cn("min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col relative overflow-hidden", className)} {...props}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-6 flex items-center justify-between max-w-7xl mx-auto relative z-10">
        <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 group">
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-medium">Home</span>
        </Link>
        <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold">
          <span className="text-black dark:text-white">Byte</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Camp</span>
        </div>
        <div className="w-16 sm:w-20"></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="space-y-6">
              <FieldGroup>
                {/* Header Section */}
                <div className="flex flex-col items-center gap-3 text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Create your account
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance max-w-sm">
                    Join ByteCamp today and start your journey with us
                  </p>
                </div>

                {/* Success Alert */}
                {showSuccessAlert && (
                  <Alert className="border-green-500/40 bg-green-50/50 dark:bg-green-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                    <AlertTitle className="font-semibold text-green-600 dark:text-green-500">Account Created Successfully</AlertTitle>
                    <AlertDescription className="text-sm text-green-700 dark:text-green-400">
                      Welcome to ByteCamp! 🎉 Redirecting to login...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Alert */}
                {error && !showSuccessAlert && (
                  <Alert className="border-red-500/40 bg-red-50/50 dark:bg-red-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertTitle className="font-semibold text-red-600 dark:text-red-500">Error</AlertTitle>
                    <AlertDescription className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loading State Alert */}
                {loading && !showSuccessAlert && !error && (
                  <Alert className="border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <AlertTitle className="font-semibold text-blue-600 dark:text-blue-500">Creating your account...</AlertTitle>
                    <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
                      Please wait while we set up your account
                    </AlertDescription>
                  </Alert>
                )}

                {/* Username Field */}
                <Field>
                  <FieldLabel htmlFor="username" className="text-sm font-medium">Username</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                      required
                      disabled={loading || showSuccessAlert}
                    />
                  </div>
                </Field>

                {/* Email Field */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                      required
                      disabled={loading || showSuccessAlert}
                    />
                  </div>
                </Field>

                {/* Password Field */}
                <Field>
                  <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-10 h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                      required
                      disabled={loading || showSuccessAlert}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      disabled={loading || showSuccessAlert}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </Field>

                {/* Confirm Password Field */}
                <Field>
                  <FieldLabel htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-10 h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                      required
                      disabled={loading || showSuccessAlert}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      disabled={loading || showSuccessAlert}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <FieldDescription className="text-xs mt-1.5">
                    Must be at least 8 characters long
                  </FieldDescription>
                </Field>

                {/* Submit Button */}
                <Field className="pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || showSuccessAlert}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading || showSuccessAlert ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {showSuccessAlert ? 'Success! Redirecting...' : 'Creating Account...'}
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Field>

                {/* Separator */}
                <FieldSeparator className="my-6">
                  <span className="text-xs font-medium text-gray-500">Or continue with</span>
                </FieldSeparator>

                {/* Social Sign In Buttons */}
                <Field className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading || showSuccessAlert}
                    className="w-full h-11 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 group-hover:scale-110 transition-transform">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="ml-2 font-medium hidden sm:inline">Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGithubLogin}
                    disabled={loading || showSuccessAlert}
                    className="w-full h-11 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 group-hover:scale-110 transition-transform">
                      <path
                        d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.335-5.467-5.932 0-1.31.465-2.38 1.235-3.22-.123-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.65.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.43.37.814 1.096.814 2.21 0 1.595-.015 2.877-.015 3.27 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="ml-2 font-medium hidden sm:inline">GitHub</span>
                  </Button>
                </Field>

                {/* Sign In Link */}
                <FieldDescription className="text-center pt-4">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-semibold transition-colors">
                    Sign in
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 py-6 relative z-10">
        <FieldDescription className="text-center text-xs sm:text-sm max-w-2xl mx-auto">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors">
            Privacy Policy
          </a>
        </FieldDescription>
      </footer>
    </div>
  )
}

export default SignupForm