"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Satellite, PlusCircle, AlertCircle, Settings, LogOut, Users, Car, Truck } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/shipments/journal", icon: Package, label: "Shipping" },
    { href: "/tracking", icon: Satellite, label: "Tracking" },
    { href: "/shipments/create", icon: PlusCircle, label: "Add Shipment" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/vehicles", icon: Truck, label: "Vehicles" },
    { href: "/drivers", icon: Car, label: "Drivers" },
    { href: "/incidents", icon: AlertCircle, label: "Need Help?" },
    { href: "/settings/profile", icon: Settings, label: "Setting" },
  ]

  return (
    <aside className="w-64 bg-primary text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-primary-light/20">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-2xl font-bold hover:scale-105 transition-transform active:scale-95"
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 7H16V3H8V7H5C3.9 7 3 7.9 3 9V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V9C21 7.9 20.1 7 19 7ZM10 5H14V7H10V5ZM5 17V9H19V17H5Z"
                fill="#1e3a8a"
              />
              <circle cx="7" cy="13" r="1.5" fill="#1e3a8a" />
              <circle cx="17" cy="13" r="1.5" fill="#1e3a8a" />
              <path d="M12 11L9 14H15L12 11Z" fill="#3b82f6" />
            </svg>
          </div>
          <span>SwiftDeliver</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
                isActive(item.href)
                  ? "bg-white/20 shadow-lg transform scale-105 font-semibold"
                  : "hover:bg-white/10 hover:scale-105 hover:translate-x-1 font-medium"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary-light/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 w-full text-left hover:scale-105 hover:translate-x-1 active:scale-95 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
