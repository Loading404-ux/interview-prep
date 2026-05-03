import { useAuth } from "@clerk/nextjs"

export function useClerkToken() {
    const { getToken } = useAuth()

    const getTokenOrThrow = async () => {
        const token = await getToken()
        if (!token) {
            throw new Error("Auth token unavailable")
        }
        return token
    }

    return { getToken: getTokenOrThrow }
}
