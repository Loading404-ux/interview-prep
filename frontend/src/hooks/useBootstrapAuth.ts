"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useUserStore } from "@/store/user.store"
import { useRouter } from "next/navigation"
import { API_ROUTES } from "@/routes"

export function useBootstrapAuth() {
  const { isSignedIn, getToken, isLoaded } = useAuth()
  const router = useRouter()
  const { user, setUser, bootstrapped, markBootstrapped } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      setLoading(false)
      return
    }

    if (bootstrapped) {
      setLoading(false)
      return
    }

    const bootstrap = async () => {
      try {
        const token = await getToken()
        const profile = await api<Auth>(API_ROUTES.USER.PROFILE_FETCH, {
          token,
          method: "POST",
        })
        setUser(profile)
      } catch {
        router.replace("/")
      } finally {
        markBootstrapped()
        setLoading(false)
      }
    }

    bootstrap()
  }, [isLoaded, isSignedIn])

  return { loading, user }
}
