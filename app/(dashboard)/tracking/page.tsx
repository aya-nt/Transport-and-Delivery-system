"use client"

import type React from "react"
import { Package, AlertCircle, User, Phone, MessageCircle, Truck, Satellite, PlusCircle, FileText, DollarSign, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ShipmentMap from "@/components/maps/ShipmentMap"

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "tracking" | "invoice">("details")
  const [shipment, setShipment] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number} | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const tracking = searchParams.get('tracking')
    if (tracking) {
      setTrackingNumber(tracking)
      fetchShipment(tracking)
    }
  }, [searchParams])

  // Fetch driver location when shipment changes
  useEffect(() => {
    if (!shipment) {
      setDriverLocation(null)
      return
    }

    async function fetchDriverLocation() {
      try {
        const res = await fetch(`http://localhost:8000/api/driver-location/${shipment.tracking_number}/`)
        if (res.ok) {
          const data = await res.json()
          if (data.location) {
            setDriverLocation({ lat: data.location.lat, lng: data.location.lng })
          } else {
            setDriverLocation(null)
          }
        }
      } catch (error) {
        console.error('Failed to fetch driver location:', error)
        setDriverLocation(null)
      }
    }

    fetchDriverLocation()
  }, [shipment])

  async function fetchShipment(tracking: string) {
    setLoading(true)
    try {
      const shipments = await shipmentsApi.getAll()
      const found = shipments.find((s: any) => s.tracking_number === tracking)
      setShipment(found || null)
      
      // Fetch invoice if shipment found
      if (found) {
        try {
          const invoiceRes = await fetch(`http://localhost:8000/api/invoices/`)
          if (invoiceRes.ok) {
            const invoices = await invoiceRes.json()
            const relatedInvoice = invoices.find((inv: any) => 
              inv.shipments.includes(found.id)
            )
            if (relatedInvoice) setInvoice(relatedInvoice)
          }
        } catch (error) {
          console.error('Failed to fetch invoice:', error)
        }
      }
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

  const handleTabSwitch = (tab: "details" | "tracking" | "invoice") => {
    setActiveTab(tab)
  }

  const originAddress = shipment?.client_address || shipment?.origin_country || null
  const destinationAddress = shipment
    ? [shipment.destination_name, shipment.destination_zone, shipment.destination_country || 'Algeria']
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold">Suivi des Expéditions</h1>

      {/* Track Your Shipment */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi de votre expédition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all"
              placeholder="Entrer le numéro de suivi"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </Button>
          </form>
          {loading && <p className="text-sm text-muted-foreground mt-4">Recherche en cours...</p>}
          {!loading && shipment && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-green-600">Expédition trouvée: {shipment.tracking_number}</p>
              <Link href={`/claims/create?shipment=${shipment.tracking_number}`}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Faire une réclamation
                </Button>
              </Link>
            </div>
          )}
          {!loading && trackingNumber && !shipment && <p className="text-sm text-red-600 mt-4">Aucune expédition trouvée avec ce numéro</p>}
        </CardContent>
      </Card>

      {/* Tracking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              {/* Tabs Navigation */}
              <div className="flex gap-6 border-b border-border">
                <button
                  onClick={() => handleTabSwitch("details")}
                  className={`pb-3 font-medium transition-all relative ${
                    activeTab === "details"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Détails de la commande
                </button>
                <button
                  onClick={() => handleTabSwitch("tracking")}
                  className={`pb-3 font-medium transition-all relative ${
                    activeTab === "tracking"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Suivi
                </button>
                {invoice && (
                  <button
                    onClick={() => handleTabSwitch("invoice")}
                    className={`pb-3 font-medium transition-all relative ${
                      activeTab === "invoice"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    Facture
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Conditionally Render Content Based on Active Tab */}
              {activeTab === "details" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations de la commande</h3>
                  {!shipment ? (
                    <p className="text-muted-foreground">Entrez un numéro de suivi pour voir les détails</p>
                  ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">N° de suivi</p>
                        <p className="font-medium">{shipment.tracking_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Client</p>
                        <p className="font-medium">{shipment.client_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Chauffeur</p>
                        <p className="font-medium">{shipment.driver_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Destination</p>
                        <p className="font-medium">{shipment.destination_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Poids</p>
                        <p className="font-medium">{shipment.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Volume</p>
                        <p className="font-medium">{shipment.volume} m³</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Coût</p>
                        <p className="font-medium">{shipment.calculated_cost} DA</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                        <p className="font-medium">{new Date(shipment.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Statut</p>
                        <Badge variant={shipment.status === 'DELIVERED' ? 'default' : 'secondary'}>
                          {shipment.status === 'PENDING' ? 'En attente' :
                           shipment.status === 'IN_TRANSIT' ? 'En transit' :
                           shipment.status === 'SORTING_CENTER' ? 'Centre de tri' :
                           shipment.status === 'OUT_FOR_DELIVERY' ? 'En cours de livraison' :
                           shipment.status === 'DELIVERED' ? 'Livré' : 'Échec de livraison'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Type de service</p>
                        <p className="font-medium">{shipment.service_type_name || 'N/A'}</p>
                      </div>
                      {shipment.description && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Description</p>
                          <p className="font-medium">{shipment.description}</p>
                        </div>
                      )}
                    </div>
                    {/* Client Information */}
                    {shipment.client_name && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Informations Client</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-primary mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Nom</p>
                              <p className="font-medium">{shipment.client_name}</p>
                            </div>
                          </div>
                          {shipment.client_contact && (
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-primary mt-1" />
                              <div>
                                <p className="text-sm text-muted-foreground">Contact</p>
                                <p className="font-medium">{shipment.client_contact}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}

              {activeTab === "tracking" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Suivi de l'expédition</h3>
                  {!shipment ? (
                    <p className="text-muted-foreground">Entrez un numéro de suivi pour voir le suivi</p>
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
                                  stage.active ? "bg-primary ring-4 ring-primary/20" : "bg-muted"
                                }`}
                              />
                              <p className="text-xs text-center mt-2 text-muted-foreground max-w-[80px]">{stage.label}</p>
                              {index < 4 && (
                                <div
                                  className={`absolute top-2 left-1/2 w-full h-0.5 ${
                                    stage.active ? "bg-primary" : "bg-muted"
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Current Status */}
                    <div className="bg-muted rounded-lg p-4 border">
                      <p className="text-sm text-muted-foreground mb-2">Statut actuel</p>
                      <p className="text-lg font-semibold">
                        {shipment.status === 'PENDING' ? 'Expédition en attente de traitement' :
                         shipment.status === 'IN_TRANSIT' ? 'Expédition en transit vers la destination' :
                         shipment.status === 'SORTING_CENTER' ? 'Expédition au centre de tri' :
                         shipment.status === 'OUT_FOR_DELIVERY' ? 'Expédition en cours de livraison' :
                         shipment.status === 'DELIVERED' ? 'Expédition livrée avec succès' :
                         'Échec de livraison'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dernière mise à jour: {new Date(shipment.date).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    {/* Google Map */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Position en temps réel</p>
                      <ShipmentMap
                        originAddress={originAddress}
                        destinationAddress={destinationAddress}
                        driverLocation={driverLocation}
                        heightClassName="h-[320px]"
                      />
                    </div>

                  </div>
                  )}
                </div>
              )}

              {activeTab === "invoice" && invoice && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold">Détails de la Facture</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Numéro de facture</span>
                      <span className="font-semibold">#{invoice.id}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Montant HT</span>
                      <span className="font-semibold">{invoice.amount_ht} DA</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">TVA (19%)</span>
                      <span className="font-semibold">{invoice.tva} DA</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold">Total TTC</span>
                      <span className="text-2xl font-bold text-primary">{invoice.amount_ttc} DA</span>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Statut de paiement</span>
                        <Badge variant={
                          invoice.status === 'PAID' ? 'default' :
                          invoice.status === 'PARTIAL' ? 'secondary' : 'destructive'
                        }>
                          {invoice.status === 'PAID' ? 'Payé' : 
                           invoice.status === 'PARTIAL' ? 'Partiellement Payé' : 'Impayé'}
                        </Badge>
                      </div>
                      {invoice.status !== 'PAID' && (
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-muted-foreground">Solde restant</span>
                          <span className="font-bold text-red-600">{invoice.amount_ttc - invoice.paid_amount} DA</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Historique de suivi</CardTitle>
          </CardHeader>
          <CardContent>
            {!shipment ? (
              <p className="text-sm text-muted-foreground">Entrez un numéro de suivi pour voir l'historique</p>
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
                            history.status === 'DELIVERED' ? 'text-green-600' :
                            history.status === 'DELIVERY_FAILED' ? 'text-red-600' : 'text-primary'
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
                          <p className="text-xs text-muted-foreground">{new Date(history.timestamp).toLocaleString('fr-FR')}</p>
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
                          shipment.status === 'DELIVERED' ? 'text-green-600' :
                          shipment.status === 'DELIVERY_FAILED' ? 'text-red-600' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Statut actuel</h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {shipment.status === 'PENDING' ? 'En attente' :
                           shipment.status === 'IN_TRANSIT' ? 'En transit' :
                           shipment.status === 'SORTING_CENTER' ? 'Centre de tri' :
                           shipment.status === 'OUT_FOR_DELIVERY' ? 'En cours de livraison' :
                           shipment.status === 'DELIVERED' ? 'Livré' : 'Échec de livraison'}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(shipment.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}