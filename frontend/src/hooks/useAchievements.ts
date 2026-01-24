// hooks/useAchievements.ts
import { useEffect } from "react"
import { api } from "@/lib/api-client"
import { useAuth } from "@clerk/nextjs"
import { useAchievementsStore } from "@/store/useAchievementsStore"

export function useAchievements() {
  const { getToken } = useAuth()
  const store = useAchievementsStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      const token = await getToken()
      const data = await api<
        { key: string; unlockedAt: string | null }[]
      >("/user/achievements", { token })

      if (mounted) {
        store.setAchievements(data)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return store
}
