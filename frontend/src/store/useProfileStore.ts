// store/useProfileStore.ts
import { create } from "zustand"

interface ProfileState {
    profile: Profile | null
    isLoading: boolean

    // separated values
    codingSolved: number
    hrSessions: number
    aptitudeAttempts: number

    targets: string[]
    achievements: Achievement[]
    contributions: Contribution[]

    // hydration
    setAll: (data: UserProfileResponse) => void
    setLoading: (v: boolean) => void

    // updates (INTENTIONAL)
    updateTargets: (targets: string[]) => void
    incrementCodingSolved: () => void
    incrementHrSessions: () => void
    incrementAptitudeAttempts: () => void

    addAchievement: (achievement: Achievement) => void
    addContribution: (contribution: Contribution) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: true,

    codingSolved: 0,
    hrSessions: 0,
    aptitudeAttempts: 0,

    targets: [],
    achievements: [],
    contributions: [],

    // 🔥 hydrate once from backend
    setAll: (data) =>
        set({
            profile: data.profile,

            codingSolved: data.progressCards.codingSolved,
            hrSessions: data.progressCards.hrSessions,
            aptitudeAttempts: data.progressCards.aptitudeAttempts,

            targets: data.targets,
            achievements: data.achievements,
            contributions: data.contributions,

            isLoading: false,
        }),

    setLoading: (v) => set({ isLoading: v }),


    updateTargets: (targets) =>
        set((state) => ({
            targets,
            profile: state.profile
                ? { ...state.profile, targetCompanies: targets }
                : null,
        })),

    incrementCodingSolved: () =>
        set((state) => ({
            codingSolved: state.codingSolved + 1,
        })),

    incrementHrSessions: () =>
        set((state) => ({
            hrSessions: state.hrSessions + 1,
        })),

    incrementAptitudeAttempts: () =>
        set((state) => ({
            aptitudeAttempts: state.aptitudeAttempts + 1,
        })),


    addAchievement: (achievement) =>
        set((state) => ({
            achievements: state.achievements.some(
                (a) => a.key === achievement.key
            )
                ? state.achievements
                : [...state.achievements, achievement],
        })),

    addContribution: (contribution) =>
        set((state) => ({
            contributions: [contribution, ...state.contributions],
        })),
}))
