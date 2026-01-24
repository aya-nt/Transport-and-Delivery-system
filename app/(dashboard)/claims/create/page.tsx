"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateClaimPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    client: "",
    shipment: "",
    claim_type: "",
    description: "",
    priority: "NORMAL"
  })

  useEffect(() => {
    const shipment = searchParams.get('shipment')
    if (shipment) {
      setFormData(prev => ({ ...prev, shipment }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit to API
    console.log("Creating claim:", formData)
    // router.push("/claims")
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/claims">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle Réclamation</h1>
          <p className="text-muted-foreground">Créer une nouvelle réclamation client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de la Réclamation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.client} onValueChange={(value) => handleChange("client", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">SARL Naftal Distribution</SelectItem>
                    <SelectItem value="2">EURL Cevital Logistique</SelectItem>
                    <SelectItem value="3">SPA Condor Electronics</SelectItem>
                    <SelectItem value="4">SARL Danone Djurdjura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipment">Numéro d'Expédition (Optionnel)</Label>
                <Input
                  id="shipment"
                  placeholder="DZ20241000"
                  value={formData.shipment}
                  onChange={(e) => handleChange("shipment", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claim_type">Type de Réclamation *</Label>
                <Select value={formData.claim_type} onValueChange={(value) => handleChange("claim_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
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
                <Label htmlFor="priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="NORMAL">Normale</SelectItem>
                    <SelectItem value="HIGH">Élevée</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description Détaillée *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le problème en détail..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Créer la Réclamation
              </Button>
              <Link href="/claims">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}