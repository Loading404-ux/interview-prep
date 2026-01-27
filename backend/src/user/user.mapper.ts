import { User } from "src/schema/user.schema";
import { DashboardMetrics } from "./user.dto";
import { UserMetrics } from "src/schema/user_metrics.schema";

export class UserMapper {
    static UserResponse(data: Partial<User>) {
        return {
            email: data.email,
            name: data.name,
            clerkUserId: data.clerkUserId,
            college: data.university,
            avatar: data.profilePic,
            targetCompanies: data.targetCompanies,
            id: data._id,
            joinedDate: new Date(data.createdAt!).toDateString()
        }
    }
}

export class UserMetricsMapper {
  static toDashboard(metrics: UserMetrics): DashboardMetrics {
    return {
      coding: {
        solved: metrics.coding?.acceptedSubmissions ?? 0,
        total: metrics.coding?.totalSubmissions ?? 0,
      },
      hr: {
        completed: metrics.hr?.totalSessions ?? 0,
        total: 10, // 🎯 product decision, not DB concern
      },
      aptitude: {
        completed: metrics.aptitude?.totalAttempts ?? 0,
        total: 20, // 🎯 product decision
      },
    }
  }
}
