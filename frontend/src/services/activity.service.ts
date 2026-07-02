import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"

export async function fetchActivityHistory(
    token: string
): Promise<ActivityDTO[]> {
    return api<ActivityDTO[]>(API_ROUTES.ACTIVITY.HISTORY, { token })
}
