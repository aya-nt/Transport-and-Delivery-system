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
        <h1 className="text-3xl font-bold text-foreground">Service Types</h1>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-colors shadow-lg hover:shadow-xl">
          Add Service Type
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading service types...</div>
      ) : serviceTypes.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <p className="text-muted-foreground">No service types found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.map((type: any) => (
                <tr key={type.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{type.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
