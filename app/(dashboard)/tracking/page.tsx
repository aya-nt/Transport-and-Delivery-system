"use client"

import type React from "react"
import { Package, AlertCircle, User, Phone, MessageCircle, Truck, Satellite, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi } from "@/lib/api"

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details")
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const tracking = searchParams.get('tracking')
    if (tracking) {
      setTrackingNumber(tracking)
      fetchShipment(tracking)
    }
  }, [searchParams])

  async function fetchShipment(tracking: string) {
    setLoading(true)
    try {
      const shipments = await shipmentsApi.getAll()
      const found = shipments.find((s: any) => s.tracking_number === tracking)
      setShipment(found || null)
    } catch (error) {
      console.error('Failed to fetch shipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber) {
      fetchShipment(trackingNumber)
    }
  }

  const handleTabSwitch = (tab: "details" | "tracking") => {
    console.log("[v0] Switching to tab:", tab)
    setActiveTab(tab)
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Tracking</h1>

      {/* Track Your Shipment */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Track your shipment</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all"
            placeholder="Enter tracking number"
          />
          <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
            Find
          </button>
        </form>
        {loading && <p className="text-sm text-text-secondary mt-4">Recherche en cours...</p>}
        {!loading && shipment && <p className="text-sm text-success mt-4">Expédition trouvée: {shipment.tracking_number}</p>}
        {!loading && trackingNumber && !shipment && <p className="text-sm text-error mt-4">Aucune expédition trouvée avec ce numéro</p>}
      </div>

      {/* Tracking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-sm p-6">
          {/* Tabs Navigation */}
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => handleTabSwitch("details")}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === "details"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => handleTabSwitch("tracking")}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === "tracking"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Tracking
            </button>
          </div>

          {/* Conditionally Render Content Based on Active Tab */}
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations de la commande</h3>
              {!shipment ? (
                <p className="text-text-secondary">Entrez un numéro de suivi pour voir les détails</p>
              ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">N° de suivi</p>
                    <p className="font-medium">{shipment.tracking_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Client</p>
                    <p className="font-medium">{shipment.client_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Chauffeur</p>
                    <p className="font-medium">{shipment.driver_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Destination</p>
                    <p className="font-medium">{shipment.destination_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Poids</p>
                    <p className="font-medium">{shipment.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Volume</p>
                    <p className="font-medium">{shipment.volume} m³</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Coût</p>
                    <p className="font-medium">{shipment.calculated_cost} DA</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Date de création</p>
                    <p className="font-medium">{new Date(shipment.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Statut</p>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        shipment.status === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                        shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-primary' :
                        shipment.status === 'SORTING_CENTER' ? 'bg-yellow-100 text-warning' :
                        shipment.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-600' :
                        shipment.status === 'DELIVERED' ? 'bg-green-100 text-success' :
                        'bg-red-100 text-error'
                      }`}
                    >
                      {shipment.status === 'PENDING' ? 'En attente' :
                       shipment.status === 'IN_TRANSIT' ? 'En transit' :
                       shipment.status === 'SORTING_CENTER' ? 'Centre de tri' :
                       shipment.status === 'OUT_FOR_DELIVERY' ? 'En cours de livraison' :
                       shipment.status === 'DELIVERED' ? 'Livré' : 'Échec de livraison'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Type de service</p>
                    <p className="font-medium">{shipment.service_type_name || 'N/A'}</p>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {activeTab === "tracking" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Suivi de l'expédition</h3>
              {!shipment ? (
                <p className="text-text-secondary">Entrez un numéro de suivi pour voir le suivi</p>
              ) : (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="pt-6">
                  <div className="relative">
                    <div className="flex justify-between items-start">
                      {[
                        { status: 'PENDING', label: 'En attente', active: ['PENDING', 'IN_TRANSIT', 'SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.status) },
                        { status: 'IN_TRANSIT', label: 'En transit', active: ['IN_TRANSIT', 'SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.status) },
                        { status: 'SORTING_CENTER', label: 'Centre de tri', active: ['SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.status) },
                        { status: 'OUT_FOR_DELIVERY', label: 'En livraison', active: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.status) },
                        { status: 'DELIVERED', label: 'Livré', active: shipment.status === 'DELIVERED' },
                      ].map((stage, index) => (
                        <div key={stage.status} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-4 h-4 rounded-full z-10 ${
                              stage.active ? "bg-primary ring-4 ring-primary/20" : "bg-gray-300"
                            }`}
                          />
                          <p className="text-xs text-center mt-2 text-text-secondary max-w-[80px]">{stage.label}</p>
                          {index < 4 && (
                            <div
                              className={`absolute top-2 left-1/2 w-full h-0.5 ${
                                stage.active ? "bg-primary" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-text-secondary mb-2">Statut actuel</p>
                  <p className="text-lg font-semibold">
                    {shipment.status === 'PENDING' ? 'Expédition en attente de traitement' :
                     shipment.status === 'IN_TRANSIT' ? 'Expédition en transit vers la destination' :
                     shipment.status === 'SORTING_CENTER' ? 'Expédition au centre de tri' :
                     shipment.status === 'OUT_FOR_DELIVERY' ? 'Expédition en cours de livraison' :
                     shipment.status === 'DELIVERED' ? 'Expédition livrée avec succès' :
                     'Échec de livraison'}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    Dernière mise à jour: {new Date(shipment.date).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Historique de suivi</h3>
          {!shipment ? (
            <p className="text-sm text-text-secondary">Entrez un numéro de suivi pour voir l'historique</p>
          ) : (
            <div className="space-y-4">
              {shipment.status_history && shipment.status_history.length > 0 ? (
                shipment.status_history.map((history: any, index: number) => (
                  <div key={history.id} className="border-b border-border pb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        history.status === 'DELIVERED' ? 'bg-green-100' :
                        history.status === 'DELIVERY_FAILED' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Package className={`w-5 h-5 ${
                          history.status === 'DELIVERED' ? 'text-success' :
                          history.status === 'DELIVERY_FAILED' ? 'text-error' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {history.status === 'PENDING' ? 'En attente' :
                           history.status === 'IN_TRANSIT' ? 'En transit' :
                           history.status === 'SORTING_CENTER' ? 'Centre de tri' :
                           history.status === 'OUT_FOR_DELIVERY' ? 'En cours de livraison' :
                           history.status === 'DELIVERED' ? 'Livré' : 'Échec de livraison'}
                        </h4>
                        <p className="text-xs text-text-muted">{new Date(history.timestamp).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-b border-border pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      shipment.status === 'DELIVERED' ? 'bg-green-100' :
                      shipment.status === 'DELIVERY_FAILED' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Package className={`w-5 h-5 ${
                        shipment.status === 'DELIVERED' ? 'text-success' :
                        shipment.status === 'DELIVERY_FAILED' ? 'text-error' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">Statut actuel</h4>
                      <p className="text-xs text-text-secondary mb-1">
                        {shipment.status === 'PENDING' ? 'En attente' :
                         shipment.status === 'IN_TRANSIT' ? 'En transit' :
                         shipment.status === 'SORTING_CENTER' ? 'Centre de tri' :
                         shipment.status === 'OUT_FOR_DELIVERY' ? 'En cours de livraison' :
                         shipment.status === 'DELIVERED' ? 'Livré' : 'Échec de livraison'}
                      </p>
                      <p className="text-xs text-text-muted">{new Date(shipment.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
