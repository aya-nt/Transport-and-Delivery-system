"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { invoicesApi, shipmentsApi } from "@/lib/api"

export default function CreateInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shipmentId = searchParams.get('shipment')
  
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    client: "",
    shipments: [] as number[],
    amount_ht: 0,
    tva: 0,
    amount_ttc: 0,
    paid_amount: 0,
  })

  useEffect(() => {
    async function fetchShipment() {
      if (!shipmentId) {
        setLoading(false)
        return
      }
      
      try {
        const data = await shipmentsApi.getById(Number(shipmentId))
        
        // Check if shipment already has an invoice
        const invoices = await invoicesApi.getAll()
        const hasInvoice = invoices.some((inv: any) => inv.shipments.includes(Number(shipmentId)))
        
        if (hasInvoice) {
          alert('Cette expédition a déjà une facture')
          router.push('/billing/invoices')
          return
        }
        
        setShipment(data)
        
        // Calculate amounts with 19% TVA (Algeria)
        const amountHT = parseFloat(data.calculated_cost || 0)
        const tva = amountHT * 0.19
        const amountTTC = amountHT + tva
        
        setFormData({
          client: data.client,
          shipments: [data.id],
          amount_ht: amountHT,
          tva: tva,
          amount_ttc: amountTTC,
          paid_amount: 0,
        })
      } catch (error) {
        console.error('Failed to fetch shipment:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchShipment()
  }, [shipmentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const invoiceData = {
        client: formData.client,
        shipments: formData.shipments,
        amount_ht: formData.amount_ht.toFixed(2),
        tva: formData.tva.toFixed(2),
        amount_ttc: formData.amount_ttc.toFixed(2),
        paid_amount: formData.paid_amount.toFixed(2)
      }
      console.log('Sending invoice data:', invoiceData)
      await invoicesApi.create(invoiceData)
      router.push("/billing/invoices")
    } catch (error) {
      console.error('Failed to create invoice:', error)
      alert('Échec de la création de la facture')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Créer Facture</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {shipment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Détails de l'Expédition</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Numéro de Suivi:</span>
                  <span className="ml-2 font-medium">{shipment.tracking_number}</span>
                </div>
                <div>
                  <span className="text-blue-700">Poids:</span>
                  <span className="ml-2 font-medium">{shipment.weight} kg</span>
                </div>
                <div>
                  <span className="text-blue-700">Volume:</span>
                  <span className="ml-2 font-medium">{shipment.volume} m³</span>
                </div>
                <div>
                  <span className="text-blue-700">Coût Calculé:</span>
                  <span className="ml-2 font-medium">{shipment.calculated_cost} DA</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Montant HT (DA)</label>
              <input
                type="number"
                value={formData.amount_ht.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">TVA 19% (DA)</label>
              <input
                type="number"
                value={formData.tva.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Montant TTC (DA)</label>
              <input
                type="number"
                value={formData.amount_ttc.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-lg bg-green-50 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Montant Payé (DA)</label>
            <input
              type="number"
              step="0.01"
              value={formData.paid_amount}
              onChange={(e) => setFormData({...formData, paid_amount: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Solde restant: {(formData.amount_ttc - formData.paid_amount).toFixed(2)} DA
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-foreground">Calcul du Prix</h4>
            <p className="text-sm text-muted-foreground">
              Le prix est calculé automatiquement selon la règle de tarification:
              <br />
              <span className="font-mono">Prix = Tarif de Base + (Poids × Tarif/kg) + (Volume × Tarif/m³)</span>
              <br />
              TVA de 19% appliquée selon la réglementation algérienne
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/billing/invoices")}
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {saving ? "Création..." : "Créer Facture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
