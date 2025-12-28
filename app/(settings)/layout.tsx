"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { User, Lock, Key } from "lucide-react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/settings/profile", label: "Profile Management", icon: User },
    { href: "/settings/roles", label: "Roles & Permissions", icon: Lock },
    { href: "/settings/change-password", label: "Change Password", icon: Key },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <aside className="w-64 bg-surface rounded-xl border border-border shadow-sm p-6 flex-shrink-0">
                <h2 className="text-xl font-bold text-text-primary mb-6">Settings</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          pathname === item.href
                            ? "bg-primary text-white shadow-lg font-semibold"
                            : "text-text-primary hover:bg-gray-100 hover:scale-105 hover:translate-x-1 font-medium"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </aside>
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
