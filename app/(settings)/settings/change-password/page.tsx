"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match")
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch("http://localhost:8000/api/users/change_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to change password")
      }

      setSuccess(true)
      setTimeout(() => router.push("/settings/profile"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to change password")
    }
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-foreground">Change Password</h1>

      <div className="max-w-md bg-card p-8 rounded-3xl shadow-card border border-border">
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-2xl mb-4 border border-destructive/20">{error}</div>}
        {success && <div className="bg-success/10 text-success p-3 rounded-2xl mb-4 border border-success/20">Password changed successfully! Redirecting...</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Current Password</label>
            <input
              type="password"
              value={formData.old_password}
              onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
              required
              className="w-full px-4 py-3 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
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
            <label className="block text-sm font-medium mb-2 text-foreground">Confirm New Password</label>
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
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
