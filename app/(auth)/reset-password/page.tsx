"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    token: "",
    new_password: "",
    confirm_password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/users/reset_password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: formData.token,
          new_password: formData.new_password
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to reset password")
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-card border border-border">
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Reset Password</h1>
        <p className="text-center text-muted-foreground mb-6">Enter your reset token and new password</p>
        
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-2xl mb-4 border border-destructive/20">{error}</div>}
        {success && <div className="bg-success/10 text-success p-3 rounded-2xl mb-4 border border-success/20">Password reset successfully! Redirecting to login...</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Reset Token</label>
            <input
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              required
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Paste token from console"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">New Password</label>
            <input
              type="password"
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Confirm Password</label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-chart-2 text-white py-3 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Reset Password
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
