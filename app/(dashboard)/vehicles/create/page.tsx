"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { vehiclesApi } from "@/lib/api"
import { Truck, Package, Box, Bike } from "lucide-react"

export default function CreateVehiclePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    license_plate: "",
    vehicle_type: "",
    capacity: "",
    status: "AVAILABLE",
  })
  const [loading, setLoading] = useState(false)
  const [hoveredType, setHoveredType] = useState<string | null>(null)

  const vehicleTypes = [
    { value: "Camion", label: "Camion", icon: Truck },
    { value: "Camionnette", label: "Camionnette", icon: Package },
    { value: "Fourgon", label: "Fourgon", icon: Box },
    { value: "Moto", label: "Moto", icon: Bike },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await vehiclesApi.create(formData)
      router.push("/vehicles")
    } catch (error) {
      console.error('Failed to create vehicle:', error)
      alert('Failed to create vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Add Vehicle</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Matricule (License Plate)</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                required
                pattern="\d{6}-\d{2}"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123456-16 (Format algérien)"
              />
              <p className="text-xs text-muted-foreground mt-1">Format: 6 chiffres - 2 chiffres wilaya</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Type de Véhicule</label>
              <div className="grid grid-cols-2 gap-3">
                {vehicleTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = formData.vehicle_type === type.value
                  const isHovered = hoveredType === type.value
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, vehicle_type: type.value })}
                      onMouseEnter={() => setHoveredType(type.value)}
                      onMouseLeave={() => setHoveredType(null)}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10 text-blue-600"
                          : isHovered
                          ? "border-blue-500 bg-blue-500/10 text-blue-600 scale-105"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Capacité (kg)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="AVAILABLE">Disponible</option>
              <option value="IN_USE">En Service</option>
              <option value="MAINTENANCE">En Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/vehicles")}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? "Ajout..." : "Ajouter Véhicule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
