"use client"

import { useState, useEffect } from "react"
import BackButton from "@/components/layout/back-button"
import { serviceTypesApi } from "@/lib/api"

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServiceTypes() {
      try {
        const data = await serviceTypesApi.getAll()
        setServiceTypes(data)
      } catch (error) {
        console.error('Failed to fetch service types:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServiceTypes()
  }, [])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Service Types</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          Add Service Type
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading service types...</div>
      ) : serviceTypes.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <p className="text-text-secondary">No service types found</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.map((type: any) => (
                <tr key={type.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{type.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
