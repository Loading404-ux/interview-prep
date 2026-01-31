import { create } from "zustand";



interface ProblemDetailState {
  problem: CodingProblemDetail | null;
  isLoading: boolean;
  setProblem: (p?: CodingProblemDetail) => void;
  setLoading: (v: boolean) => void;
}

export const useProblemDetailStore = create<ProblemDetailState>((set) => ({
  problem: null,
  isLoading: true,
  setProblem: (problem) => set({ problem, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),
}));
