"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { invoicesApi } from "@/lib/api"

export default function ViewInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [])

  async function fetchInvoice() {
    try {
      const data = await invoicesApi.getById(Number(id))
      setInvoice(data)
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}/pdf/`, '_blank')
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!invoice) return <div className="text-center py-8 text-error">Facture introuvable</div>

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Facture #{invoice.id}</h1>
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Télécharger PDF
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">FACTURE</h2>
          <p className="text-text-secondary">Date: {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Client</h3>
            <p className="text-text-secondary">{invoice.client_name}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Statut</h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              invoice.status === 'PAID' ? 'bg-green-100 text-success' :
              invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-warning' :
              'bg-red-100 text-error'
            }`}>
              {invoice.status === 'PAID' ? 'Payé' :
               invoice.status === 'PARTIAL' ? 'Partiel' : 'Non payé'}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-6 mb-6">
          <h3 className="font-semibold mb-4">Détails</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Montant HT:</span>
              <span className="font-medium">{invoice.amount_ht} DA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">TVA (19%):</span>
              <span className="font-medium">{invoice.tva} DA</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
              <span>Montant TTC:</span>
              <span>{invoice.amount_ttc} DA</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold mb-4">Paiement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Montant payé:</span>
              <span className="font-medium">{invoice.paid_amount} DA</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Solde restant:</span>
              <span className={invoice.remaining_balance > 0 ? 'text-error' : 'text-success'}>
                {invoice.remaining_balance} DA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
