"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { toursApi, driversApi, vehiclesApi, shipmentsApi } from "@/lib/api"

export default function CreateTourPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    driver: "",
    vehicle: "",
    shipments: [] as number[],
    distance_km: "",
    duration_hours: "",
    fuel_consumption: "",
    incidents: "",
    status: "PLANNED",
  })
  const [drivers, setDrivers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [driversData, vehiclesData, shipmentsData] = await Promise.all([
        driversApi.getAll(),
        vehiclesApi.getAll(),
        shipmentsApi.getAll(),
      ])
      setDrivers(driversData)
      setVehicles(vehiclesData.filter((v: any) => v.status === 'AVAILABLE'))
      setShipments(shipmentsData.filter((s: any) => s.status === 'PENDING'))
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await toursApi.create(formData)
      router.push("/tours")
    } catch (error) {
      console.error('Failed to create tour:', error)
      alert('Failed to create tour. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleShipment = (id: number) => {
    setFormData(prev => ({
      ...prev,
      shipments: prev.shipments.includes(id)
        ? prev.shipments.filter(s => s !== id)
        : [...prev.shipments, id]
    }))
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-foreground">Create Delivery Tour</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Driver</label>
              <select
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Vehicle</label>
              <select
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>{vehicle.license_plate} - {vehicle.vehicle_type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Select Shipments</label>
            <div className="border border-border rounded-lg p-4 max-h-64 overflow-y-auto bg-background">
              {shipments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending shipments available</p>
              ) : (
                shipments.map((shipment) => (
                  <label key={shipment.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipments.includes(shipment.id)}
                      onChange={() => toggleShipment(shipment.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{shipment.tracking_number} - {shipment.destination_name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Distance (km)</label>
              <input
                type="number"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Duration (hours)</label>
              <input
                type="number"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                step="0.1"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Fuel Consumption (L)</label>
              <input
                type="number"
                value={formData.fuel_consumption}
                onChange={(e) => setFormData({ ...formData, fuel_consumption: e.target.value })}
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Incidents / Notes</label>
            <textarea
              value={formData.incidents}
              onChange={(e) => setFormData({ ...formData, incidents: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any incidents, delays, or technical issues..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/tours")}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
