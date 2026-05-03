import { useHrStore } from "@/store/useHrStore"
import { Microphone } from "@/utils/Microphone"
import { useClerkToken } from "@/hooks/useClerkToken"
import {
  completeHrSession,
  startHrSession,
  submitHrAnswer,
} from "@/services/hr.service"

export function useHrInterview() {
  const { getToken } = useClerkToken()
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
    const res = await startHrSession(token)

    store.startSession(res.sessionId, res.questions)
  }


  // SUBMIT ANSWER
  const submitAnswer = async (
    audio: Blob,
    questionId: string
  ): Promise<HrFeedback> => {
    if (!store.sessionId) {
      throw new Error("No active HR session")
    }

    const token = await getToken()
    const res = await submitHrAnswer(token, {
      audio,
      sessionId: store.sessionId,
      questionId,
    })

    store.setFeedback(res)
    return res
  }

  const complete = async () => {
    if (!store.sessionId) return

    const token = await getToken()
    const report = await completeHrSession(token, store.sessionId)

    store.setFinalReport(report)
  }


  return {
    ...store,
    start,
    submitAnswer,
    complete,
  }
}
