import { create } from "zustand"
// import { AptitudeQuestion, AptitudeAnswerResult } from "@/types/aptitude"

type AptitudeState = {
  sessionId: string | null
  questions: AptitudeQuestion[]
  currentIndex: number
  answers: (number | null)[]
  lastResult: AptitudeAnswerResult | null
  accuracy: number | null

  start: (sessionId: string, questions: AptitudeQuestion[]) => void
  answer: (index: number, selected: number) => void
  setResult: (r: AptitudeAnswerResult) => void
  next: () => void
  complete: (accuracy: number) => void
  reset: () => void
}

export const useAptitudeStore = create<AptitudeState>((set) => ({
  sessionId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  lastResult: null,
  accuracy: null,

  start: (sessionId, questions) =>
    set({
      sessionId,
      questions,
      answers: Array(questions.length).fill(null),
      currentIndex: 0,
      lastResult: null,
      accuracy: null,
    }),

  answer: (index, selected) =>
    set((s) => {
      const next = [...s.answers]
      next[index] = selected
      return { answers: next }
    }),

  setResult: (r) => set({ lastResult: r }),

  next: () =>
    set((s) => ({
      currentIndex: s.currentIndex + 1,
      lastResult: null,
    })),

  complete: (accuracy) => set({ accuracy }),

  reset: () =>
    set({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      lastResult: null,
      accuracy: null,
    }),
}))
