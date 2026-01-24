"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Package, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PublicClaimPage() {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    shipment_tracking: "",
    claim_type: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
    } catch (error) {
      alert('Erreur lors de la soumission. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10 dark:from-primary/5 dark:via-chart-3/5 dark:to-chart-2/5">
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
              <Link href="/track" className="text-primary hover:underline font-medium transition-colors">
                Suivi de Colis
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-success/20 dark:bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-success dark:text-success" />
              </div>
              <CardTitle className="text-2xl text-success">Réclamation Soumise!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Votre réclamation a été soumise avec succès. Notre équipe la traitera dans les plus brefs délais.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Link href="/track">
                  <Button variant="outline">Suivi de Colis</Button>
                </Link>
                <Button onClick={() => setSuccess(false)}>
                  Nouvelle Réclamation
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10 dark:from-primary/5 dark:via-chart-3/5 dark:to-chart-2/5">
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
            <Link href="/track" className="text-primary hover:underline font-medium transition-colors">
              Suivi de Colis
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-destructive/20 dark:bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive dark:text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Faire une Réclamation</h2>
          <p className="text-muted-foreground">Signalez un problème avec votre expédition</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nom Complet *</Label>
                  <Input
                    id="client_name"
                    placeholder="Votre nom complet"
                    value={formData.client_name}
                    onChange={(e) => handleChange("client_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Téléphone *</Label>
                  <Input
                    id="client_phone"
                    placeholder="0555123456"
                    value={formData.client_phone}
                    onChange={(e) => handleChange("client_phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Email (Optionnel)</Label>
                <Input
                  id="client_email"
                  type="email"
                  placeholder="votre.email@example.com"
                  value={formData.client_email}
                  onChange={(e) => handleChange("client_email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipment_tracking">Numéro de Suivi (Optionnel)</Label>
                <Input
                  id="shipment_tracking"
                  placeholder="DZ20241000"
                  value={formData.shipment_tracking}
                  onChange={(e) => handleChange("shipment_tracking", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claim_type">Type de Réclamation *</Label>
                <Select value={formData.claim_type} onValueChange={(value) => handleChange("claim_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de problème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAMAGED_PACKAGE">Colis Endommagé</SelectItem>
                    <SelectItem value="LOST_PACKAGE">Colis Perdu</SelectItem>
                    <SelectItem value="LATE_DELIVERY">Livraison Tardive</SelectItem>
                    <SelectItem value="WRONG_DELIVERY">Mauvaise Livraison</SelectItem>
                    <SelectItem value="BILLING_ISSUE">Problème de Facturation</SelectItem>
                    <SelectItem value="SERVICE_QUALITY">Qualité du Service</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description du Problème *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre problème en détail..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Envoi en cours..." : "Soumettre la Réclamation"}
                </Button>
                <Link href="/track">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}