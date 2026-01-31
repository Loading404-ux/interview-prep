import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useAptitudeStore } from "@/store/useAptitudeStore"
import { API_ROUTES } from "@/routes"
// import { AptitudeSession, AptitudeAnswerResult } from "@/types/aptitude"

export function useAptitude() {
  const { getToken, userId } = useAuth()
  const store = useAptitudeStore()

  const start = async (mode: "RAPID" | "STANDARD") => {
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

    store.start(res.sessionId, res.questions)
  }

  const submitAnswer = async (
    questionId: string,
    selectedOption: number
  ): Promise<AptitudeAnswerResult> => {
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

    store.answer(store.currentIndex, selectedOption)
    store.setResult(store.currentIndex, res)
    return res
  }

  const complete = async () => {
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
