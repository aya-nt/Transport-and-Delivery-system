"use client"

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const claimsData = [
  { month: "Jan", claims: 2 },
  { month: "Feb", claims: 1 },
  { month: "Mar", claims: 3 },
  { month: "Apr", claims: 0 },
  { month: "May", claims: 4 },
  { month: "Jun", claims: 1 },
]

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 25000 },
]

const statusData = [
  { status: "Delivered", count: 450, fill: "var(--color-delivered)" },
  { status: "In Transit", count: 120, fill: "var(--color-in-transit)" },
  { status: "Pending", count: 80, fill: "var(--color-pending)" },
  { status: "Failed", count: 15, fill: "var(--color-failed)" },
]

const claimsConfig = {
  claims: {
    label: "Claims",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const statusConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  "in-transit": {
    label: "In Transit",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function StatisticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly turnover for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Status</CardTitle>
          <CardDescription>Current distribution of shipment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Claims & Incidents</CardTitle>
          <CardDescription>Number of reported incidents per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={claimsConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={claimsData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="claims" fill="var(--color-claims)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
