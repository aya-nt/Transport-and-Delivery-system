"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { shipmentsApi, incidentsApi, invoicesApi } from "@/lib/api"

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const statusConfig = {
  delivered: {
    label: "Livré",
    color: "hsl(var(--chart-1))",
  },
  "in-transit": {
    label: "En transit",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "En attente",
    color: "hsl(var(--chart-3))",
  },
  failed: {
    label: "Échec",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const incidentsConfig = {
  incidents: {
    label: "Incidents",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function StatisticsCharts() {
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [incidentsData, setIncidentsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [invoices, shipments, incidents] = await Promise.all([
        invoicesApi.getAll(),
        shipmentsApi.getAll(),
        incidentsApi.getAll()
      ])

      // Revenue by month
      const revenueByMonth: any = {}
      invoices.forEach((inv: any) => {
        const month = new Date(inv.date).toLocaleString('fr-FR', { month: 'short' })
        revenueByMonth[month] = (revenueByMonth[month] || 0) + parseFloat(inv.amount_ttc || 0)
      })
      setRevenueData(Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })))

      // Shipment status distribution
      const statusCount: any = {
        DELIVERED: 0,
        IN_TRANSIT: 0,
        PENDING: 0,
        DELIVERY_FAILED: 0,
        SORTING_CENTER: 0,
        OUT_FOR_DELIVERY: 0
      }
      shipments.forEach((s: any) => {
        if (statusCount.hasOwnProperty(s.status)) {
          statusCount[s.status]++
        }
      })
      setStatusData([
        { status: "Livré", count: statusCount.DELIVERED, fill: "#10b981" },
        { status: "En transit", count: statusCount.IN_TRANSIT + statusCount.OUT_FOR_DELIVERY, fill: "#3b82f6" },
        { status: "En attente", count: statusCount.PENDING + statusCount.SORTING_CENTER, fill: "#f59e0b" },
        { status: "Échec", count: statusCount.DELIVERY_FAILED, fill: "#ef4444" },
      ].filter(item => item.count > 0))

      // Incidents by month
      const incidentsByMonth: any = {}
      incidents.forEach((inc: any) => {
        const month = new Date(inc.date).toLocaleString('fr-FR', { month: 'short' })
        incidentsByMonth[month] = (incidentsByMonth[month] || 0) + 1
      })
      setIncidentsData(Object.entries(incidentsByMonth).map(([month, incidents]) => ({ month, incidents })))
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement des statistiques...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl">💰 Revenus</CardTitle>
          <CardDescription>Chiffre d'affaires mensuel en DA</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} DA`}
                style={{ fontSize: '12px' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorRevenue)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">📦 Statut des expéditions</CardTitle>
          <CardDescription>Répartition actuelle des expéditions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusConfig} className="h-[350px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                strokeWidth={3}
                stroke="#fff"
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="font-medium">Vert = Livrés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-medium">Bleu = En transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="font-medium">Orange = En attente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="font-medium">Rouge = Échec</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-2xl">⚠️ Incidents</CardTitle>
          <CardDescription>Nombre d'incidents signalés par mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={incidentsConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={incidentsData}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                style={{ fontSize: '12px' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
              />
              <Bar 
                dataKey="incidents" 
                fill="url(#colorIncidents)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
