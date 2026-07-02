import { create } from "zustand";



interface SolutionsState {
  solutions: Solution[];
  isLoading: boolean;

  setLoading: (v: boolean) => void;
  setSolutions: (s: Solution[]) => void;
  toggleLike: (id: string) => void;
  addSolution: (s: Solution) => void;
  reset: () => void;
}

export const useSolutionsStore = create<SolutionsState>((set) => ({
  solutions: [],
  isLoading: true,

  setLoading: (v) => set({ isLoading: v }),

  setSolutions: (solutions) =>
    set({
      solutions,
      isLoading: false,
    }),

  toggleLike: (id) =>
    set((state) => ({
      solutions: state.solutions.map((s) =>
        s.id === id
          ? {
            ...s,
            isLiked: !s.upvotes,
            likes: s.upvotes ? s.upvotes - 1 : s.upvotes + 1,
          }
          : s
      ),
    })),

  addSolution: (solution) =>
    set((state) => ({
      solutions: [solution, ...state.solutions],
    })),

  reset: () =>
    set({
      solutions: [],
      isLoading: true,
    }),
}));
