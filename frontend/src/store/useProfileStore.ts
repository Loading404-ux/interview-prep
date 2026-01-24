// store/useProfileStore.ts
import { create } from "zustand"
// import { UserProfile, UserMetrics, ContributionDay } from "@/types/profile"

interface ProfileState {
    profile: UserProfile | null
    metrics: UserMetrics | null
    contributions: ContributionDay[]
    isLoading: boolean

    setAll: (
        profile: UserProfile,
        metrics: UserMetrics,
        contributions: ContributionDay[]
    ) => void

    setLoading: (v: boolean) => void
    updateTargetCompanies: (companies: string[]) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    metrics: null,
    contributions: [],
    isLoading: true,
    updateTargetCompanies: (companies: string[]) =>
        set((state) => ({
            profile: state.profile
                ? { ...state.profile, targetCompanies: companies }
                : state.profile,
        })),
    setAll: (profile, metrics, contributions) =>
        set({
            profile,
            metrics,
            contributions,
            isLoading: false,
        }),

    setLoading: (v) => set({ isLoading: v }),
}))
