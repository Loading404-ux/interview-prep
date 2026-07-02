import { ApiError, normalizeUnknownError, parseApiError } from "@/lib/api-errors"
import { useApiStore } from "@/store/api.store"

export const BASE_URL = "/api"

export type ApiRequestOptions = ApiOptions & {
  signal?: AbortSignal
  timeoutMs?: number
  onStart?: () => void
  onFinish?: () => void
  onError?: (error: ApiError) => void
}

export async function api<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    token,
    isMultipart = false,
    signal,
    timeoutMs,
    onStart,
    onFinish,
    onError,
  }: ApiRequestOptions = {}
): Promise<T> {
  const apiStore = useApiStore.getState()
  const controller = new AbortController()
  const timerId = timeoutMs
    ? globalThis.setTimeout(() => controller.abort(), timeoutMs)
    : null

  const requestSignal = signal || controller.signal
  try {
    onStart?.()
    apiStore.startRequest()

    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    // Only set JSON header if NOT multipart
    if (!isMultipart) {
      headers["Content-Type"] = "application/json"
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body
        ? isMultipart
          ? body // FormData goes RAW
          : JSON.stringify(body)
        : undefined,
      signal: requestSignal,
    })
    if (!res.ok) {
      throw await parseApiError(res)
    }

    if (res.status === 204) {
      return undefined as T
    }

    return (await res.json()) as T
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