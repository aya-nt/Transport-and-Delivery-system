"use client"

import { useState } from "react"
import BackButton from "@/components/layout/back-button"

export default function DriversPage() {
  const [drivers] = useState([
    {
      id: 1,
      name: "Mike Wilson",
      licenseNumber: "DL12345678",
      phone: "+1 234 567 8900",
      status: "Available",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      licenseNumber: "DL87654321",
      phone: "+1 234 567 8901",
      status: "On Route",
    },
  ])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Drivers</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          Add Driver
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">License Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{driver.name}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{driver.licenseNumber}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{driver.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      driver.status === "Available" ? "bg-green-100 text-success" : "bg-yellow-100 text-warning"
                    }`}
                  >
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium">
                    Edit
                  </button>
                  <button className="text-error hover:underline hover:scale-105 transition-all font-medium">
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
