"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { incidentsApi, shipmentsApi } from "@/lib/api"

export default function ReportIncidentPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    shipment: "",
    description: ""
  })

  const incidentTypes = [
    "Colis endommagé",
    "Colis perdu",
    "Retard de livraison",
    "Mauvaise adresse",
    "Refus de livraison",
    "Accident de véhicule",
    "Autre"
  ]

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      await incidentsApi.create(formData)
      alert('Incident signalé avec succès')
      router.push('/incidents')
    } catch (error) {
      console.error('Failed to create incident:', error)
      alert('Échec du signalement')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Signaler un Incident</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Expédition</label>
            <select 
              value={formData.shipment}
              onChange={(e) => setFormData({...formData, shipment: e.target.value})}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Sélectionner une expédition</option>
              {shipments.map((shipment: any) => (
                <option key={shipment.id} value={shipment.id}>
                  {shipment.tracking_number} - {shipment.client_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Type d'incident (optionnel)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {incidentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, description: type + ": "})}
                  className="px-3 py-1 text-sm border border-border rounded-lg text-foreground bg-card hover:bg-accent transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Décrivez l'incident..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/incidents')}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all hover:scale-105 active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? 'Envoi...' : 'Signaler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
