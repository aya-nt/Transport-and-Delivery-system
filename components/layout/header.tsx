"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, User, Settings, Star, LogOut, Package, X } from "lucide-react"

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tracking?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 relative shadow-sm">
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search parcel by tracking number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-300 bg-gray-50"
          />
        </div>
      </form>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className="relative p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-95"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-text-primary text-lg">Notifications</h3>
                <Link
                  href="/notifications"
                  className="text-sm text-primary hover:underline font-semibold hover:scale-105 transition-transform"
                >
                  See all
                </Link>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">Package Arrived</h4>
                      <p className="text-sm text-text-secondary mt-1">Parcel (ID 1234 8765) has been delivered</p>
                      <p className="text-xs text-text-secondary mt-2">10 minutes ago</p>
                      <button className="text-sm text-yellow-600 font-semibold mt-2 hover:underline">Reorder</button>
                    </div>
                  </div>
                </div>

                <div className="p-5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">Package Received At Post</h4>
                      <p className="text-sm text-text-secondary mt-1">Parcel (ID 6457 2244) has been received</p>
                      <p className="text-xs text-text-secondary mt-2">1 Hour ago</p>
                      <button className="text-sm text-yellow-600 font-semibold mt-2 hover:underline">Reorder</button>
                    </div>
                  </div>
                </div>

                <div className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">Order Cancelled</h4>
                      <p className="text-sm text-text-secondary mt-1">Parcel (ID 6411 1122) has been cancelled</p>
                      <p className="text-xs text-text-secondary mt-2">2 Hours ago</p>
                      <span className="text-sm text-red-600 font-semibold mt-2">Cancelled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-bold transition-transform hover:rotate-12 shadow-md">
              BC
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-text-primary">Ben Cutting</p>
              <p className="text-xs text-text-secondary">Administrator</p>
            </div>
            <span className={`text-text-secondary transition-transform text-sm ${showProfile ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    BC
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">Ben Cutting</p>
                    <p className="text-sm text-text-secondary">ben.cutting@company.com</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <Link
                  href="/settings/profile"
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-text-primary flex items-center gap-3 font-medium hover:scale-105"
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings/profile"
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-text-primary flex items-center gap-3 font-medium hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/favorites"
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-text-primary flex items-center gap-3 font-medium hover:scale-105"
                >
                  <Star className="w-5 h-5" />
                  <span>Favorites</span>
                </Link>
              </div>
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-red-600 flex items-center gap-3 font-semibold hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
