"use client"
import { useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { api } from "@/lib/api-client"
import { useDashboardStore } from "@/store/useDashboardStore"
import { API_ROUTES } from "@/routes"


export function useDashboard() {
  const { getToken } = useAuth()
  const store = useDashboardStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        store.setLoading(true)
        const token = await getToken()
        const [strek, cards] = await Promise.all([
          api<Contribution[]>(API_ROUTES.USER.DASHBOARD_STREAK, { token }),
          api<DashboardProgressCards>(API_ROUTES.USER.DASHBOARD_CARDS, { token })
        ])
        // const cards = await api<DashboardProgress>(API_ROUTES.USER.DASHBOARD_CARDS,
        //   { token }
        // )
        console.log(strek, cards)
        if (mounted) store.setDashboard({ streakCalender: strek, progressCards: cards })
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
