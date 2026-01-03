"use client"

import { useState, useEffect } from "react"
import BackButton from "@/components/layout/back-button"
import { destinationsApi } from "@/lib/api"

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await destinationsApi.getAll()
        setDestinations(data)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Destinations</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          Add Destination
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading destinations...</div>
      ) : destinations.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <p className="text-text-secondary">No destinations found</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">City</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest: any) => (
                <tr key={dest.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">{dest.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{dest.address}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{dest.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
