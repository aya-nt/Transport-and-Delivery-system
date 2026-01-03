"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { invoicesApi } from "@/lib/api"

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await invoicesApi.getAll()
        setInvoices(data)
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Invoices</h1>

      {loading ? (
        <div className="text-center py-8">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">No invoices found</div>
      ) : (
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Invoice ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: any) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{invoice.client_name || `Client #${invoice.client}`}</td>
                <td className="px-6 py-4 text-sm text-text-primary font-semibold">{invoice.amount_ttc} DA</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      invoice.status === "PAID" ? "bg-green-100 text-success" : 
                      invoice.status === "PARTIAL" ? "bg-yellow-100 text-warning" :
                      "bg-red-100 text-error"
                    }`}
                  >
                    {invoice.status === "PAID" ? "Payé" :
                     invoice.status === "PARTIAL" ? "Partiel" : "Non payé"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => router.push(`/billing/invoices/edit/${invoice.id}`)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => router.push(`/billing/invoices/view/${invoice.id}`)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Voir
                  </button>
                  <button 
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.id}/pdf/`, '_blank')}
                    className="text-primary hover:underline hover:scale-105 transition-all font-medium"
                  >
                    Télécharger
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
