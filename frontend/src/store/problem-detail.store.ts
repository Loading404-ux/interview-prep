import { create } from "zustand";



interface ProblemDetailState {
  problem: ProblemDetail | null;
  isLoading: boolean;
  setProblem: (p?: ProblemDetail) => void;
  setLoading: (v: boolean) => void;
}

export const useProblemDetailStore = create<ProblemDetailState>((set) => ({
  problem: null,
  isLoading: true,
  setProblem: (problem) => set({ problem, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),
}));
