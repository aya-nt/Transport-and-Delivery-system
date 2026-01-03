"use client"

import { useState } from "react"
import { Search, Package, MapPin, Calendar, User, FileText, DollarSign, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function PublicTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shipment, setShipment] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError("")
    setShipment(null)
    setInvoice(null)

    try {
      // Fetch shipment details
      const shipmentRes = await fetch(`http://localhost:8000/api/shipments/?tracking_number=${trackingNumber}`)
      
      if (!shipmentRes.ok) {
        setError("Failed to connect to server")
        return
      }

      const shipmentData = await shipmentRes.json()
      console.log('API Response:', shipmentData)
      
      if (!shipmentData || shipmentData.length === 0) {
        setError("Tracking number not found")
        return
      }

      const foundShipment = shipmentData[0]
      setShipment(foundShipment)

      // Fetch invoice for this shipment
      const invoiceRes = await fetch(`http://localhost:8000/api/invoices/`)
      if (invoiceRes.ok) {
        const invoices = await invoiceRes.json()
        const relatedInvoice = invoices.find((inv: any) => 
          inv.shipments.includes(foundShipment.id)
        )
        if (relatedInvoice) setInvoice(relatedInvoice)
      }

    } catch (err) {
      console.error('Error:', err)
      setError("Failed to fetch shipment details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700"
      case "IN_TRANSIT": return "bg-blue-100 text-blue-700"
      case "OUT_FOR_DELIVERY": return "bg-purple-100 text-purple-700"
      case "PENDING": return "bg-yellow-100 text-yellow-700"
      case "DELIVERY_FAILED": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DELIVERED": return "Livré"
      case "IN_TRANSIT": return "En Transit"
      case "OUT_FOR_DELIVERY": return "En Cours de Livraison"
      case "SORTING_CENTER": return "Centre de Tri"
      case "PENDING": return "En Attente"
      case "DELIVERY_FAILED": return "Échec de Livraison"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">SwiftDeliver</h1>
          </div>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Staff Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Track Your Shipment</h2>
          <p className="text-gray-600">Enter your tracking number to view shipment details and invoice</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK123456)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Shipment Details */}
        {shipment && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Shipment Status</h3>
                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(shipment.status)}`}>
                  {getStatusText(shipment.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-semibold text-gray-800">{shipment.tracking_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Shipment Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(shipment.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-semibold text-gray-800">{shipment.destination_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-semibold text-gray-800">{shipment.service_type_name || 'Standard'}</p>
                  </div>
                </div>
              </div>

              {shipment.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-800">{shipment.description}</p>
                </div>
              )}
            </div>

            {/* Client Information */}
            {shipment.client_name && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800">{shipment.client_name}</p>
                    </div>
                  </div>
                  {shipment.client_contact && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-semibold text-gray-800">{shipment.client_contact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invoice Details */}
            {invoice && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-gray-800">Invoice Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Invoice Number</span>
                    <span className="font-semibold text-gray-800">#{invoice.id}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Amount HT</span>
                    <span className="font-semibold text-gray-800">{invoice.amount_ht} DA</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">TVA (19%)</span>
                    <span className="font-semibold text-gray-800">{invoice.tva} DA</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-800">Total TTC</span>
                    <span className="text-2xl font-bold text-primary">{invoice.amount_ttc} DA</span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`px-4 py-2 rounded-full font-semibold ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status === 'PAID' ? 'Payé' : 
                         invoice.status === 'PARTIAL' ? 'Partiellement Payé' : 'Impayé'}
                      </span>
                    </div>
                    {invoice.status !== 'PAID' && (
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-600">Remaining Balance</span>
                        <span className="font-bold text-red-600">{invoice.amount_ttc - invoice.paid_amount} DA</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
