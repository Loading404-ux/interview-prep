import { create } from "zustand"
// import { AptitudeQuestion, AptitudeAnswerResult } from "@/types/aptitude"

type AptitudeState = {
  sessionId: string | null
  questions: AptitudeQuestion[]
  currentIndex: number
  answers: (number | null)[]
  accuracy: number | null



  results: (AptitudeAnswerResult | null)[]
  start: (sessionId: string, questions: AptitudeQuestion[]) => void
  answer: (index: number, selected: number) => void
  setResult: (index: number, r: AptitudeAnswerResult) => void
  next: () => void
  complete: (accuracy: number) => void
  reset: () => void
}

export const useAptitudeStore = create<AptitudeState>((set) => ({
  sessionId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  results: [], // 🔥 ADD THIS
  accuracy: null,

  start: (sessionId, questions) =>
    set({
      sessionId,
      questions,
      answers: Array(questions.length).fill(null),
      results: Array(questions.length).fill(null), // 🔥
      currentIndex: 0,
      accuracy: null,
    }),

  answer: (index, selected) =>
    set((s) => {
      const next = [...s.answers]
      next[index] = selected
      return { answers: next }
    }),

  setResult: (index, r) =>
    set((s) => {
      const next = [...s.results]
      next[index] = {
        correct: r.correct,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
      }
      return { results: next }
    }),

  next: () =>
    set((s) => ({
      currentIndex: s.currentIndex + 1,
    })),

  complete: (accuracy) => set({ accuracy }),

  reset: () =>
    set({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      results: [],
      accuracy: null,
    }),
}))
