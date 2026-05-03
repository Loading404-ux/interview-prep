import { BASE_URL } from "./api-client"
import { ApiError, normalizeUnknownError, parseApiError } from "@/lib/api-errors"
import { useApiStore } from "@/store/api.store"

export type ApiStreamOptions = ApiOptions & {
  signal?: AbortSignal
  timeoutMs?: number
  onStart?: () => void
  onFinish?: () => void
  onError?: (error: ApiError) => void
}

export async function apiStream(
  endpoint: string,
  {
    method = "POST",
    body,
    token,
    signal,
    timeoutMs,
    onStart,
    onFinish,
    onError,
  }: ApiStreamOptions
) {
  const apiStore = useApiStore.getState()
  const controller = new AbortController()
  const timerId = timeoutMs
    ? globalThis.setTimeout(() => controller.abort(), timeoutMs)
    : null

  const requestSignal = signal || controller.signal
  try {
    onStart?.()
    apiStore.startRequest()

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
      signal: requestSignal,
    })

    if (!res.ok || !res.body) {
      throw await parseApiError(res)
    }

    return res.body.getReader()
  } catch (err) {
    const normalized = normalizeUnknownError(err)
    apiStore.setError(normalized)
    onError?.(normalized)
    throw normalized
  } finally {
    if (timerId) globalThis.clearTimeout(timerId)
    apiStore.endRequest()
    onFinish?.()
  }
}




// const reader = await apiStream("/ai/chat", {
//   body: { prompt },
//   token,
// })

// const decoder = new TextDecoder()

// while (true) {
//   const { done, value } = await reader.read()
//   if (done) break

//   const chunk = decoder.decode(value)
//   console.log(chunk) // append to UI
// }
