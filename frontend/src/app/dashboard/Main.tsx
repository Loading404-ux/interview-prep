"use client"

import LoadingBar, { LoadingBarContainer } from "react-top-loading-bar"
import { useRef, useEffect } from "react"
// import { bindLoadingBar } from "@/lib/api-client"
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth"
import { useAuth } from "@clerk/nextjs"
import { useSocketStore } from '@/store/socket.store';
import { toast } from "sonner"
import { redirect } from "next/navigation"
export default function Main({ children }: { children: React.ReactNode }) {
  // 🔑 ALL hooks at the top — no conditions
  const ref = useRef<any>(null)
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { loading, user } = useBootstrapAuth()

  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);
  // useEffect(() => {
  //   bindLoadingBar(ref.current)
  // }, [])

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
  }, [isSignedIn, user]);
  // 🧠 Now branch AFTER hooks
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    redirect("/")
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
      <LoadingBarContainer >
        {children}
      </LoadingBarContainer>
    </>
  )
}
