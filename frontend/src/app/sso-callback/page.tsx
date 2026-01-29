"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { useUserStore } from "@/store/user.store"
import Background from "@/components/Background"
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'

// Default values shown

export default function SsoCallback() {
    const [error, setError] = useState("")
    const { isLoaded, isSignedIn, getToken, signOut } = useAuth()
    const router = useRouter()
    const { setUser } = useUserStore()

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            router.push("/")
        }

        const bootstrap = async () => {
            try {
                const token = await getToken()
                const profile = await api<any>("/user/profile", {
                    token,
                    method: "POST",
                })
                setUser(profile)
                router.push("/dashboard")
            } catch (err: any) {
                console.log(err)
                if (isSignedIn) {
                    await signOut();
                }
                setError(err.message)
            }
        }

        bootstrap()
    }, [isLoaded, isSignedIn])

    return (
        <div className="w-full h-dvh flex items-center justify-center">
            <div className="fixed size-full left-0 top-0">
                <Background />
            </div >
            {!error ? <div className="relative z-10 grid place-items-center">
                <Quantum
                    size="75"
                    speed="1.75"
                    color="#193be699"
                />
                <h4 className="text-3xl">Please Wait...</h4>
            </div> :
                <div className="relative z-10 grid place-items-center p-4 text-rose-600">
                    <h3 className="">Authtication failed</h3>
                    <h4 className="text-xl">{error}</h4>
                </div>}
        </div>
    )
}
