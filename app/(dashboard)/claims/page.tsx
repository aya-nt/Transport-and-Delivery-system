"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Eye, Edit } from "lucide-react"
import Link from "next/link"

interface Claim {
  id: number
  client: string
  shipment?: string
  claim_type: string
  status: string
  date: string
  assigned_to?: string
  description: string
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800", 
  RESOLVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
}

const claimTypeLabels = {
  DAMAGED_PACKAGE: "Colis Endommagé",
  LOST_PACKAGE: "Colis Perdu",
  LATE_DELIVERY: "Livraison Tardive",
  WRONG_DELIVERY: "Mauvaise Livraison",
  BILLING_ISSUE: "Problème Facturation",
  SERVICE_QUALITY: "Qualité Service",
  OTHER: "Autre"
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    // Mock data - replace with API call
    const mockClaims: Claim[] = [
      {
        id: 1,
        client: "SARL Naftal Distribution",
        shipment: "DZ20241000",
        claim_type: "DAMAGED_PACKAGE",
        status: "PENDING",
        date: "2024-01-07",
        description: "Le colis est arrivé endommagé avec des traces de choc."
      },
      {
        id: 2,
        client: "EURL Cevital Logistique", 
        shipment: "DZ20241001",
        claim_type: "LATE_DELIVERY",
        status: "IN_PROGRESS",
        date: "2024-01-06",
        assigned_to: "Amina Boudjelal",
        description: "La livraison a eu lieu avec 3 jours de retard."
      },
      {
        id: 3,
        client: "SPA Condor Electronics",
        claim_type: "BILLING_ISSUE", 
        status: "RESOLVED",
        date: "2024-01-05",
        assigned_to: "Salim Hadj",
        description: "Erreur dans la facturation, montant incorrect."
      }
    ]
    setClaims(mockClaims)
    setFilteredClaims(mockClaims)
  }, [])

  useEffect(() => {
    let filtered = claims.filter(claim => {
      const matchesSearch = claim.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.shipment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || claim.status === statusFilter
      const matchesType = typeFilter === "all" || claim.claim_type === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
    setFilteredClaims(filtered)
  }, [claims, searchTerm, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Réclamations</h1>
          <p className="text-muted-foreground">Gérer les réclamations clients</p>
        </div>
        <Link href="/claims/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Réclamation
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par client, expédition ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En Attente</SelectItem>
                <SelectItem value="IN_PROGRESS">En Cours</SelectItem>
                <SelectItem value="RESOLVED">Résolu</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="DAMAGED_PACKAGE">Colis Endommagé</SelectItem>
                <SelectItem value="LOST_PACKAGE">Colis Perdu</SelectItem>
                <SelectItem value="LATE_DELIVERY">Livraison Tardive</SelectItem>
                <SelectItem value="WRONG_DELIVERY">Mauvaise Livraison</SelectItem>
                <SelectItem value="BILLING_ISSUE">Problème Facturation</SelectItem>
                <SelectItem value="SERVICE_QUALITY">Qualité Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Réclamations ({filteredClaims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Expédition</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">#{claim.id}</TableCell>
                  <TableCell>{claim.client}</TableCell>
                  <TableCell>{claim.shipment || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {claimTypeLabels[claim.claim_type as keyof typeof claimTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[claim.status as keyof typeof statusColors]}>
                      {claim.status === "PENDING" && "En Attente"}
                      {claim.status === "IN_PROGRESS" && "En Cours"}
                      {claim.status === "RESOLVED" && "Résolu"}
                      {claim.status === "CANCELLED" && "Annulé"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(claim.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{claim.assigned_to || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}