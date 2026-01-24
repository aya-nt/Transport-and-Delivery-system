"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { incidentsApi } from "@/lib/api"

export default function ViewIncidentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncident()
  }, [])

  async function fetchIncident() {
    try {
      const incidents = await incidentsApi.getAll()
      const found = incidents.find((i: any) => i.id === Number(id))
      setIncident(found)
    } catch (error) {
      console.error('Failed to fetch incident:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!incident) return <div className="text-center py-8 text-error">Incident introuvable</div>

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Incident #{incident.id}</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Expédition</h3>
            <p className="text-lg font-semibold text-foreground">ID: {incident.shipment}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
            <p className="text-lg text-foreground">{new Date(incident.date).toLocaleString('fr-FR')}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Statut</h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              incident.status === 'RESOLVED' ? 'bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-error dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {incident.status === 'RESOLVED' ? 'Résolu' : 'Ouvert'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-lg whitespace-pre-wrap text-foreground">{incident.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
