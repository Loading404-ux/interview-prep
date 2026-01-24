// store/useAchievementsStore.ts
import { create } from "zustand"

interface AchievementState {
  unlocked: Record<string, string | null>
  isLoading: boolean
  setAchievements: (list: { key: string; unlockedAt: string | null }[]) => void
}

export const useAchievementsStore = create<AchievementState>((set) => ({
  unlocked: {},
  isLoading: true,

  setAchievements: (list) =>
    set({
      unlocked: Object.fromEntries(
        list.map(a => [a.key, a.unlockedAt])
      ),
      isLoading: false,
    }),
}))
