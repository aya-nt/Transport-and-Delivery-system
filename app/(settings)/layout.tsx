"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, User, Lock, Key } from "lucide-react"

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
      <aside className="w-64 bg-surface border-r border-border p-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-3 mb-6 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
          <span className="font-medium text-text-primary">Back</span>
        </Link>

        <h2 className="text-xl font-bold text-text-primary mb-6">Settings</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-primary hover:bg-gray-100 hover:scale-105 hover:translate-x-1"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  )
}
