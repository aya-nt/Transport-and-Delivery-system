"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Truck, DollarSign, AlertTriangle, Users, Car, MapPin, Phone, MessageCircle, Bike } from "lucide-react"

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

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Track your shipment</h2>

        <form className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter tracking number (e.g., NP19357724)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary"
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              router.push("/tracking")
            }}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
          >
            Find
          </button>
        </form>

        <p className="text-text-secondary text-sm mb-6">
          Your Delivery Laptop from the store is arriving today - you just take the laptop from store.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Shipment Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">Product</p>
                <p className="text-text-primary font-semibold">Laptop</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">From</p>
                <p className="text-text-primary font-semibold">Addie Roma</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">To</p>
                <p className="text-text-primary font-semibold">Shannon Abshire</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">Weight</p>
                <p className="text-text-primary font-semibold">6 kg</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">Price</p>
                <p className="text-text-primary font-semibold">150$</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">Ordered Date</p>
                <p className="text-text-primary font-semibold">13 May 2023</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                AG
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Contact for detail</p>
                <p className="text-text-primary font-semibold">Allie Gothic</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all hover:scale-110 active:scale-95">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="w-10 h-10 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all hover:scale-110 active:scale-95">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex border-b border-gray-200 mb-4">
              <button className="px-4 py-2 font-medium text-text-secondary hover:text-primary transition-colors">
                Order Details
              </button>
              <button className="px-4 py-2 font-semibold text-primary border-b-2 border-primary">Tracking</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-blue-100"></div>
                  <div className="w-0.5 h-16 bg-primary"></div>
                </div>
                <div className="flex-1 pt-0">
                  <p className="text-sm text-text-secondary">Departure Date</p>
                  <p className="text-text-primary font-semibold">14 May 2023, 3:35 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="w-0.5 h-16 bg-gray-300"></div>
                </div>
                <div className="flex-1 pt-0">
                  <p className="text-sm text-text-secondary">Arrival Date</p>
                  <p className="text-text-primary font-semibold">16 May 2023, 3:35 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center text-text-secondary">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-xl font-semibold">Map View</p>
            <p className="text-sm">Tracking route visualization</p>
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

      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Favorites</h2>
          <Link href="/favorites" className="text-primary font-semibold hover:underline hover:scale-105 transition-all">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/clients"
            className="p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg">Clients</h3>
                <p className="text-sm text-text-secondary">Manage clients</p>
              </div>
            </div>
          </Link>

          <Link
            href="/drivers"
            className="p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg">Drivers</h3>
                <p className="text-sm text-text-secondary">View drivers</p>
              </div>
            </div>
          </Link>

          <Link
            href="/vehicles"
            className="p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg">Vehicles</h3>
                <p className="text-sm text-text-secondary">Fleet management</p>
              </div>
            </div>
          </Link>
        </div>
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
    </div>
  )
}
