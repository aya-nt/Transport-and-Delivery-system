"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"

const ROLES = [
  { value: 'ADMIN', label: 'Administrator', color: 'bg-red-100 text-red-700' },
  { value: 'MANAGER', label: 'Manager', color: 'bg-purple-100 text-purple-700' },
  { value: 'AGENT', label: 'Agent', color: 'bg-blue-100 text-blue-700' },
  { value: 'DRIVER', label: 'Driver', color: 'bg-green-100 text-green-700' },
]

const PERMISSIONS = {
  ADMIN: ['Full system access', 'Manage users', 'Manage all resources', 'View all reports'],
  MANAGER: ['View all data', 'Manage shipments', 'Manage invoices', 'View reports'],
  AGENT: ['Manage clients', 'Manage vehicles', 'Manage drivers', 'Create shipments'],
  DRIVER: ['View assigned shipments', 'Update delivery status'],
}

export default function RolesPage() {
  const router = useRouter()
  const { user } = useUser()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Admin Only Section</h2>
          <p className="text-text-secondary">You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:8000/api/users/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: number, newRole: string) {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!response.ok) throw new Error('Failed to update')
      fetchUsers()
      alert('Role updated successfully!')
    } catch (error) {
      console.error('Failed to update role:', error)
      alert('Failed to update role')
    }
  }

  async function deleteUser(userId: number, username: string) {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete')
      fetchUsers()
      alert('User deleted successfully!')
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Roles & Permissions</h1>
        <button
          onClick={() => window.location.href = '/settings/users/create'}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark"
        >
          Create User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Role Definitions</h2>
          <div className="space-y-4">
            {ROLES.map((role) => (
              <div key={role.value} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${role.color}`}>
                    {role.label}
                  </span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  {PERMISSIONS[role.value as keyof typeof PERMISSIONS].map((perm, idx) => (
                    <li key={idx}>• {perm}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">User Roles</h2>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between border border-border rounded-lg p-4">
                <div>
                  <p className="font-semibold">{u.username}</p>
                  <p className="text-sm text-text-secondary">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {u.id !== user.id && (
                    <button
                      onClick={() => deleteUser(u.id, u.username)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
