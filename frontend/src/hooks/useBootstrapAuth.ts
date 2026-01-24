"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useUserStore } from "@/store/user.store"
import { useRouter } from "next/navigation"

export function useBootstrapAuth() {
  const { getToken } = useAuth()

  const router = useRouter()

  const { user, setUser, bootstrapped, markBootstrapped } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      //   if (!isSignedIn) {
      //     setLoading(false)
      //     return
      //   }

      if (bootstrapped) {
        setLoading(false)
        return
      }

      try {
        const token = await getToken()
        const profile = await api<any>("/user/profile", {
          token,
          method: "POST"
        })

        setUser(profile)
      } catch (err) {
        // backend rejected user → force logout or redirect
        router.replace("/")
      } finally {
        markBootstrapped()
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  return {
    loading,
    user,
  }
}
