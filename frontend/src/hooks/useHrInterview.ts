import { useAuth } from "@clerk/nextjs"
import { api } from "@/lib/api-client"
import { useHrStore } from "@/store/useHrStore"
import { API_ROUTES } from "@/routes"
import { Microphone } from "@/utils/Microphone"

export function useHrInterview() {
  const { getToken } = useAuth()
  const store = useHrStore()

  const start = async () => {
    if (store.sessionId) return

    const mic = await Microphone.isSupported()
    if (!mic.supported) {
      store.setMicStatus(false, mic.reason)
      return
    }

    store.setMicStatus(true)

    const token = await getToken()
    const res = await api<HrSession>(API_ROUTES.HR.SESSION_START, {
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

    const res = await api<HrFeedback>(API_ROUTES.HR.ANSWER_SUBMIT, {
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
    const token = await getToken()
    const report = await api<HrAiEvaluation>(
      API_ROUTES.HR.SESSION_COMPLETE,
      {
        method: "POST",
        token,
        body: { sessionId: store.sessionId },
      }
    )

    store.setFinalReport(report)
  }


  return {
    ...store,
    start,
    submitAnswer,
    complete,
  }
}
