import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useHrStore } from "@/store/useHrStore"

export function useHrInterview() {
  const { getToken } = useAuth()
  const store = useHrStore()

  // START SESSION
  const start = async () => {
    store.isLoading = true
    const token = await getToken()

    const res = await api<HrSession>("/hr/session/start", {
      method: "POST",
      token,
      body: {},
    })

    store.startSession(res.sessionId, res.questions)
  }

  // SUBMIT ANSWER
  const submitAnswer = async (
    audio: Blob,
    questionId: string
  ): Promise<HrFeedback> => {
    const token = await getToken()

    const form = new FormData()
    form.append("audio", audio)
    form.append("sessionId", store.sessionId!)
    form.append("questionId", questionId)

    const res = await api<HrFeedback>("/hr/answer/submit", {
      method: "POST",
      token,
      body: form,
      isMultipart: true,
    })

    store.setFeedback(res)
    return res
  }

  // COMPLETE SESSION
  const complete = async () => {
    const token = await getToken()
    await api("/hr/session/complete", {
      method: "POST",
      token,
      body: { sessionId: store.sessionId },
    })
  }

  return {
    ...store,
    start,
    submitAnswer,
    complete,
  }
}
