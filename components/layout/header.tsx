"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, User, Settings, LogOut, Package, AlertCircle } from "lucide-react"
import { shipmentsApi, incidentsApi, invoicesApi, userApi } from "@/lib/api"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
    fetchUser()
    
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchUser() {
    try {
      const userData = await userApi.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  async function fetchNotifications() {
    try {
      const [shipments, incidents, invoices] = await Promise.all([
        shipmentsApi.getAll(),
        incidentsApi.getAll(),
        invoicesApi.getAll()
      ])

      const notifs: any[] = []

      shipments.slice(0, 1).forEach((s: any) => {
        notifs.push({
          icon: Package,
          title: s.status === 'DELIVERED' ? 'Colis livré' : 'Expédition en cours',
          desc: `N° ${s.tracking_number}`,
          time: new Date(s.date).toLocaleDateString('fr-FR'),
          link: `/tracking?tracking=${s.tracking_number}`,
          color: 'gray'
        })
      })

      incidents.filter((i: any) => i.status === 'OPEN').slice(0, 1).forEach((i: any) => {
        notifs.push({
          icon: AlertCircle,
          title: 'Incident signalé',
          desc: i.description.substring(0, 40) + '...',
          time: new Date(i.date).toLocaleDateString('fr-FR'),
          link: `/incidents/view/${i.id}`,
          color: 'red'
        })
      })

      invoices.filter((inv: any) => inv.status === 'UNPAID').slice(0, 1).forEach((inv: any) => {
        notifs.push({
          icon: AlertCircle,
          title: 'Facture impayée',
          desc: `${inv.amount_ttc} DA`,
          time: new Date(inv.date).toLocaleDateString('fr-FR'),
          link: `/billing/invoices/edit/${inv.id}`,
          color: 'yellow'
        })
      })

      setNotifications(notifs.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

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
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8 relative shadow-card">
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search parcel by tracking number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-muted-foreground bg-muted/30"
          />
        </div>
      </form>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className="relative p-3 hover:bg-accent rounded-2xl transition-all hover:scale-110 active:scale-95"
          >
            <Bell className="w-6 h-6 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse ring-2 ring-card" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-card border border-border rounded-3xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">Notifications</h3>
                <Link
                  href="/notifications"
                  className="text-sm text-primary hover:underline font-semibold hover:scale-105 transition-transform"
                >
                  Voir tout
                </Link>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif, index) => (
                  <div 
                    key={index}
                    onClick={() => router.push(notif.link)}
                    className="p-5 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        notif.color === 'red' ? 'bg-destructive/10' :
                        notif.color === 'yellow' ? 'bg-warning/10' : 'bg-muted'
                      }`}>
                        <notif.icon className={`w-6 h-6 ${
                          notif.color === 'red' ? 'text-destructive' :
                          notif.color === 'yellow' ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.desc}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 hover:bg-accent rounded-2xl px-3 py-2 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center text-white font-bold transition-transform hover:rotate-12 shadow-md">
              {user ? (user.first_name?.[0] || user.username[0]).toUpperCase() + (user.last_name?.[0] || user.username[1] || '').toUpperCase() : 'U'}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">
                {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">{user?.role || 'Agent'}</p>
            </div>
            <span className={`text-muted-foreground transition-transform text-sm ${showProfile ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-3xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-chart-2 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {user ? (user.first_name?.[0] || user.username[0]).toUpperCase() + (user.last_name?.[0] || user.username[1] || '').toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'User'}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@company.com'}</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <Link
                  href="/settings/profile"
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-accent transition-all text-foreground flex items-center gap-3 font-medium hover:scale-105"
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings/profile"
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-accent transition-all text-foreground flex items-center gap-3 font-medium hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
              <div className="p-3 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-destructive/10 transition-all text-destructive flex items-center gap-3 font-semibold hover:scale-105"
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
