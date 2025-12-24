"use client"

import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { Package, MapPin, ClipboardList, CreditCard } from "lucide-react"

export default function FavoritesPage() {
  const router = useRouter()

  const favorites = [
    { name: "Create Shipment", path: "/shipments/create", icon: Package },
    { name: "Shipment Tracking", path: "/tracking", icon: MapPin },
    { name: "Tours Journal", path: "/shipments/journal", icon: ClipboardList },
    { name: "Invoicing / Payments", path: "/billing/invoices", icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Favorites</h1>
      <p className="text-text-secondary">Quick access to your most used features</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:shadow-xl hover:scale-105 hover:border-primary transition-all duration-200 cursor-pointer transform active:scale-95 text-left"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
              <item.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{item.name}</h3>
          </button>
        ))}
      </div>
    </div>
  )
}
