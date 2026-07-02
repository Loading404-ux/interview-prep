// hooks/useActivityLog.ts
import { useEffect } from "react"
import { useActivityStore } from "@/store/useActivityStore"
import { useClerkToken } from "@/hooks/useClerkToken"
import { fetchActivityHistory } from "@/services/activity.service"

export function useActivityLog() {
  const { getToken } = useClerkToken()
  const { activities, isLoading, setActivities, setLoading } =
    useActivityStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const token = await getToken()
        const data = await fetchActivityHistory(token)

        if (mounted) setActivities(data)
      } catch (e) {
        console.error("Failed to load activity log", e)
        setActivities([])
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [getToken])

  return {
    activities,
    isLoading,
  }
}
