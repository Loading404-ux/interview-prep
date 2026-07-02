import { ActivityLog, ActivityLogSchema } from "./activity-log.schema";
import { AptitudeQuestion, AptitudeQuestionSchema } from "./aptitude-question.schema";
import { AptitudeSession, AptitudeSessionSchema } from "./aptitude-session.schema";
import { CodingDiscussion, CodingDiscussionSchema } from "./coding-discussion.schema";
import { CodingQuestion, CodingQuestionSchema } from "./coding-questions.schema";
import { CodingSubmission, CodingSubmissionSchema } from "./coding-submission.schema";
import { SubmissionVote, SubmissionVoteSchema } from "./coding-submission-vote.schema"

import { HrQuestion, HrQuestionSchema } from "./hr-questions.schema";
import { HrSession, HrSessionSchema } from "./hr-session.schema";
import { UserAchievement, UserAchievementSchema } from "./user_achievements.schema";
import { UserMetrics, UserMetricsSchema } from "./user_metrics.schema";
import { User, UserSchema } from "./user.schema";
import { DiscussionVote, DiscussionVoteSchema } from "./coding-discussion-vote.schema";
import { DailyActivity, DailyActivitySchema } from "./daily-activity.schema";


export const Schemas = {
    ActivityLogSchema,
    AptitudeQuestionSchema,
    AptitudeSessionSchema,
    CodingQuestionSchema,
    CodingDiscussionSchema,
    CodingSubmissionSchema,

    SubmissionVote,
    SubmissionVoteSchema,
    DiscussionVote,
    DiscussionVoteSchema,

    DailyActivity,
    DailyActivitySchema,

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
    UserAchievementSchema,
    UserMetrics,
    UserSchema,
    User
};