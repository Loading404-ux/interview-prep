import { create } from "zustand"
import { persist } from "zustand/middleware"

type AptitudeState = {
  // session
  sessionId: string | null
  sessionStatus: AptitudeSessionStatus
  mode: AptitudeMode | null

  // questions
  questions: AptitudeQuestion[]
  currentIndex: number

  // answers
  answers: (number | null)[]
  results: (AptitudeAnswerResult | null)[]
  accuracy: number | null

  // actions
  start: (sessionId: string, questions: AptitudeQuestion[], mode: AptitudeMode) => void
  answer: (index: number, selected: number) => void
  setResult: (index: number, r: AptitudeAnswerResult) => void
  next: () => void
  complete: (accuracy: number) => void
  reset: () => void
}

export const useAptitudeStore = create<AptitudeState>()(
  persist(
    (set) => ({
      // ---- initial ----
      sessionId: null,
      sessionStatus: "IDLE",
      mode: null,

      questions: [],
      currentIndex: 0,

      answers: [],
      results: [],
      accuracy: null,

      // ---- actions ----
      start: (sessionId, questions, mode) =>
        set({
          sessionId,
          mode,
          sessionStatus: "RUNNING",
          questions,
          currentIndex: 0,
          answers: Array(questions.length).fill(null),
          results: Array(questions.length).fill(null),
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
          next[index] = r
          return { results: next }
        }),

      next: () =>
        set((s) => ({
          currentIndex: s.currentIndex + 1,
        })),

      complete: (accuracy) =>
        set({
          accuracy,
          sessionStatus: "COMPLETED",
        }),

      reset: () =>
        set({
          sessionId: null,
          sessionStatus: "IDLE",
          mode: null,
          questions: [],
          currentIndex: 0,
          answers: [],
          results: [],
          accuracy: null,
        }),
    }),
    {
      name: "aptitude-session",
      partialize: (s) => ({
        sessionId: s.sessionId,
        sessionStatus: s.sessionStatus,
        mode: s.mode,
        questions: s.questions,
        currentIndex: s.currentIndex,
        answers: s.answers,
        results: s.results,
        accuracy: s.accuracy,
      }),
    }
  )
)
