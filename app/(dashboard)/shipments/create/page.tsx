"use client"

import { useState } from "react"
import BackButton from "@/components/layout/back-button"
import { MapPin } from "lucide-react"

export default function CreateShipmentPage() {
  // Sample clients data - in production, this would come from an API
  const [clients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ])

  const [clientName, setClientName] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [showMapModal, setShowMapModal] = useState(false)

  const handleMapSelect = (destination: string) => {
    setSelectedDestination(destination)
    setShowMapModal(false)
  }
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Create Shipment</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6">
          {/* Client, Service Type, and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <div className="relative">
                <input
                  type="text"
                  list="clients-list"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type or select client name"
                />
                <datalist id="clients-list">
                  {clients.map((client) => (
                    <option key={client.id} value={`${client.name} (${client.email})`}>
                      {client.name}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select service type</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type destination or select from map"
                />
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="px-3 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm hover:shadow-md"
                  title="Select from map"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Map Modal */}
          {showMapModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary">Select Destination from Map</h3>
                  <button
                    type="button"
                    onClick={() => setShowMapModal(false)}
                    className="text-text-secondary hover:text-text-primary transition-colors hover:scale-110 active:scale-95 p-1 rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-gray-100 rounded-lg h-96 mb-4 flex items-center justify-center border border-border relative">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-text-secondary mb-4">Interactive map will be displayed here</p>
                    <p className="text-sm text-text-secondary">Click on the map to select a destination</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={selectedDestination}
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter destination address manually"
                    onChange={(e) => setSelectedDestination(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMapModal(false)}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product, Weight, and Volume */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Volume (m³)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter package description..."
            />
          </div>

          {/* From and To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Sender name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Recipient name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            >
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
