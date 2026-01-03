"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi } from "@/lib/api"

export default function ShipmentsJournalPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchShipments() {
      try {
        const data = await shipmentsApi.getAll()
        setShipments(data)
      } catch (error) {
        console.error('Failed to fetch shipments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchShipments()
  }, [])

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Shipments Journal</h1>

      {loading ? (
        <div className="text-center py-8">Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <p className="text-text-secondary">No shipments found</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">N° Suivi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Destination</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment: any) => (
                <tr key={shipment.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">{shipment.tracking_number}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{shipment.client}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{shipment.destination}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      shipment.status === 'DELIVERED' ? 'bg-green-100 text-success' :
                      shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-primary' :
                      shipment.status === 'PENDING' ? 'bg-yellow-100 text-warning' :
                      'bg-red-100 text-error'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{new Date(shipment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <button 
                      onClick={() => router.push(`/tracking?tracking=${shipment.tracking_number}`)}
                      className="text-primary hover:underline mr-3 font-medium"
                    >
                      Voir
                    </button>
                    <button 
                      onClick={() => router.push(`/shipments/edit/${shipment.id}`)}
                      className="text-primary hover:underline font-medium"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
