"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { driversApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"

export default function DriversPage() {
  const router = useRouter()
  const { user } = useUser()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur?')) return
    
    try {
      await driversApi.delete(id)
      fetchDrivers()
    } catch (error: any) {
      console.error('Failed to delete driver:', error)
      if (error.message.includes('user account')) {
        alert('Cannot delete driver with a user account. Please delete the user account from Settings > Roles instead.')
      } else {
        alert('Échec de la suppression du chauffeur')
      }
    }
  }

  if (user?.role === 'DRIVER') {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Access Restricted</h2>
            <p className="text-text-secondary">Drivers cannot access driver management.</p>
            <p className="text-text-secondary mt-2">Please use the Shipments section to view your deliveries.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Drivers</h1>
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
        <div className="text-center py-8 text-text-secondary">No drivers found</div>
      ) : (
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">License Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver: any) => (
              <tr key={driver.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{driver.name}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{driver.license_number}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{driver.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      driver.status === "AVAILABLE" ? "bg-green-100 text-success" : 
                      driver.status === "ON_DUTY" ? "bg-blue-100 text-primary" : 
                      "bg-gray-100 text-gray-700"
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
