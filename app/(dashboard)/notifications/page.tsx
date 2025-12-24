import { Package, X, Truck, MapPin, CheckCircle } from "lucide-react"
import BackButton from "@/components/layout/back-button"

export default function NotificationsPage() {
  return (
    <div className="p-8">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Notifications</h1>
        <p className="text-text-secondary">View all your recent notifications and updates</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Package Arrived</h3>
                  <span className="text-xs text-text-secondary">10 minutes ago</span>
                </div>
                <p className="text-text-secondary mb-3">
                  Parcel (ID 1234 8765) has been delivered to the destination address
                </p>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all hover:scale-105">
                  Reorder
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Package Received At Post</h3>
                  <span className="text-xs text-text-secondary">1 Hour ago</span>
                </div>
                <p className="text-text-secondary mb-3">
                  Parcel (ID 6457 2244) has been received at the distribution center
                </p>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all hover:scale-105">
                  Reorder
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Order Cancelled</h3>
                  <span className="text-xs text-text-secondary">2 Hours ago</span>
                </div>
                <p className="text-text-secondary mb-3">Parcel (ID 6411 1122) has been cancelled by the sender</p>
                <span className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold inline-block">
                  Cancelled
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Out for Delivery</h3>
                  <span className="text-xs text-text-secondary">3 Hours ago</span>
                </div>
                <p className="text-text-secondary mb-3">
                  Parcel (ID 8899 3344) is out for delivery and will arrive today
                </p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105">
                  Track Package
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Package in Transit</h3>
                  <span className="text-xs text-text-secondary">5 Hours ago</span>
                </div>
                <p className="text-text-secondary mb-3">Parcel (ID 7766 5544) is currently in transit to your city</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-text-primary text-lg">Shipment Created</h3>
                  <span className="text-xs text-text-secondary">1 Day ago</span>
                </div>
                <p className="text-text-secondary mb-3">New shipment (ID 4455 6677) has been created successfully</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105">
                  View Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
