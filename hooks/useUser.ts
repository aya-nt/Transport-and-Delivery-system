import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    try {
      const userData = await userApi.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const can = {
    manageClients: () => ['ADMIN', 'AGENT'].includes(user?.role),
    manageVehicles: () => ['ADMIN', 'AGENT'].includes(user?.role),
    manageDrivers: () => ['ADMIN', 'AGENT'].includes(user?.role),
    manageShipments: () => ['ADMIN', 'MANAGER', 'AGENT'].includes(user?.role),
    manageSettings: () => ['ADMIN'].includes(user?.role),
    viewReports: () => ['ADMIN', 'MANAGER'].includes(user?.role),
  }

  return { user, loading, can }
}
