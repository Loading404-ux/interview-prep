import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useAptitudeStore } from "@/store/useAptitudeStore"
import { API_ROUTES } from "@/routes"
// import { AptitudeSession, AptitudeAnswerResult } from "@/types/aptitude"

export function useAptitude() {
  const { getToken } = useAuth()
  const store = useAptitudeStore()

  const start = async (mode: "RAPID" | "STANDARD") => {
    // 🔒 Prevent restarting an active session
    if (store.sessionId) return

    const token = await getToken()

    const res = await api<AptitudeSession>(
      API_ROUTES.APTITUDE.SESSION_START,
      {
        method: "POST",
        token,
        body: {
          mode,
          noOfQuestions: 10,
        },
      }
    )

    store.start(res.sessionId, res.questions,mode)
  }

  const submitAnswer = async (
    questionId: string,
    selectedOption: number
  ): Promise<AptitudeAnswerResult> => {
    if (!store.sessionId) {
      throw new Error("No active aptitude session")
    }

    const index = store.currentIndex // 🔒 SNAPSHOT INDEX
    const token = await getToken()

    const res = await api<AptitudeAnswerResult>(
      API_ROUTES.APTITUDE.ANSWER_SUBMIT,
      {
        method: "POST",
        token,
        body: {
          sessionId: store.sessionId,
          questionId,
          selectedOption,
        },
      }
    )

    // ✅ Deterministic state update
    store.answer(index, selectedOption)
    store.setResult(index, res)

    return res
  }

  const complete = async () => {
    if (!store.sessionId) return

    const token = await getToken()

    const res = await api<{ accuracy: number }>(
      API_ROUTES.APTITUDE.SESSION_COMPLETE,
      {
        method: "POST",
        token,
        body: {
          sessionId: store.sessionId,
        },
      }
    )

    store.complete(res.accuracy)
  }

  return {
    ...store,
    start,
    submitAnswer,
    complete,
  }
}
