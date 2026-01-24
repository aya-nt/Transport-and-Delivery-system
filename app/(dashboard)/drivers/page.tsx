"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { driversApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function DriversPage() {
  const router = useRouter()
  const { user } = useUser()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchDrivers()
  }, [])

  async function fetchDrivers() {
    try {
      const data = await driversApi.getAll()
      setDrivers(data)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
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
      await driversApi.delete(deleteId)
      fetchDrivers()
    } catch (error: any) {
      console.error('Failed to delete driver:', error)
      if (error.message.includes('user account')) {
        alert('Cannot delete driver with a user account. Please delete the user account from Settings > Roles instead.')
      } else {
        alert('Échec de la suppression du chauffeur')
      }
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
            <p className="text-muted-foreground">Drivers cannot access driver management.</p>
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
        title="Supprimer le chauffeur"
        message="Êtes-vous sûr de vouloir supprimer ce chauffeur? Cette action est irréversible."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
        <button
          onClick={() => router.push("/drivers/create")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Add Driver
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No drivers found</div>
      ) : (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">License Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver: any) => (
              <tr key={driver.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{driver.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{driver.license_number}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{driver.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      driver.status === "AVAILABLE" ? "bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300" : 
                      driver.status === "ON_DUTY" ? "bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300" : 
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {driver.status === "AVAILABLE" ? "Available" : 
                     driver.status === "ON_DUTY" ? "On Duty" : "Off Duty"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => router.push(`/drivers/edit/${driver.id}`)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(driver.id)}
                    className="text-error hover:underline hover:scale-105 transition-all font-medium"
                  >
                    Delete
                  </button>
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
