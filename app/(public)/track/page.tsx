"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Package, MapPin, Calendar, User, FileText, DollarSign, Phone, Mail, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PublicTrackingPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shipment, setShipment] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimData, setClaimData] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    claim_type: "",
    description: ""
  })
  const [claimSubmitted, setClaimSubmitted] = useState(false)

  useEffect(() => {
    const tracking = searchParams.get('tracking')
    if (tracking) {
      setTrackingNumber(tracking)
      const fetchShipment = async () => {
        setLoading(true)
        setError("")
        setShipment(null)
        setInvoice(null)

        try {
          const shipmentRes = await fetch(`http://localhost:8000/api/shipments/?tracking_number=${tracking}`)
          
          if (!shipmentRes.ok) {
            setError("Failed to connect to server")
            return
          }

          const shipmentData = await shipmentRes.json()
          
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
      fetchShipment()
    }
  }, [searchParams])

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

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setClaimSubmitted(true)
    setTimeout(() => {
      setShowClaimForm(false)
      setClaimSubmitted(false)
      setClaimData({ client_name: "", client_phone: "", client_email: "", claim_type: "", description: "" })
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "IN_TRANSIT": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "OUT_FOR_DELIVERY": return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
      case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "DELIVERY_FAILED": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-muted text-muted-foreground"
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10 dark:from-primary/5 dark:via-chart-3/5 dark:to-chart-2/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">SwiftDeliver</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-primary hover:underline font-medium transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-3">Track Your Shipment</h2>
          <p className="text-muted-foreground">Enter your tracking number to view shipment details and invoice</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK123456)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg bg-background text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Shipment Details */}
        {shipment && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Shipment Status</h3>
                  <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(shipment.status)}`}>
                    {getStatusText(shipment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-semibold text-foreground">{shipment.tracking_number}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shipment Date</p>
                      <p className="font-semibold text-foreground">
                        {new Date(shipment.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-semibold text-foreground">{shipment.destination_name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-semibold text-foreground">{shipment.service_type_name || 'Standard'}</p>
                    </div>
                  </div>
                </div>

                {shipment.description && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{shipment.description}</p>
                  </div>
                )}

                {/* Claim Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  <Button 
                    onClick={() => setShowClaimForm(!showClaimForm)}
                    className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {showClaimForm ? "Annuler la Réclamation" : "Faire une Réclamation"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            {shipment.client_name && (
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Client Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold text-foreground">{shipment.client_name}</p>
                      </div>
                    </div>
                    {shipment.client_contact && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="font-semibold text-foreground">{shipment.client_contact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice Details */}
            {invoice && (
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">Invoice Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Invoice Number</span>
                      <span className="font-semibold text-foreground">#{invoice.id}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Amount HT</span>
                      <span className="font-semibold text-foreground">{invoice.amount_ht} DA</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">TVA (19%)</span>
                      <span className="font-semibold text-foreground">{invoice.tva} DA</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-foreground">Total TTC</span>
                      <span className="text-2xl font-bold text-primary">{invoice.amount_ttc} DA</span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className={`px-4 py-2 rounded-full font-semibold ${
                          invoice.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {invoice.status === 'PAID' ? 'Payé' : 
                           invoice.status === 'PARTIAL' ? 'Partiellement Payé' : 'Impayé'}
                        </span>
                      </div>
                      {invoice.status !== 'PAID' && (
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-muted-foreground">Remaining Balance</span>
                          <span className="font-bold text-destructive">{invoice.amount_ttc - invoice.paid_amount} DA</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Inline Claim Form */}
        {shipment && showClaimForm && (
          <div className="mt-6">
            <Card className="bg-destructive/5 border-destructive/20 dark:bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-destructive dark:text-destructive flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Réclamation pour {shipment.tracking_number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {claimSubmitted ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-success/20 dark:bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-success dark:text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-success mb-2">Réclamation Soumise!</h3>
                    <p className="text-muted-foreground">Votre réclamation a été envoyée avec succès.</p>
                  </div>
                ) : (
                  <form onSubmit={handleClaimSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_name">Nom Complet *</Label>
                        <Input
                          id="client_name"
                          placeholder="Votre nom"
                          value={claimData.client_name}
                          onChange={(e) => setClaimData(prev => ({...prev, client_name: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="client_phone">Téléphone *</Label>
                        <Input
                          id="client_phone"
                          placeholder="0555123456"
                          value={claimData.client_phone}
                          onChange={(e) => setClaimData(prev => ({...prev, client_phone: e.target.value}))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="client_email">Email (Optionnel)</Label>
                      <Input
                        id="client_email"
                        type="email"
                        placeholder="votre.email@example.com"
                        value={claimData.client_email}
                        onChange={(e) => setClaimData(prev => ({...prev, client_email: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="claim_type">Type de Problème *</Label>
                      <Select value={claimData.claim_type} onValueChange={(value) => setClaimData(prev => ({...prev, claim_type: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAMAGED_PACKAGE">Colis Endommagé</SelectItem>
                          <SelectItem value="LOST_PACKAGE">Colis Perdu</SelectItem>
                          <SelectItem value="LATE_DELIVERY">Livraison Tardive</SelectItem>
                          <SelectItem value="WRONG_DELIVERY">Mauvaise Livraison</SelectItem>
                          <SelectItem value="BILLING_ISSUE">Problème Facturation</SelectItem>
                          <SelectItem value="SERVICE_QUALITY">Qualité Service</SelectItem>
                          <SelectItem value="OTHER">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description du Problème *</Label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez votre problème..."
                        value={claimData.description}
                        onChange={(e) => setClaimData(prev => ({...prev, description: e.target.value}))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Soumettre
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowClaimForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}