"use client"

import LoadingBar, { LoadingBarContainer } from "react-top-loading-bar"
import { useEffect } from "react"
// import { bindLoadingBar } from "@/lib/api-client"
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth"
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { useSseStore } from "@/store/sse.store"
export default function Main({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { loading } = useBootstrapAuth()

  const connectSse = useSseStore((state) => state.connect)
  const disconnectSse = useSseStore((state) => state.disconnect)


  useEffect(() => {
    const setup = async () => {
      if (isSignedIn) {
        const token = await getToken()
        if (token) connectSse(token)
      } else {
        disconnectSse()
      }
    };
    setup();
    return () => {
      disconnectSse()
    }
  }, [isSignedIn, getToken, connectSse, disconnectSse])


  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    )
  }


  return (
    <>
      <SignedIn>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <span className="text-muted-foreground">
              Preparing your dashboard…
            </span>
          </div>
        ) : (
          <LoadingBarContainer>
            {children}
          </LoadingBarContainer>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
