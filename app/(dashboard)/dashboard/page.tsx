"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Truck, DollarSign, AlertTriangle, Bike } from "lucide-react"

import { StatisticsCharts } from "@/components/dashboard/statistics-charts"

export default function DashboardPage() {
  const router = useRouter()


  const quickActions = [
    {
      label: "Create Shipment",
      onClick: () => router.push("/shipments/create"),
      primary: true,
    },
    {
      label: "Track Package",
      onClick: () => router.push("/tracking"),
      primary: false,
    },
    {
      label: "New Invoice",
      onClick: () => router.push("/billing/invoices"),
      primary: false,
    },
    {
      label: "View Reports",
      onClick: () => router.push("/shipments/journal"),
      primary: false,
    },
  ]

  const metricCards = [
    {
      title: "Total Shipments",
      value: "1,234",
      change: "+12% from last month",
      changeType: "success",
      link: "/shipments/journal",
      icon: Package,
    },
    {
      title: "Active Deliveries",
      value: "56",
      change: "8 pending pickup",
      changeType: "warning",
      link: "/tracking",
      icon: Truck,
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8% from last month",
      changeType: "success",
      link: "/billing/invoices",
      icon: DollarSign,
    },
    {
      title: "Incidents",
      value: "3",
      change: "Requires attention",
      changeType: "error",
      link: "/incidents",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.link}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 active:scale-100 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-secondary text-sm font-semibold uppercase tracking-wide">{card.title}</h3>
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-4xl font-bold text-text-primary mb-2">{card.value}</p>
              <p
                className={`text-sm font-medium ${
                  card.changeType === "success"
                    ? "text-green-600"
                    : card.changeType === "warning"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {card.change}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-md border border-blue-100">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Add New Package</h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-text-secondary mb-6">You can add new package by click below.</p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/shipments/create")}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
              >
                Add
              </button>
              <Link
                href="/shipments/journal"
                className="px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl border-2 border-primary flex items-center"
              >
                See Packages
              </Link>
            </div>
          </div>
          <div className="w-64 h-64 flex items-center justify-center">
            <Bike className="w-48 h-48 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${
                action.primary
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-white border-2 border-gray-200 text-text-primary hover:border-primary hover:text-primary"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <StatisticsCharts />
    </div>
  )
}
