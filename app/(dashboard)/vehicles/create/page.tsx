"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { vehiclesApi } from "@/lib/api"

export default function CreateVehiclePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    license_plate: "",
    vehicle_type: "",
    capacity: "",
    status: "AVAILABLE",
  })
  const [loading, setLoading] = useState(false)

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

      <h1 className="text-3xl font-bold text-text-primary">Add Vehicle</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Matricule (License Plate)</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                required
                pattern="\d{6}-\d{2}"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123456-16 (Format algérien)"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 6 chiffres - 2 chiffres wilaya</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type de Véhicule</label>
              <select 
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner le type</option>
                <option value="Camion">Camion</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Moto">Moto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Capacité (kg)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
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
