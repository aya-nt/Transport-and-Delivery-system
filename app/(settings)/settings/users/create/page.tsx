"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { useUser } from "@/hooks/useUser"

const ROLES = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'DRIVER', label: 'Driver' },
]

export default function CreateUserPage() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "AGENT",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // No redirect, just show access denied message
  }, [user])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Only Section</h2>
          <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      
      const contentType = response.headers.get('content-type')
      
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          console.error('Error:', errorData)
          alert(`Failed to create user: ${JSON.stringify(errorData)}`)
        } else {
          const errorText = await response.text()
          console.error('Error (HTML):', errorText)
          alert(`Server error (${response.status}). Check if Django server is running and CORS is configured.`)
        }
        return
      }
      
      alert(`User created!\n\nUsername: ${formData.username}\nPassword: ${formData.password}\n\nProvide these credentials to the user.`)
      router.push('/settings/roles')
    } catch (error: any) {
      console.error('Failed to create user:', error)
      alert(`Failed to create user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <BackButton />
      <h1 className="text-3xl font-bold">Create User Account</h1>

      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/settings/roles')}
              className="px-6 py-3 border rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
