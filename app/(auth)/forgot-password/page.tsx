"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:8000/api/users/request_reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to request reset")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to request password reset")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-card border border-border">
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Forgot Password</h1>
        <p className="text-center text-muted-foreground mb-6">Enter your username to reset password</p>
        
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-2xl mb-4 border border-destructive/20">{error}</div>}
        {success && (
          <div className="bg-success/10 text-success p-3 rounded-2xl mb-4 border border-success/20">
            Reset token generated! Check the backend console for your token, then proceed to reset password.
            <Link href="/reset-password" className="block mt-2 underline font-semibold">
              Reset Password →
            </Link>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-chart-2 text-white py-3 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Request Reset
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
