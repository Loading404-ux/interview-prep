"use client"
import { useEffect } from "react"
import { useDashboardStore } from "@/store/useDashboardStore"
import { useClerkToken } from "@/hooks/useClerkToken"
import { fetchDashboard } from "@/services/dashboard.service"

export function useDashboard() {
    const { getToken } = useClerkToken()
    const store = useDashboardStore()

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                store.setLoading(true)
                const token = await getToken()
                const data = await fetchDashboard(token)

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
