import { useAptitudeStore } from "@/store/useAptitudeStore"
import { useClerkToken } from "@/hooks/useClerkToken"
import {
    completeAptitudeSession,
    startAptitudeSession,
    submitAptitudeAnswer,
} from "@/services/aptitude.service"

export function useAptitude() {
    const { getToken } = useClerkToken()
    const store = useAptitudeStore()

    const start = async (mode: "RAPID" | "STANDARD") => {
        if (store.sessionId) return

        const token = await getToken()
        const res = await startAptitudeSession(token, mode)

        store.start(res.sessionId, res.questions, mode)
    }

    const submitAnswer = async (
        questionId: string,
        selectedOption: number
    ): Promise<AptitudeAnswerResult> => {
        if (!store.sessionId) {
            throw new Error("No active aptitude session")
        }

        const index = store.currentIndex
        const token = await getToken()

        const res = await submitAptitudeAnswer(token, {
            sessionId: store.sessionId,
            questionId,
            selectedOption,
        })

        store.answer(index, selectedOption)
        store.setResult(index, res)

        return res
    }

    const complete = async () => {
        if (!store.sessionId) return

        const token = await getToken()
        const res = await completeAptitudeSession(token, store.sessionId)

        store.complete(res.accuracy)
    }

    return {
        ...store,
        start,
        submitAnswer,
        complete,
    }
}
