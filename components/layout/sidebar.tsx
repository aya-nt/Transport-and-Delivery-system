"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Satellite, AlertCircle, Settings, LogOut, Users, Car, Truck, Star, Route, MessageSquare } from "lucide-react"

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
    { href: "/favorites", icon: Star, label: "Favorites" },
    { href: "/shipments/journal", icon: Package, label: "Shipping" },
    { href: "/tours", icon: Route, label: "Tours" },
    { href: "/tracking", icon: Satellite, label: "Tracking" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/vehicles", icon: Truck, label: "Vehicles" },
    { href: "/drivers", icon: Car, label: "Drivers" },
    { href: "/claims", icon: MessageSquare, label: "Claims" },
    { href: "/incidents", icon: AlertCircle, label: "Need Help?" },
    { href: "/settings/profile", icon: Settings, label: "Setting" },
  ]

  return (
    <aside className="w-64 bg-[#FFF5F9] dark:bg-sidebar border-r border-sidebar-border flex flex-col shadow-sm">
      <div className="p-6 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-2xl font-bold hover:scale-105 transition-transform active:scale-95 text-sidebar-foreground"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 7H16V3H8V7H5C3.9 7 3 7.9 3 9V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V9C21 7.9 20.1 7 19 7ZM10 5H14V7H10V5ZM5 17V9H19V17H5Z"
                fill="#ffffff"
              />
              <circle cx="7" cy="13" r="1.5" fill="#ffffff" />
              <circle cx="17" cy="13" r="1.5" fill="#ffffff" />
              <path d="M12 11L9 14H15L12 11Z" fill="#e0e7ff" />
            </svg>
          </div>
          <span>SwiftDeliver</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 w-full ${
                active
                  ? "bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/50 scale-105 font-semibold"
                  : "text-[#555] dark:text-sidebar-foreground hover:bg-white/50 dark:hover:bg-sidebar-accent/50 hover:scale-105 font-medium"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-destructive/10 transition-all duration-200 w-full text-left hover:scale-105 active:scale-95 font-medium text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
