"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Truck, Calendar, MapPin, Fuel, Clock, AlertCircle } from "lucide-react"
import BackButton from "@/components/layout/back-button"
import { toursApi } from "@/lib/api"

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      const data = await toursApi.getAll()
      setTours(data)
    } catch (error) {
      console.error('Failed to fetch tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTours = tours.filter(tour => 
    !filter || tour.status === filter
  )

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Delivery Tours</h1>
        <Link
          href="/tours/create"
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105"
        >
          Create Tour
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading tours...</p>
        ) : filteredTours.length === 0 ? (
          <p className="text-muted-foreground">No tours found</p>
        ) : (
          <div className="space-y-4">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold">Tour #{tour.id}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          tour.status === 'PLANNED' ? 'bg-blue-100 text-blue-600' :
                          tour.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}
                      >
                        {tour.status === 'PLANNED' ? 'Planned' :
                         tour.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(tour.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="w-4 h-4" />
                        <span>{tour.driver_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.distance_km || 0} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration_hours || 0} hrs</span>
                      </div>
                    </div>

                    {tour.shipments_count > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {tour.shipments_count} shipment(s) assigned
                      </div>
                    )}

                    {tour.incidents && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-orange-600">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>{tour.incidents}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
