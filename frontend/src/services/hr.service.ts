import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"

export async function startHrSession(token: string): Promise<HrSession> {
    return api<HrSession>(API_ROUTES.HR.SESSION_START, {
        method: "POST",
        token,
        body: {},
    })
}

export async function submitHrAnswer(
    token: string,
    payload: { audio: Blob; sessionId: string; questionId: string }
): Promise<HrFeedback> {
    const form = new FormData()
    form.append("audio", payload.audio)
    form.append("sessionId", payload.sessionId)
    form.append("questionId", payload.questionId)

    return api<HrFeedback>(API_ROUTES.HR.ANSWER_SUBMIT, {
        method: "POST",
        token,
        body: form,
        isMultipart: true,
    })
}

export async function completeHrSession(
    token: string,
    sessionId: string
): Promise<HrAiEvaluation> {
    return api<HrAiEvaluation>(API_ROUTES.HR.SESSION_COMPLETE, {
        method: "POST",
        token,
        body: { sessionId },
    })
}
