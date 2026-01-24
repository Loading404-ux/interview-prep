import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useAptitudeStore } from "@/store/useAptitudeStore"
// import { AptitudeSession, AptitudeAnswerResult } from "@/types/aptitude"

export function useAptitude() {
  const { getToken, userId } = useAuth()
  const store = useAptitudeStore()

  const start = async (mode: "RAPID" | "STANDARD") => {
    const token = await getToken()

    const res = await api<AptitudeSession>(
      "/aptitude/session/start",
      {
        method: "POST",
        token,
        body: {
          mode,
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
      "/aptitude/answer/submit",
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

    store.setResult(res)
    return res
  }

  const complete = async () => {
    const token = await getToken()

    const res = await api<{ accuracy: number }>(
      "/aptitude/session/complete",
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
