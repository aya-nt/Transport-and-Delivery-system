"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { clientsApi } from "@/lib/api"

export default function CreateClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    contact_info: "",
    address: "",
    status: "ACTIVE",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await clientsApi.create(formData)
      router.push("/clients")
    } catch (error) {
      console.error('Failed to create client:', error)
      alert('Failed to create client. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Add Client</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter client's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Contact Info</label>
            <input
              type="tel"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0555123456 (10 chiffres)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter client's address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/clients")}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

