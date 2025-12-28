"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"

export default function VehiclesPage() {
  const router = useRouter()
  const [vehicles] = useState([
    {
      id: 1,
      plateNumber: "ABC-1234",
      type: "Truck",
      capacity: "5000 kg",
      status: "Available",
    },
    {
      id: 2,
      plateNumber: "XYZ-5678",
      type: "Van",
      capacity: "1500 kg",
      status: "In Use",
    },
  ])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Vehicles</h1>
        <button
          onClick={() => router.push("/vehicles/create")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Add Vehicle
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Plate Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{vehicle.plateNumber}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{vehicle.type}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{vehicle.capacity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      vehicle.status === "Available" ? "bg-green-100 text-success" : "bg-blue-100 text-primary"
                    }`}
                  >
                    {vehicle.status}
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
