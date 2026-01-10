"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/layout/back-button"
import { clientsApi } from "@/lib/api"
import { useUser } from "@/hooks/useUser"
import { useConfirmDialog, ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function ClientsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const { Dialog, isOpen, setIsOpen, confirm } = useConfirmDialog()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  
  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const data = await clientsApi.getAll()
      setClients(data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteId(id)
    setIsOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    
    try {
      await clientsApi.delete(deleteId)
      fetchClients()
    } catch (error) {
      console.error('Failed to delete client:', error)
      alert('Échec de la suppression du client')
    } finally {
      setDeleteId(null)
    }
  }

  if (user?.role === 'DRIVER') {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">Drivers cannot access client management.</p>
            <p className="text-muted-foreground mt-2">Please use the Shipments section to view your deliveries.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <Dialog />
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le client"
        message="Êtes-vous sûr de vouloir supprimer ce client? Cette action est irréversible."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <button
          onClick={() => router.push("/clients/create")}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Add Client
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No clients found</div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact Info</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{client.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{client.contact_info}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{client.address}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      client.status === "ACTIVE" ? "bg-green-100 text-success dark:bg-green-900/30 dark:text-green-300" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => router.push(`/clients/edit/${client.id}`)}
                    className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)}
                    className="text-error hover:underline hover:scale-105 transition-all font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
