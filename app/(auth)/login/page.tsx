"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) throw new Error("Invalid credentials")
      
      const data = await res.json()
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-card border border-border">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-2 rounded-3xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 7H16V3H8V7H5C3.9 7 3 7.9 3 9V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V9C21 7.9 20.1 7 19 7ZM10 5H14V7H10V5ZM5 17V9H19V17H5Z"
                fill="#ffffff"
              />
              <circle cx="7" cy="13" r="1.5" fill="#ffffff" />
              <circle cx="17" cy="13" r="1.5" fill="#ffffff" />
              <path d="M12 11L9 14H15L12 11Z" fill="#e0e7ff" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-6">Sign in to your account</p>
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-2xl mb-4 border border-destructive/20">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-chart-2 text-white py-3 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Forgot your password? Contact your administrator for password reset.
          </p>
        </div>
      </div>
    </div>
  )
}
