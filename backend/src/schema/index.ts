import { ActivityLog, ActivityLogSchema } from "./activity-log.schema";
import { AptitudeQuestion, AptitudeQuestionSchema } from "./aptitude-question.schema";
import { AptitudeSession, AptitudeSessionSchema } from "./aptitude-session.schema";
import { CodingDiscussion, CodingDiscussionSchema } from "./coding-discussion.schema";
import { CodingQuestion, CodingQuestionSchema } from "./coding-questions.schema";
import { CodingSubmission, CodingSubmissionSchema } from "./coding-submission.schema";

import { HrQuestion, HrQuestionSchema } from "./hr-questions.schema";
import { HrSession, HrSessionSchema } from "./hr-session.schema";
import { UserAchievement, UserAchievementSchema } from "./user_achievements.schema";
import { UserMetrics, UserMetricsSchema } from "./user_metrics.schema";
import { User, UserSchema } from "./user.schema";

export const Schemas = {
    UserSchema,
    ActivityLogSchema,
    UserAchievementSchema,
    AptitudeQuestionSchema,
    AptitudeSessionSchema,
    CodingQuestionSchema,
    CodingDiscussionSchema,
    CodingSubmissionSchema,
    HrQuestionSchema,
    HrSessionSchema,
    UserMetricsSchema,
    ActivityLog,
    UserAchievement,
    AptitudeQuestion,
    AptitudeSession,
    CodingQuestion,
    CodingDiscussion,
    CodingSubmission,
    HrQuestion,
    HrSession,
    UserMetrics,
    User
};