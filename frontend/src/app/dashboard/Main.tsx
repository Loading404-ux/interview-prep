"use client"

import LoadingBar from "react-top-loading-bar"
import { useRef, useEffect } from "react"
import { bindLoadingBar } from "@/lib/api-client"
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth"
import { useAuth } from "@clerk/nextjs"

export default function Main({ children }: { children: React.ReactNode }) {
  // 🔑 ALL hooks at the top — no conditions
  const ref = useRef<any>(null)
  const { isLoaded, isSignedIn } = useAuth()
  const { loading, user } = useBootstrapAuth()

  useEffect(() => {
    bindLoadingBar(ref.current)
  }, [])

  // 🧠 Now branch AFTER hooks
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return null
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-muted-foreground">
          Preparing your dashboard…
        </span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <LoadingBar color="#22c55e" ref={ref} height={2} />
      {children}
    </>
  )
}
