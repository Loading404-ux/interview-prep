import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useHrStore } from "@/store/useHrStore"
import { toast } from "sonner"

export function useHrInterview() {
  const { getToken } = useAuth()
  const store = useHrStore()

  const start = async () => {
    if (store.sessionId) return // 🔒 prevent duplicate session

    store.isLoading = true
    const token = await getToken()

    const res = await api<HrSession>("/hr/session/start", {
      method: "POST",
      token,
      body: {},
    })

    store.startSession(res.sessionId, res.questions)
  }

  const submitAnswer = async (audio: Blob, questionId: string) => {
    const token = await getToken()

    const form = new FormData()
    form.append("audio", audio)
    form.append("sessionId", store.sessionId!)
    form.append("questionId", questionId)

    try {
      const res = await api<HrFeedback>("/hr/answer/submit", {
        method: "POST",
        token,
        body: form,
        isMultipart: true,
      })

      store.setFeedback(res)
    } catch (error: any) {
      toast(error.message)
    }
  }

  const complete = async () => {
    try {
      const token = await getToken()
      await api("/hr/session/complete", {
        method: "POST",
        token,
        body: { sessionId: store.sessionId },
      })
    } catch (error: any) {
      toast(error.message)

    }
  }

  return { ...store, start, submitAnswer, complete }
}
