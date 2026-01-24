"use client"
import { useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { api } from "@/lib/api-client"
import { useDashboardStore } from "@/store/useDashboardStore"


export function useDashboard() {
  const { getToken } = useAuth()
  const store = useDashboardStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        store.setLoading(true)
        const token = await getToken()

        const data = await api<DashboardResponse>(
          "/user/me/dashboard",
          { token }
        )

        if (mounted) store.setDashboard(data)
      } catch (err) {
        console.error("Dashboard load failed", err)
      }
    }

    if (!store.data) {
      load()
    }

    return () => {
      mounted = false
    }
  }, [getToken])

  return store
}
