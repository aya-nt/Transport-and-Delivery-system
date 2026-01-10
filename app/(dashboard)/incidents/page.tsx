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
        <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
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
        <div className="text-center py-8 text-muted-foreground">No incidents found</div>
      ) : (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Incident ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shipment ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reported Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident: any) => (
              <tr key={incident.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{incident.id}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{incident.description}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{incident.shipment}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(incident.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      incident.status === "RESOLVED" ? "bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-error dark:bg-red-900/30 dark:text-red-300"
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
