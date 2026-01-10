"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Truck, DollarSign, AlertTriangle } from "lucide-react"
import { StatisticsCharts } from "@/components/dashboard/statistics-charts"
import { dashboardApi, shipmentsApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeDeliveries: 0,
    incidents: 0,
    revenue: "0",
    pendingCount: 0,
    inTransitCount: 0,
  })
  const [myShipments, setMyShipments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        if (user?.role === 'DRIVER') {
          const shipments = await shipmentsApi.getAll()
          setMyShipments(shipments)
        } else {
          const data = await dashboardApi.getStats()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchData()
  }, [user])

  // Driver Dashboard
  if (user?.role === 'DRIVER') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">My Deliveries</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : myShipments.length === 0 ? (
          <div className="bg-card p-12 rounded-3xl text-center shadow-card border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No deliveries assigned yet</p>
          </div>
        ) : (
          <div className="bg-card rounded-3xl shadow-card border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tracking #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Destination</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myShipments.map((shipment: any) => (
                  <tr key={shipment.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{shipment.tracking_number}</td>
                    <td className="px-6 py-4 text-foreground">{shipment.client_name}</td>
                    <td className="px-6 py-4 text-foreground">{shipment.destination_name}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/shipments/edit/${shipment.id}`} className="text-primary hover:underline font-medium">
                        Update Status
                      </Link>
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


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shipments"
          value={loading ? "..." : stats.totalShipments}
          icon={Package}
          trend={{ value: "+12% from last month", isPositive: true }}
          gradient
          onClick={() => router.push('/shipments/journal')}
        />
        <StatCard
          title="Active Deliveries"
          value={loading ? "..." : stats.activeDeliveries}
          icon={Truck}
          trend={{ value: `${loading ? "..." : stats.pendingCount} pending`, isPositive: false }}
          onClick={() => router.push('/tracking')}
        />
        <StatCard
          title="Revenue"
          value={loading ? "..." : `${parseFloat(stats.revenue).toLocaleString()} DA`}
          icon={DollarSign}
          trend={{ value: "+8% from last month", isPositive: true }}
          gradient
          onClick={() => router.push('/billing/invoices')}
        />
        <StatCard
          title="Incidents"
          value={loading ? "..." : stats.incidents}
          icon={AlertTriangle}
          trend={{ value: "Requires attention", isPositive: false }}
          onClick={() => router.push('/incidents')}
        />
      </div>

      <StatisticsCharts />
    </div>
  )
}
