"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, FileText, Truck, MapPin, Star } from "lucide-react"

const availableShortcuts = [
  { id: "create-shipment", label: "Create Shipment", href: "/shipments/create", icon: Package },
  { id: "shipments-journal", label: "Shipments Journal", href: "/shipments/journal", icon: Package },
  { id: "create-invoice", label: "Create Invoice", href: "/billing/invoices/create", icon: FileText },
  { id: "tracking", label: "Package Tracking", href: "/tracking", icon: MapPin },
  { id: "vehicles", label: "Vehicles", href: "/vehicles", icon: Truck },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites")
      return saved ? JSON.parse(saved) : ["create-shipment", "tracking"]
    }
    return ["create-shipment", "tracking"]
  })

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const favoriteShortcuts = availableShortcuts.filter((s) => favorites.includes(s.id))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Favorites</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteShortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 flex flex-col items-center gap-3 hover:scale-105"
              >
                <Icon className="w-8 h-8 text-primary" />
                <span className="font-medium text-foreground">{shortcut.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Customize Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableShortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            const isFavorite = favorites.includes(shortcut.id)
            return (
              <button
                key={shortcut.id}
                onClick={() => toggleFavorite(shortcut.id)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  isFavorite
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">{shortcut.label}</span>
                <Star className={`w-5 h-5 ${isFavorite ? "fill-primary" : ""}`} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
