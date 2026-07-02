// store/useActivityStore.ts
import { create } from "zustand";
// import { ActivityDTO } from "@/types/activity";

interface ActivityState {
  activities: ActivityDTO[];
  isLoading: boolean;

  setActivities: (a: ActivityDTO[]) => void;
  setLoading: (v: boolean) => void;
  clear: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: true,

  setActivities: (activities) =>
    set({ activities, isLoading: false }),

  setLoading: (v) => set({ isLoading: v }),

  clear: () => set({ activities: [], isLoading: true }),
}));
