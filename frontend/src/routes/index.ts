export const API_ROUTES = {
  USER: {
    PROFILE_FETCH: "/user/profile",
    DASHBOARD_CARDS: "/user/dashboard/cards",
    DASHBOARD_STREAK: "/user/dashboard/streak",
    ME_PROFILE: "/user/me/profile",
    ME_TARGETS: "/user/me/targets",
    ME_CONTRIBUTIONS: "/user/me/contributions",
    DASHBOARD_STREAK_CALENDER: "/user/dashboard/streak-calendar",
    SET_TARGETS: "/user/me/targets",
    UPDATE_PROFILE: "/user/me/profile",
  },

  ACTIVITY: {
    HISTORY: "/activity/history",
  },

  CODING: {
    QUESTIONS: "/coding/questions",
    QUESTION_DETAILS: (id: string) => `/coding/question/${id}`,
    SUBMIT_SOLUTION: "/coding/submit-solution",
    GET_SUBMISSIONS: (id: string) => `/coding/submission/${id}`,
    TOGGLE_SOLUTION_VOTE: (id: string) => `/coding/submission/${id}/vote`,
    DISCUSSION_CREATE: "/coding/discussion",
    ADD_DISCUSSIONS: `/coding/discussion`,
    DISCUSSIONS: (id: string) => `/coding/discussion/${id}`,
    TOGGLE_DISCUSSION_VOTE: (id: string) => `/coding/discussion/${id}/vote`,
    DISCUSSION_REPLIES:`/coding/discussion/replies`,
  },

  HR: {
    SESSION_START: "/hr/session/start",
    ANSWER_SUBMIT: "/hr/answer/submit",
    SESSION_COMPLETE: "/hr/session/complete",
  },

  APTITUDE: {
    SESSION_START: "/aptitude/session/start",
    ANSWER_SUBMIT: "/aptitude/answer/submit",
    SESSION_COMPLETE: "/aptitude/session/complete",
  },

  INTERVIEW: {
    CONTEXT_RESUME: "/interview/context/resume",
    ANSWER: (sessionId: string) =>
      `/interview/answer/${sessionId}`,
    SESSION_COMPLETE: (sessionId: string) =>
      `/interview/session/complete/${sessionId}`,
  },
} as const;
