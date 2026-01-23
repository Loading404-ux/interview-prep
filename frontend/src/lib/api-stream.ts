import { BASE_URL } from "./api-client"

export async function apiStream(
  endpoint: string,
  {
    method = "POST",
    body,
    token,
  }: ApiOptions
) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok || !res.body) {
    throw new Error("Stream failed")
  }

  return res.body.getReader()
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
