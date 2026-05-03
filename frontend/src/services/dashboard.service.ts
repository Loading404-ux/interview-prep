import { api } from "@/lib/api-client"
import { API_ROUTES } from "@/routes"

export async function fetchDashboard(
    token: string
): Promise<DashboardResponse> {
    const [streak, progressCards, streakCalender] = await Promise.all([
        api<StreakProgress>(API_ROUTES.USER.DASHBOARD_STREAK, { token }),
        api<DashboardProgressCards>(API_ROUTES.USER.DASHBOARD_CARDS, { token }),
        api<Contribution[]>(API_ROUTES.USER.DASHBOARD_STREAK_CALENDER, { token }),
    ])

    return {
        streak,
        progressCards,
        streakCalender,
    }
}
