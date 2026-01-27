import { create } from "zustand"
import { persist } from "zustand/middleware"

type HrState = {
  sessionId: string | null
  questions: HrQuestion[]
  currentIndex: number
  feedback: HrFeedback | null
  isLoading: boolean

  startSession: (sessionId: string, questions: HrQuestion[]) => void
  setFeedback: (f: HrFeedback) => void
  nextQuestion: () => void
  reset: () => void
}


export const useHrStore = create<HrState>()(
  persist(
    (set) => ({
      sessionId: null,
      questions: [],
      currentIndex: 0,
      feedback: null,
      isLoading: false,

      startSession: (sessionId, questions) =>
        set({
          sessionId,
          questions,
          currentIndex: 0,
          feedback: null,
          isLoading: false,
        }),

      setFeedback: (feedback) => set({ feedback }),

      nextQuestion: () =>
        set((s) => ({
          currentIndex: s.currentIndex + 1,
          feedback: null,
        })),

      reset: () =>
        set({
          sessionId: null,
          questions: [],
          currentIndex: 0,
          feedback: null,
        }),
    }),
    {
      name: "hr-session-store", // ✅ survives refresh
    }
  )
)
