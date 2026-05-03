export type ApiErrorPayload = {
    message?: string
    code?: string
    details?: unknown
}

export class ApiError extends Error {
    status: number
    code?: string
    details?: unknown

    constructor(message: string, status: number, code?: string, details?: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.code = code
        this.details = details
    }
}

async function safeReadJson(res: Response): Promise<ApiErrorPayload | null> {
    try {
        return (await res.json()) as ApiErrorPayload
    } catch {
        return null
    }
}

export async function parseApiError(res: Response): Promise<ApiError> {
    const payload = await safeReadJson(res)
    const message = payload?.message || res.statusText || "Request failed"
    return new ApiError(message, res.status, payload?.code, payload?.details)
}

export function normalizeUnknownError(err: unknown): ApiError {
    if (err instanceof ApiError) return err
    if (err instanceof Error) {
        return new ApiError(err.message, 0)
    }
    return new ApiError("Unknown error", 0)
}
