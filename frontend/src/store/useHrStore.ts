import { create } from "zustand"

type HrSessionStatus = "IDLE" | "RUNNING" | "COMPLETED"

type HrState = {
  // session
  sessionId: string | null
  sessionStatus: HrSessionStatus

  // questions
  questions: HrQuestion[]
  currentIndex: number

  // ai
  feedback: HrFeedback | null
  finalReport: HrAiEvaluation | null

  // device
  micSupported: boolean
  micError?: string

  // actions
  setMicStatus: (ok: boolean, err?: string) => void
  startSession: (sessionId: string, questions: HrQuestion[]) => void
  setFeedback: (f: HrFeedback) => void
  setFinalReport: (r: HrAiEvaluation) => void
  nextQuestion: () => void
  reset: () => void
}

export const useHrStore = create<HrState>((set) => ({
  // -------- initial state --------
  sessionId: null,
  sessionStatus: "IDLE",

  questions: [],
  currentIndex: 0,

  feedback: null,
  finalReport: null,

  micSupported: false,
  micError: undefined,

  // -------- actions --------
  setMicStatus: (ok, err) =>
    set({
      micSupported: ok,
      micError: err,
    }),

  startSession: (sessionId, questions) =>
    set({
      sessionId,
      questions,
      currentIndex: 0,
      feedback: null,
      finalReport: null,
      sessionStatus: "RUNNING",
    }),

  setFeedback: (feedback) =>
    set({
      feedback,
    }),

  setFinalReport: (report) =>
    set({
      finalReport: report,
      sessionStatus: "COMPLETED",
    }),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      feedback: null,
    })),

  reset: () =>
    set({
      sessionId: null,
      sessionStatus: "IDLE",

      questions: [],
      currentIndex: 0,

      feedback: null,
      finalReport: null,

      micSupported: false,
      micError: undefined,
    }),
}))
