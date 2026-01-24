import { create } from "zustand"

interface DashboardState {
  data: DashboardResponse | null
  isLoading: boolean
  error?: string

  setLoading: (v: boolean) => void
  setDashboard: (d: DashboardResponse) => void
  reset: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: true,

  setLoading: (v) => set({ isLoading: v }),

  setDashboard: (data) =>
    set({
      data,
      isLoading: false,
    }),

  reset: () =>
    set({
      data: null,
      isLoading: true,
    }),
}))
