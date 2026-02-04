import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"
import { useUserStore } from "@/store/user.store"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const router = useRouter()
  const { user, setUser, bootstrapped, markBootstrapped } = useUserStore()
  const [loading, setLoading] = useState(true)

  console.log("AUTH STATE", {
    isLoaded,
    isSignedIn,
    clerkUser: !!clerkUser,
    bootstrapped,
  })

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) return
    if (!clerkUser) return        // 🔑 REQUIRED
    if (bootstrapped) {
      setLoading(false)
      return
    }

    const bootstrap = async () => {
      console.log("Backend fired")
      try {
        const token = await getToken()
        const profile = await api<Auth>(API_ROUTES.USER.PROFILE_FETCH, {
          token,
          method: "POST",
        })
        setUser(profile)
      } catch (e) {
        console.error(e)
        router.replace("/")
      } finally {
        markBootstrapped()
        setLoading(false)
      }
    }

    bootstrap()
  }, [isLoaded, isSignedIn, clerkUser, bootstrapped])

  return { loading, user }
}
