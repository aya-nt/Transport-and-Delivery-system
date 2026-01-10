"use client"

import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  gradient?: boolean
  onClick?: () => void
}

export function StatCard({ title, value, icon: Icon, trend, gradient, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-3xl p-6 shadow-card border border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          gradient 
            ? 'bg-gradient-to-br from-primary to-chart-2' 
            : 'bg-primary/10'
        }`}>
          <Icon className={`w-7 h-7 ${gradient ? 'text-white' : 'text-primary'}`} />
        </div>
      </div>
    </div>
  )
}
