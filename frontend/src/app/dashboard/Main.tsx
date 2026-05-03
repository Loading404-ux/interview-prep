"use client"

import LoadingBar, { LoadingBarContainer } from "react-top-loading-bar"
import { useEffect } from "react"
// import { bindLoadingBar } from "@/lib/api-client"
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth"
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { useSocketStore } from '@/store/socket.store';
import { toast } from "sonner"
export default function Main({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { loading } = useBootstrapAuth()

  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);


  useEffect(() => {
    const setup = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) initializeSocket(token);
        toast("Connected to socket")
      } else {
        toast("Disconnected from socket")
        disconnectSocket(); // Auto-disconnect on logout
      }
    };
    setup();
  }, [isSignedIn]);


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
