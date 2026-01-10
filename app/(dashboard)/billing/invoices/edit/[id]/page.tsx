"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { invoicesApi } from "@/lib/api"

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [paidAmount, setPaidAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchInvoice()
  }, [])

  async function fetchInvoice() {
    try {
      const data = await invoicesApi.getById(Number(id))
      setInvoice(data)
      setPaidAmount(data.paid_amount)
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      await invoicesApi.update(Number(id), {
        client: invoice.client,
        shipments: invoice.shipments,
        amount_ht: invoice.amount_ht,
        tva: invoice.tva,
        amount_ttc: invoice.amount_ttc,
        paid_amount: paidAmount
      })
      alert('Paiement mis à jour avec succès')
      router.push('/billing/invoices')
    } catch (error) {
      console.error('Failed to update invoice:', error)
      alert('Échec de la mise à jour')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!invoice) return <div className="text-center py-8 text-error">Facture introuvable</div>

  const remaining = parseFloat(invoice.amount_ttc) - parseFloat(paidAmount || 0)

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Modifier Paiement - Facture #{invoice.id}</h1>

      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Détails de la facture</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Client:</span>
              <span className="ml-2 font-medium text-foreground">{invoice.client_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2 font-medium text-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Montant TTC:</span>
              <span className="ml-2 font-medium text-foreground">{invoice.amount_ttc} DA</span>
            </div>
            <div>
              <span className="text-muted-foreground">Statut actuel:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                invoice.status === 'PAID' ? 'bg-success/20 text-success dark:bg-success/10' :
                invoice.status === 'PARTIAL' ? 'bg-warning/20 text-warning dark:bg-warning/10' :
                'bg-destructive/20 text-destructive dark:bg-destructive/10'
              }`}>
                {invoice.status === 'PAID' ? 'Payé' :
                 invoice.status === 'PARTIAL' ? 'Partiel' : 'Non payé'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Montant Payé (DA)
            </label>
            <input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Solde restant:</span> {remaining.toFixed(2)} DA
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/billing/invoices')}
              className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
