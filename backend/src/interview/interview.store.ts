import { randomUUID } from "crypto";

export type InterviewSession = {
  sessionId: string;
  resumeContext: any;
  questions: string[];
  answers: string[];
  signals: any[];
};

const sessions = new Map<string, InterviewSession>();

export function createSession(resumeContext: any, firstQuestion: string) {
  const sessionId = randomUUID();
  sessions.set(sessionId, {
    sessionId,
    resumeContext,
    questions: [firstQuestion],
    answers: [],
    signals: [],
  });
  return sessionId;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

export function updateSession(sessionId: string, patch: Partial<InterviewSession>) {
  const s = sessions.get(sessionId);
  if (!s) throw new Error("Session not found");
  Object.assign(s, patch);
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId);
}
