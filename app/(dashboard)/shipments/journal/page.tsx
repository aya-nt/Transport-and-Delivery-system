"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"

export default function ShipmentsJournalPage() {
  const router = useRouter()
  const { user, can } = useUser()
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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Shipments Journal</h1>
        {can.manageShipments() && (
          <button
            onClick={() => router.push("/shipments/create")}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Add Shipment
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <p className="text-muted-foreground">No shipments found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">N° Suivi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Destination</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment: any) => (
                <tr key={shipment.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{shipment.tracking_number}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{shipment.client}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{shipment.destination}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      shipment.status === 'DELIVERED' ? 'bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300' :
                      shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300' :
                      shipment.status === 'PENDING' ? 'bg-yellow-100 text-warning dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-error dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(shipment.date).toLocaleDateString()}</td>
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
