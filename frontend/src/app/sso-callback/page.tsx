"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { useUserStore } from "@/store/user.store"
import Background from "@/components/Background"
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'

// Default values shown

export default function SsoCallback() {
    const { isLoaded, isSignedIn, getToken, signOut } = useAuth()
    const router = useRouter()
    const { setUser } = useUserStore()

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return

        const bootstrap = async () => {
            try {
                const token = await getToken()
                const profile = await api<any>("/user/profile", {
                    token,
                    method: "POST",
                })
                setUser(profile)
                router.replace("/dashboard")
            } catch (err) {
                console.log(err)
                if (isSignedIn) {
                    await signOut();
                }
                router.replace("/")
            }
        }

        bootstrap()
    }, [isLoaded, isSignedIn])

    return (
        <div className="w-full h-dvh flex items-center justify-center">
            <div className="fixed size-full left-0 top-0">
                <Background />
            </div >
            <Quantum
                size="45"
                speed="1.75"
                color="hsl(220, 43%, 3%)"
            />
        </div>
    )
}
