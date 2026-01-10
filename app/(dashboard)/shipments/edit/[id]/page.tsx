"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"

export default function EditShipmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { user } = useUser()

  const [shipment, setShipment] = useState<any>(null)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchShipment()
  }, [])

  async function fetchShipment() {
    try {
      const data = await shipmentsApi.getById(Number(id))
      setShipment(data)
      setStatus(data.status)
    } catch (error) {
      console.error('Failed to fetch shipment:', error)
      alert('Échec du chargement de l\'expédition')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Drivers use PATCH (partial update), others use PUT (full update)
      if (user?.role === 'DRIVER') {
        await shipmentsApi.partialUpdate(Number(id), { status })
      } else {
        await shipmentsApi.update(Number(id), {
          tracking_number: shipment.tracking_number,
          client: shipment.client,
          destination: shipment.destination,
          service_type: shipment.service_type,
          driver: shipment.driver,
          weight: shipment.weight,
          volume: shipment.volume,
          description: shipment.description,
          status
        })
      }
      alert('Statut mis à jour avec succès')
      router.push(user?.role === 'DRIVER' ? '/dashboard' : '/shipments/journal')
    } catch (error) {
      console.error('Failed to update shipment:', error)
      alert('Échec de la mise à jour du statut')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!shipment) {
    return <div className="text-center py-8 text-error">Expédition introuvable</div>
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Modifier le statut de l'expédition</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">Informations de l'expédition</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">N° de suivi:</span>
              <span className="ml-2 font-medium text-foreground">{shipment.tracking_number}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Client:</span>
              <span className="ml-2 font-medium text-foreground">{shipment.client_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Destination:</span>
              <span className="ml-2 font-medium text-foreground">{shipment.destination_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Poids:</span>
              <span className="ml-2 font-medium text-foreground">{shipment.weight} kg</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Statut de l'expédition
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="PENDING">En attente</option>
              <option value="IN_TRANSIT">En transit</option>
              <option value="SORTING_CENTER">Centre de tri</option>
              <option value="OUT_FOR_DELIVERY">En cours de livraison</option>
              <option value="DELIVERED">Livré</option>
              <option value="DELIVERY_FAILED">Échec de livraison</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'Mise à jour...' : 'Mettre à jour le statut'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/shipments/journal')}
              className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-accent transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
