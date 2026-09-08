export type SkillStatus = "locked" | "available" | "completed";

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface Skill {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  max_crowns: number;
  status: SkillStatus;
  crowns: number;
  lessons_completed: number;
  lesson_count: number;
  lesson_ids: number[];
}

export interface Unit {
  id: number;
  title: string;
  order_index: number;
  color: string;
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  slug: string;
  flag_emoji: string;
  units: Unit[];
}

export interface UserProfile {
  id: number;
  username: string;
  display_name: string;
  xp_total: number;
  xp_today: number;
  daily_xp_goal: number;
  streak_count: number;
  hearts: number;
  max_hearts: number;
  gems: number;
}

export interface ExerciseOption {
  id: number;
  text: string;
  order_index: number;
  pair_key: string | null;
}

export interface Exercise {
  id: number;
  order_index: number;
  type: ExerciseType;
  prompt: string;
  data: any;
  options: ExerciseOption[];
}

export interface Lesson {
  id: number;
  skill_id: number;
  xp_reward: number;
  exercises: Exercise[];
}

export interface AnswerResult {
  correct: boolean;
  correct_answer: string | null;
  hearts_remaining: number;
  lesson_failed: boolean;
}

export interface LessonCompleteResult {
  xp_earned: number;
  xp_total: number;
  streak_count: number;
  crowns: number;
  skill_status: SkillStatus;
  newly_unlocked_skill_ids: number[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  display_name: string;
  xp_total: number;
}
