"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { incidentsApi } from "@/lib/api"

export default function IncidentsPage() {
  const router = useRouter()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncidents()
  }, [])

  async function fetchIncidents() {
    try {
      const data = await incidentsApi.getAll()
      setIncidents(data)
    } catch (error) {
      console.error('Failed to fetch incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleResolve(id: number) {
    try {
      const incident = incidents.find((i: any) => i.id === id)
      await incidentsApi.update(id, { ...incident, status: 'RESOLVED' })
      fetchIncidents()
    } catch (error) {
      console.error('Failed to resolve incident:', error)
      alert('Échec de la résolution')
    }
  }

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

      {loading ? (
        <div className="text-center py-8">Loading incidents...</div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">No incidents found</div>
      ) : (
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
            {incidents.map((incident: any) => (
              <tr key={incident.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{incident.id}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{incident.description}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{incident.shipment}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{new Date(incident.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      incident.status === "RESOLVED" ? "bg-green-100 text-success" : "bg-red-100 text-error"
                    }`}
                  >
                    {incident.status === "RESOLVED" ? "Résolu" : "Ouvert"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => router.push(`/incidents/view/${incident.id}`)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Voir
                  </button>
                  {incident.status === 'OPEN' && (
                    <button 
                      onClick={() => handleResolve(incident.id)}
                      className="text-success hover:underline hover:scale-105 transition-all font-medium"
                    >
                      Résoudre
                    </button>
                  )}
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
