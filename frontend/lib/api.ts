import type {
  Course,
  UserProfile,
  Lesson,
  AnswerResult,
  LessonCompleteResult,
  LeaderboardEntry,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Simplified auth: the assignment allows a default logged-in learner.
// The seed script creates user id 1 ("demo") — swap this out if you add real auth.
export const DEFAULT_USER_ID = 1;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export const api = {
  getPath: (userId = DEFAULT_USER_ID) => request<Course>(`/api/path/${userId}`),

  getProfile: (userId = DEFAULT_USER_ID) => request<UserProfile>(`/api/users/${userId}`),

  getLeaderboard: () => request<LeaderboardEntry[]>(`/api/users/leaderboard/top`),

  refillHearts: (userId = DEFAULT_USER_ID) =>
    request<UserProfile>(`/api/users/${userId}/refill-hearts`, { method: "POST" }),

  getLesson: (lessonId: number) => request<Lesson>(`/api/lessons/${lessonId}`),

  submitAnswer: (
    userId: number,
    body: { exercise_id: number; option_id?: number; answer_text?: string; matched_pairs?: number[][] }
  ) =>
    request<AnswerResult>(`/api/lessons/answer/${userId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  completeLesson: (lessonId: number, userId = DEFAULT_USER_ID) =>
    request<LessonCompleteResult>(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),
};
