// hooks/useProfile.ts
import { useEffect } from "react"
import { api } from "@/lib/api-client"
import { useAuth } from "@clerk/nextjs"
import { useProfileStore } from "@/store/useProfileStore"
import { API_ROUTES } from "@/routes"
// import {
//   UserProfile,
//   UserMetrics,
//   ContributionDay,
// } from "@/types/profile"

export function useProfile() {
  const { getToken } = useAuth()
  const store = useProfileStore()

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        store.setLoading(true)
        const token = await getToken()

        // const [profile, metrics, contributions] = await Promise.all([
        //   api<UserProfile>("/user/profile", { token }),
        //   api<UserMetrics>("/user/metrics", { token }),
        //   api<ContributionDay[]>("/activity/contributions", { token }),
        // ])
        const res = await api<UserProfileResponse>(`${API_ROUTES.USER.ME_PROFILE}`, { token })
        if (mounted) {
          store.setAll(res)
        }
      } catch (e) {
        console.error("Profile load failed", e)
        store.setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return store
}
