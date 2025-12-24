"use client"

import type React from "react"
import { Package, X, User, Phone, MessageCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("NP19357724")
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Searching for:", trackingNumber)
  }

  const handleTabSwitch = (tab: "details" | "tracking") => {
    console.log("[v0] Switching to tab:", tab)
    setActiveTab(tab)
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Tracking</h1>

      {/* Track Your Shipment */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Track your shipment</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all"
            placeholder="Enter tracking number"
          />
          <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
            Find
          </button>
        </form>
        <p className="text-sm text-text-secondary mt-4">
          Your Delivery Laptop from the store is arriving today. You just take the laptop from store.
        </p>
      </div>

      {/* Tracking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-sm p-6">
          {/* Tabs Navigation */}
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => handleTabSwitch("details")}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === "details"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => handleTabSwitch("tracking")}
              className={`pb-3 font-medium transition-all relative ${
                activeTab === "tracking"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Tracking
            </button>
          </div>

          {/* Conditionally Render Content Based on Active Tab */}
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Product</p>
                    <p className="font-medium">Laptop</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">From</p>
                    <p className="font-medium">Addie Roma</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">To</p>
                    <p className="font-medium">Shannon Abshire</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Weight</p>
                    <p className="font-medium">6 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Price</p>
                    <p className="font-medium">150$</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Ordered Date</p>
                    <p className="font-medium">13 May 2023</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Contact for detail</p>
                      <p className="text-sm text-text-secondary">Allie Gothic</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button className="p-2 rounded-lg border border-border hover:bg-gray-50 hover:scale-110 transition-all">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg border border-border hover:bg-gray-50 hover:scale-110 transition-all">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
              <div className="space-y-6">
                {/* Timeline */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                      <div className="w-0.5 h-20 bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-secondary text-sm mb-1">Departure Date</p>
                      <p className="text-lg font-semibold">14 May 2023, 3:35 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-text-secondary text-sm mb-1">Arrival Date</p>
                      <p className="text-lg font-semibold">16 May 2023, 3:35 PM</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-6 border-t border-border">
                  <div className="relative">
                    <div className="flex justify-between items-start">
                      {[
                        { label: "Destination", active: true },
                        { label: "Picked-up Order", active: true },
                        { label: "Arrived at Pickup", active: false },
                        { label: "Route for Pickup", active: false },
                        { label: "Carrier Accepted Order", active: false },
                      ].map((stage, index) => (
                        <div key={stage.label} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-4 h-4 rounded-full z-10 ${
                              stage.active ? "bg-primary ring-4 ring-primary/20" : "bg-gray-300"
                            }`}
                          />
                          <p className="text-xs text-center mt-2 text-text-secondary max-w-[80px]">{stage.label}</p>
                          {index < 4 && (
                            <div
                              className={`absolute top-2 left-1/2 w-full h-0.5 ${
                                stage.active ? "bg-primary" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center border border-border hover:border-primary transition-colors">
                  <p className="text-text-secondary">Interactive map view will be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Link href="/notifications" className="text-primary text-sm hover:underline hover:scale-105 transition-all">
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Package Arrived",
                desc: "Parcel (ID 1234 8765) has been delivered",
                time: "10 minutes ago",
                action: "Reorder",
                icon: Package,
                parcelId: "1234-8765",
              },
              {
                title: "Package Received At Post",
                desc: "Parcel (ID 6457 2244) has been received",
                time: "1 Hour ago",
                action: "Reorder",
                icon: Package,
                parcelId: "6457-2244",
              },
              {
                title: "Order Cancelled",
                desc: "Parcel (ID 6411 1122) has been cancelled",
                time: "2 Hours ago",
                action: "Cancelled",
                icon: X,
                parcelId: "6411-1122",
              },
            ].map((notification, index) => (
              <div
                key={index}
                onClick={() => router.push(`/shipments/journal`)}
                className="border-b border-border pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <notification.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-xs text-text-secondary mb-1">{notification.desc}</p>
                    <p className="text-xs text-text-muted mb-2">{notification.time}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (notification.action === "Reorder") {
                          router.push("/shipments/create")
                        }
                      }}
                      className={`text-xs font-medium hover:underline hover:scale-105 transition-transform ${
                        notification.action === "Cancelled" ? "text-error" : "text-warning"
                      }`}
                    >
                      {notification.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
