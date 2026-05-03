import { create } from "zustand"
import { ApiError } from "@/lib/api-errors"

interface ApiState {
    pendingCount: number
    lastError: ApiError | null
    startRequest: () => void
    endRequest: () => void
    setError: (error: ApiError) => void
    clearError: () => void
}

export const useApiStore = create<ApiState>((set) => ({
    pendingCount: 0,
    lastError: null,

    startRequest: () =>
        set((state) => ({ pendingCount: state.pendingCount + 1 })),

    endRequest: () =>
        set((state) => ({ pendingCount: Math.max(0, state.pendingCount - 1) })),

    setError: (error) =>
        set(() => ({ lastError: error })),

    clearError: () => set(() => ({ lastError: null })),
}))
