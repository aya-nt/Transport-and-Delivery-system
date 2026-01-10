'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Package, LogIn, Truck, Search, MessageSquare, MapPin, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shipment, setShipment] = useState<any>(null)
  const [claimData, setClaimData] = useState({
    name: '',
    phone: '',
    trackingNumber: '',
    description: ''
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError('')
    setShipment(null)

    try {
      const shipmentRes = await fetch(`http://localhost:8000/api/shipments/?tracking_number=${trackingNumber}`)
      
      if (!shipmentRes.ok) {
        setError('Failed to connect to server. Please try again later.')
        return
      }

      const shipmentData = await shipmentRes.json()
      
      if (!shipmentData || shipmentData.length === 0) {
        setError('Tracking number not found. Please check and try again.')
        return
      }

      const foundShipment = shipmentData[0]
      setShipment(foundShipment)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch shipment details. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "IN_TRANSIT": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "OUT_FOR_DELIVERY": return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
      case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "DELIVERY_FAILED": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DELIVERED": return "Delivered"
      case "IN_TRANSIT": return "In Transit"
      case "OUT_FOR_DELIVERY": return "Out for Delivery"
      case "SORTING_CENTER": return "Sorting Center"
      case "PENDING": return "Pending"
      case "DELIVERY_FAILED": return "Delivery Failed"
      default: return status
    }
  }

  const handleSubmitClaim = () => {
    console.log('Claim submitted:', claimData)
    setIsOpen(false)
    setClaimData({ name: '', phone: '', trackingNumber: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary">swift deliver</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" className="flex items-center gap-2 border-border hover:bg-accent" asChild>
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Staff Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Track Your <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">Shipments</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Fast, reliable, and secure delivery services. Track your packages in real-time and get instant support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Track Shipment Card */}
          <Card className="group hover:shadow-card transition-all duration-300 border-border shadow-card bg-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Track Package</h3>
                  <p className="text-muted-foreground text-sm">Enter your tracking number</p>
                </div>
              </div>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Enter tracking number (e.g. TRK123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-12 h-12 border-input focus:border-primary focus:ring-primary bg-background"
                    disabled={loading}
                  />
                  <Package className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-chart-2 hover:scale-105 active:scale-95 transition-all text-white font-medium shadow-lg hover:shadow-xl"
                  disabled={!trackingNumber.trim() || loading}
                >
                  {loading ? 'Tracking...' : 'Track My Package'}
                </Button>
              </form>
              
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
                  {error}
                </div>
              )}

              {shipment && (
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-foreground">Tracking Results</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                      {getStatusText(shipment.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Tracking Number</p>
                        <p className="font-semibold text-foreground">{shipment.tracking_number}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Shipment Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(shipment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Destination</p>
                        <p className="font-semibold text-foreground">{shipment.destination_name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Service Type</p>
                        <p className="font-semibold text-foreground">{shipment.service_type_name || 'Standard'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/track?tracking=${trackingNumber}`}>
                    <Button variant="outline" className="w-full mt-4">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Claim Card */}
          <Card className="group hover:shadow-card transition-all duration-300 border-border shadow-card bg-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-1 to-destructive rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Submit Claim</h3>
                  <p className="text-muted-foreground text-sm">Report an issue with your shipment</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Having issues with your delivery? Our support team is here to help resolve any problems quickly.
              </p>
              
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full h-12 bg-gradient-to-r from-chart-1 to-destructive hover:scale-105 active:scale-95 transition-all text-white font-medium shadow-lg hover:shadow-xl">
                    <FileText className="w-5 h-5 mr-2" />
                    Submit Claim
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">Submit a Claim</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="Your full name"
                      value={claimData.name}
                      onChange={(e) => setClaimData({...claimData, name: e.target.value})}
                      className="h-11 border-input bg-background text-foreground"
                    />
                    <Input
                      placeholder="Phone number"
                      value={claimData.phone}
                      onChange={(e) => setClaimData({...claimData, phone: e.target.value})}
                      className="h-11 border-input bg-background text-foreground"
                    />
                    <Input
                      placeholder="Tracking number (required)"
                      value={claimData.trackingNumber}
                      onChange={(e) => setClaimData({...claimData, trackingNumber: e.target.value})}
                      className="h-11 border-input focus:border-chart-1 bg-background text-foreground"
                      required
                    />
                    <Textarea
                      placeholder="Describe your issue in detail..."
                      value={claimData.description}
                      onChange={(e) => setClaimData({...claimData, description: e.target.value})}
                      className="min-h-[100px] resize-none border-input bg-background text-foreground"
                    />
                    <Button 
                      onClick={handleSubmitClaim} 
                      className="w-full h-11 bg-gradient-to-r from-chart-1 to-destructive hover:scale-105 active:scale-95 transition-all shadow-lg"
                      disabled={!claimData.trackingNumber.trim()}
                    >
                      Submit Claim
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-4 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Real-time Tracking</h4>
            <p className="text-muted-foreground text-sm">Monitor your package every step of the way</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-2 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Fast Delivery</h4>
            <p className="text-muted-foreground text-sm">Quick and reliable shipping nationwide</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-chart-5 to-chart-1 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">24/7 Support</h4>
            <p className="text-muted-foreground text-sm">Get help whenever you need it</p>
          </div>
        </div>
      </div>
    </div>
  )
}