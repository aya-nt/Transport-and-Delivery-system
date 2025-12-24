"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"

export default function ClientsPage() {
  const router = useRouter()
  const [clients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234 567 8901",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 234 567 8902",
      status: "Inactive",
    },
  ])

  const handleEdit = (id: number) => {
    console.log("[v0] Editing client:", id)
    // TODO: Navigate to edit page or open modal
  }

  const handleDelete = (id: number) => {
    console.log("[v0] Deleting client:", id)
    // TODO: Show confirmation modal then delete
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Clients</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          Add Client
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{client.name}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{client.email}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{client.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      client.status === "Active" ? "bg-green-100 text-success" : "bg-gray-100 text-text-secondary"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(client.id)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-error hover:underline hover:scale-105 transition-all font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
