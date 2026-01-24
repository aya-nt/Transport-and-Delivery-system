"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { vehiclesApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function VehiclesPage() {
  const router = useRouter()
  const { can, user } = useUser()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
    try {
      const data = await vehiclesApi.getAll()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteId(id)
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    
    try {
      await vehiclesApi.delete(deleteId)
      fetchVehicles()
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
      alert('Failed to delete vehicle')
    } finally {
      setDeleteId(null)
    }
  }

  if (user?.role === 'DRIVER') {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">Drivers cannot access vehicle management.</p>
            <p className="text-muted-foreground mt-2">Please use the Shipments section to view your deliveries.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Supprimer le véhicule"
        message="Êtes-vous sûr de vouloir supprimer ce véhicule? Cette action est irréversible."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
        {can.manageVehicles() && (
          <button
            onClick={() => router.push("/vehicles/create")}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Add Vehicle
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No vehicles found</div>
      ) : (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Plate Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle: any) => (
              <tr key={vehicle.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{vehicle.license_plate}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{vehicle.vehicle_type}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{vehicle.capacity} kg</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      vehicle.status === "AVAILABLE" ? "bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300" : 
                      vehicle.status === "IN_USE" ? "bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300" : 
                      "bg-yellow-100 text-warning dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {vehicle.status === "AVAILABLE" ? "Available" : 
                     vehicle.status === "IN_USE" ? "In Use" : 
                     "Maintenance"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {can.manageVehicles() && (
                    <>
                      <button 
                        onClick={() => router.push(`/vehicles/edit/${vehicle.id}`)}
                        className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-error hover:underline hover:scale-105 transition-all font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
