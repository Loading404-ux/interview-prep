import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"

export async function fetchProfile(
    token: string
): Promise<UserProfileResponse> {
    return api<UserProfileResponse>(API_ROUTES.USER.ME_PROFILE, { token })
}
