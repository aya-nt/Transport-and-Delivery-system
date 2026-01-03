"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, AlertCircle } from "lucide-react"
import BackButton from "@/components/layout/back-button"
import { shipmentsApi, incidentsApi, invoicesApi } from "@/lib/api"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      const [shipments, incidents, invoices] = await Promise.all([
        shipmentsApi.getAll(),
        incidentsApi.getAll(),
        invoicesApi.getAll()
      ])

      const notifs: any[] = []

      shipments.slice(0, 3).forEach((s: any) => {
        notifs.push({
          type: 'shipment',
          icon: Package,
          title: s.status === 'DELIVERED' ? 'Colis livré' : 'Expédition en cours',
          desc: `N° ${s.tracking_number} - ${s.client_name}`,
          time: new Date(s.date).toLocaleDateString('fr-FR'),
          link: `/tracking?tracking=${s.tracking_number}`,
          color: 'gray'
        })
      })

      incidents.filter((i: any) => i.status === 'OPEN').forEach((i: any) => {
        notifs.push({
          type: 'incident',
          icon: AlertCircle,
          title: 'Incident signalé',
          desc: i.description.substring(0, 60) + '...',
          time: new Date(i.date).toLocaleDateString('fr-FR'),
          link: `/incidents/view/${i.id}`,
          color: 'red'
        })
      })

      invoices.filter((inv: any) => inv.status === 'UNPAID' || inv.status === 'PARTIAL').forEach((inv: any) => {
        notifs.push({
          type: 'invoice',
          icon: AlertCircle,
          title: inv.status === 'UNPAID' ? 'Facture impayée' : 'Facture partiellement payée',
          desc: `${inv.amount_ttc} DA - ${inv.client_name}`,
          time: new Date(inv.date).toLocaleDateString('fr-FR'),
          link: `/billing/invoices/edit/${inv.id}`,
          color: 'yellow'
        })
      })

      setNotifications(notifs)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Notifications</h1>
        <p className="text-text-secondary">Toutes vos notifications récentes</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">Aucune notification</div>
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map((notif, index) => (
            <div 
              key={index}
              onClick={() => router.push(notif.link)}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.color === 'red' ? 'bg-red-100' :
                  notif.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <notif.icon className={`w-8 h-8 ${
                    notif.color === 'red' ? 'text-error' :
                    notif.color === 'yellow' ? 'text-warning' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-text-primary text-lg">{notif.title}</h3>
                    <span className="text-xs text-text-secondary">{notif.time}</span>
                  </div>
                  <p className="text-text-secondary">{notif.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  )
}
