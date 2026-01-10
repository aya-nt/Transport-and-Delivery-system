"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi, clientsApi, destinationsApi, serviceTypesApi, driversApi, userApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"

export default function CreateShipmentPage() {
  const router = useRouter()
  const { user, loading: userLoading, can } = useUser()
  const [clients, setClients] = useState([])
  const [destinations, setDestinations] = useState([])
  const [serviceTypes, setServiceTypes] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    tracking_number: `SH-${Date.now()}`,
    client: "",
    destination: "",
    service_type: "",
    driver: "",
    weight: "",
    volume: "",
    description: "",
    is_international: false,
    origin_country: "",
    destination_country: "",
    customs_value: "",
    customs_currency: "DZD",
    customs_declaration: "",
    hs_code: "",
    requires_customs_clearance: false,
    customs_cleared: false,
  })

  useEffect(() => {
    // Check if user is a driver and redirect
    if (!userLoading && user) {
      if (user.role === 'DRIVER') {
        router.push('/shipments/journal')
        return
      }
    }
  }, [user, userLoading, router])

  useEffect(() => {
    async function fetchData() {
      // Don't fetch if user is a driver
      if (user && user.role === 'DRIVER') {
        return
      }
      
      try {
        const [clientsData, destinationsData, serviceTypesData, driversData] = await Promise.all([
          clientsApi.getAll(),
          destinationsApi.getAll(),
          serviceTypesApi.getAll(),
          driversApi.getAll(),
        ])
        setClients(clientsData)
        setDestinations(destinationsData)
        setServiceTypes(serviceTypesData)
        setDrivers(driversData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Prepare form data: convert empty strings to null for optional fields
      const submissionData: any = {
        ...formData,
        driver: formData.driver || null,
      }
      
      // Clean up international shipment fields
      if (!submissionData.is_international) {
        // Reset international fields if not international
        submissionData.origin_country = null
        submissionData.destination_country = null
        submissionData.customs_value = null
        submissionData.customs_declaration = null
        submissionData.hs_code = null
        submissionData.requires_customs_clearance = false
        submissionData.customs_cleared = false
      } else {
        // Convert empty strings to null for optional international fields
        submissionData.origin_country = submissionData.origin_country || null
        submissionData.destination_country = submissionData.destination_country || null
        submissionData.customs_value = submissionData.customs_value ? parseFloat(submissionData.customs_value) : null
        submissionData.customs_declaration = submissionData.customs_declaration || null
        submissionData.hs_code = submissionData.hs_code || null
      }
      
      const shipment = await shipmentsApi.create(submissionData)
      // Redirect to invoice creation with shipment ID
      router.push(`/billing/invoices/create?shipment=${shipment.id}`)
    } catch (error) {
      console.error('Failed to create shipment:', error)
      alert('Failed to create shipment')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      const updatedFormData = { ...formData, [name]: value }
      
      // Auto-detect international shipment based on service type
      if (name === 'service_type' && value) {
        const selectedServiceType = serviceTypes.find((st: any) => st.id === parseInt(value))
        if (selectedServiceType) {
          const isInternational = selectedServiceType.name?.toLowerCase().includes('international') || false
          updatedFormData.is_international = isInternational
          
          // Reset international fields if switching to non-international
          if (!isInternational) {
            updatedFormData.origin_country = ""
            updatedFormData.destination_country = ""
            updatedFormData.customs_value = ""
            updatedFormData.customs_declaration = ""
            updatedFormData.hs_code = ""
            updatedFormData.requires_customs_clearance = false
            updatedFormData.customs_cleared = false
          }
        } else {
          // If service type not found, assume not international
          updatedFormData.is_international = false
        }
      }
      
      setFormData(updatedFormData)
    }
  }

  const commonCountries = [
    'Algeria', 'France', 'Spain', 'Italy', 'Germany', 'United Kingdom', 
    'United States', 'Canada', 'Morocco', 'Tunisia', 'Libya', 'Egypt',
    'Turkey', 'China', 'United Arab Emirates', 'Saudi Arabia'
  ]

  if (userLoading || loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  // Block access for drivers
  if (user && user.role === 'DRIVER') {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground">Drivers are not authorized to create shipments.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Create Shipment</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Tracking Number</label>
            <input
              type="text"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Client</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a client</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Destination</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a destination</option>
                {destinations.map((dest: any) => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Service Type</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a type</option>
                {serviceTypes.map((type: any) => {
                  const isInternational = type.name?.toLowerCase().includes('international')
                  return (
                    <option key={type.id} value={type.id}>
                      {type.name}{isInternational ? ' 🌍' : ''}
                    </option>
                  )
                })}
              </select>
              {formData.service_type && serviceTypes.find((st: any) => st.id === parseInt(formData.service_type))?.name?.toLowerCase().includes('international') && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  International shipment - Additional fields will appear below
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Driver *</label>
            <select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a driver</option>
              {drivers.map((driver: any) => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Volume (m³)</label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Package description..."
            />
          </div>

          {/* International Shipment Section */}
          {formData.is_international && (
            <div className="border-t border-border pt-6 mt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="text-primary">🌍</span>
                  International Shipment Details
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This shipment is marked as international based on the selected service type
                </p>
              </div>

              <div className="space-y-6 bg-muted/30 p-6 rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Origin Country <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="origin_country"
                      value={formData.origin_country}
                      onChange={handleChange}
                      required={formData.is_international}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select origin country</option>
                      {commonCountries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Destination Country <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="destination_country"
                      value={formData.destination_country}
                      onChange={handleChange}
                      required={formData.is_international}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select destination country</option>
                      {commonCountries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Customs Value <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="customs_value"
                        value={formData.customs_value}
                        onChange={handleChange}
                        required={formData.is_international}
                        step="0.01"
                        min="0"
                        className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0.00"
                      />
                      <select
                        name="customs_currency"
                        value={formData.customs_currency}
                        onChange={handleChange}
                        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="DZD">DZD</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      HS Code (Harmonized System)
                    </label>
                    <input
                      type="text"
                      name="hs_code"
                      value={formData.hs_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 8528.72.00"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Used for customs classification</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Customs Declaration
                  </label>
                  <textarea
                    name="customs_declaration"
                    value={formData.customs_declaration}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Detailed description of items for customs..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">Provide detailed item description for customs clearance</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="requires_customs_clearance"
                      name="requires_customs_clearance"
                      checked={formData.requires_customs_clearance}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <label htmlFor="requires_customs_clearance" className="text-sm font-medium text-foreground cursor-pointer">
                      Requires Customs Clearance
                    </label>
                    <span className="text-xs text-muted-foreground">(Adds customs clearance fee)</span>
                  </div>
                  {formData.requires_customs_clearance && (
                    <div className="flex items-center gap-3 ml-8">
                      <input
                        type="checkbox"
                        id="customs_cleared"
                        name="customs_cleared"
                        checked={formData.customs_cleared}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <label htmlFor="customs_cleared" className="text-sm font-medium text-foreground cursor-pointer">
                        Customs Cleared
                      </label>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Note:</strong> International shipments include additional fees for customs handling, 
                    documentation, and international shipping rates. The cost will be automatically calculated 
                    based on weight, volume, customs value, and destination country.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/shipments/journal")}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
