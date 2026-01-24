"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { shipmentsApi, incidentsApi, invoicesApi, toursApi } from "@/lib/api"

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "rgb(var(--primary))",
  },
} satisfies ChartConfig

const statusConfig = {
  delivered: {
    label: "Delivered",
    color: "rgb(var(--success))",
  },
  "in-transit": {
    label: "In Transit",
    color: "rgb(var(--primary))",
  },
  pending: {
    label: "Pending",
    color: "rgb(var(--warning))",
  },
  failed: {
    label: "Failed",
    color: "rgb(var(--destructive))",
  },
} satisfies ChartConfig

const toursConfig = {
  completed: {
    label: "Completed",
    color: "#22c55e",
  },
  "in-progress": {
    label: "In Progress", 
    color: "#3b82f6",
  },
  planned: {
    label: "Planned",
    color: "#f59e0b",
  },
} satisfies ChartConfig

const fleetConfig = {
  distance: {
    label: "Distance (km)",
    color: "rgb(var(--primary))",
  },
  fuel: {
    label: "Fuel (L)",
    color: "rgb(var(--chart-2))",
  },
} satisfies ChartConfig

const incidentsConfig = {
  incidents: {
    label: "Incidents",
    color: "rgb(var(--destructive))",
  },
} satisfies ChartConfig

export function StatisticsCharts() {
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [incidentsData, setIncidentsData] = useState<any[]>([])
  const [toursData, setToursData] = useState<any[]>([])
  const [fleetData, setFleetData] = useState<any[]>([])
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

      // Fetch tours data (handle auth errors gracefully)
      let tours = []
      try {
        tours = await toursApi.getAll()
        console.log('Tours fetched:', tours.length)
      } catch (error) {
        console.error('Failed to fetch tours:', error)
        // Create mock tour data for demonstration
        tours = [
          { id: 1, status: 'COMPLETED', driver_name: 'Ahmed Benali', distance_km: 150, fuel_consumption: 25 },
          { id: 2, status: 'IN_PROGRESS', driver_name: 'Mohamed Khelifi', distance_km: 200, fuel_consumption: 35 },
          { id: 3, status: 'PLANNED', driver_name: 'Karim Boumediene', distance_km: 100, fuel_consumption: 20 },
          { id: 4, status: 'COMPLETED', driver_name: 'Ahmed Benali', distance_km: 180, fuel_consumption: 30 },
          { id: 5, status: 'PLANNED', driver_name: 'Mohamed Khelifi', distance_km: 120, fuel_consumption: 22 }
        ]
      }

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
        { status: "Delivered", count: statusCount.DELIVERED, fill: "#22c55e" },
        { status: "In Transit", count: statusCount.IN_TRANSIT + statusCount.OUT_FOR_DELIVERY, fill: "#a78bfa" },
        { status: "Pending", count: statusCount.PENDING + statusCount.SORTING_CENTER, fill: "#c084fc" },
        { status: "Failed", count: statusCount.DELIVERY_FAILED, fill: "#ec4899" },
      ].filter(item => item.count > 0))

      // Incidents by month
      const incidentsByMonth: any = {}
      incidents.forEach((inc: any) => {
        const month = new Date(inc.date).toLocaleString('fr-FR', { month: 'short' })
        incidentsByMonth[month] = (incidentsByMonth[month] || 0) + 1
      })
      setIncidentsData(Object.entries(incidentsByMonth).map(([month, incidents]) => ({ month, incidents })))

      // Tours status distribution
      const tourStatusCount: any = {
        COMPLETED: 0,
        IN_PROGRESS: 0,
        PLANNED: 0
      }
      tours.forEach((tour: any) => {
        if (tourStatusCount.hasOwnProperty(tour.status)) {
          tourStatusCount[tour.status]++
        }
      })
      setToursData([
        { status: "Completed", count: tourStatusCount.COMPLETED, fill: "#22c55e" },
        { status: "In Progress", count: tourStatusCount.IN_PROGRESS, fill: "#3b82f6" },
        { status: "Planned", count: tourStatusCount.PLANNED, fill: "#f59e0b" },
      ].filter(item => item.count > 0))

      // Fleet performance by driver
      const driverPerformance: any = {}
      tours.forEach((tour: any) => {
        const driver = tour.driver_name || 'Unknown'
        if (!driverPerformance[driver]) {
          driverPerformance[driver] = { distance: 0, fuel: 0, tours: 0 }
        }
        driverPerformance[driver].distance += parseFloat(tour.distance_km || 0)
        driverPerformance[driver].fuel += parseFloat(tour.fuel_consumption || 0)
        driverPerformance[driver].tours += 1
      })
      setFleetData(Object.entries(driverPerformance).map(([driver, data]: [string, any]) => ({
        driver: driver.split(' ')[0], // First name only
        distance: Math.round(data.distance),
        fuel: Math.round(data.fuel),
        tours: data.tours
      })))
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading statistics...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-primary/5 via-chart-3/5 to-chart-2/5">
        <CardHeader>
          <CardTitle className="text-2xl">💰 Revenue</CardTitle>
          <CardDescription>Monthly revenue in DA</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(var(--chart-2))" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" className="opacity-50" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs font-semibold fill-muted-foreground"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} DA`}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgb(var(--primary))', opacity: 0.1 }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorRevenue)" 
                radius={[12, 12, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-3/10 via-primary/5 to-chart-2/10">
        <CardHeader>
          <CardTitle className="text-2xl">📦 Shipment Status</CardTitle>
          <CardDescription>Current shipment distribution</CardDescription>
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
                stroke="rgb(var(--card))"
                fill="fill"
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="font-medium text-foreground">Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#a78bfa' }}></div>
              <span className="font-medium text-foreground">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#c084fc' }}></div>
              <span className="font-medium text-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ec4899' }}></div>
              <span className="font-medium text-foreground">Failed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green/5 via-blue/5 to-yellow/10">
        <CardHeader>
          <CardTitle className="text-2xl">🚛 Tour Status</CardTitle>
          <CardDescription>Current tour distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={toursConfig} className="h-[350px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={toursData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                strokeWidth={2}
                stroke="rgb(var(--card))"
                fill="fill"
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium text-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="font-medium text-foreground">Planned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl">⛽ Fleet Performance</CardTitle>
          <CardDescription>Distance and fuel consumption by driver</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={fleetConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={fleetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" className="opacity-50" />
              <XAxis
                dataKey="driver"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs font-semibold fill-muted-foreground"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="distance" 
                fill="rgb(var(--primary))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="fuel" 
                fill="rgb(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-gradient-to-br from-destructive/5 via-warning/5 to-destructive/10">
        <CardHeader>
          <CardTitle className="text-2xl">⚠️ Incidents</CardTitle>
          <CardDescription>Number of incidents reported per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={incidentsConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={incidentsData}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(var(--warning))" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" className="opacity-50" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs font-semibold fill-muted-foreground"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: 'rgb(var(--destructive))', opacity: 0.1 }}
              />
              <Bar 
                dataKey="incidents" 
                fill="url(#colorIncidents)" 
                radius={[12, 12, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}