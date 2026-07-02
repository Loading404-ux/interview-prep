// hooks/useProfile.ts
import { useEffect } from "react"
import { useProfileStore } from "@/store/useProfileStore"
import { useClerkToken } from "@/hooks/useClerkToken"
import { fetchProfile } from "@/services/profile.service"

export function useProfile() {
    const { getToken } = useClerkToken()
    const store = useProfileStore()

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                store.setLoading(true)
                const token = await getToken()
                const res = await fetchProfile(token)

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
    }, [getToken])

    return store
}
