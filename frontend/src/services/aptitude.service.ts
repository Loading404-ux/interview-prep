import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"

export async function startAptitudeSession(
    token: string,
    mode: "RAPID" | "STANDARD",
    noOfQuestions = 10
): Promise<AptitudeSession> {
    return api<AptitudeSession>(API_ROUTES.APTITUDE.SESSION_START, {
        method: "POST",
        token,
        body: {
            mode,
            noOfQuestions,
        },
    })
}

export async function submitAptitudeAnswer(
    token: string,
    payload: {
        sessionId: string
        questionId: string
        selectedOption: number
    }
): Promise<AptitudeAnswerResult> {
    return api<AptitudeAnswerResult>(API_ROUTES.APTITUDE.ANSWER_SUBMIT, {
        method: "POST",
        token,
        body: payload,
    })
}

export async function completeAptitudeSession(
    token: string,
    sessionId: string
): Promise<{ accuracy: number }> {
    return api<{ accuracy: number }>(API_ROUTES.APTITUDE.SESSION_COMPLETE, {
        method: "POST",
        token,
        body: { sessionId },
    })
}
