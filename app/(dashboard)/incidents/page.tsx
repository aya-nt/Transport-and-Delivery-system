"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"

export default function IncidentsPage() {
  const router = useRouter()
  const [incidents] = useState([
    {
      id: "INC-001",
      type: "Delayed Delivery",
      shipmentId: "SH-1234",
      status: "Open",
      reportedDate: "2024-01-20",
    },
    {
      id: "INC-002",
      type: "Damaged Package",
      shipmentId: "SH-5678",
      status: "Resolved",
      reportedDate: "2024-01-18",
    },
  ])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Incidents</h1>
        <button
          onClick={() => router.push("/incidents/report")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Report Incident
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Incident ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Shipment ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Reported Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{incident.id}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{incident.type}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{incident.shipmentId}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{incident.reportedDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      incident.status === "Resolved" ? "bg-green-100 text-success" : "bg-red-100 text-error"
                    }`}
                  >
                    {incident.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium">
                    View
                  </button>
                  <button className="text-primary hover:underline hover:scale-105 transition-all font-medium">
                    Resolve
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
