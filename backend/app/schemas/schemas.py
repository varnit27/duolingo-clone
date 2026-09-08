"""Pydantic (v2) schemas — request/response shapes for the API."""
from datetime import date, datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict

from app.models.models import ExerciseType, SkillStatus


# ---------- User / profile ----------

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    display_name: str
    xp_total: int
    xp_today: int
    daily_xp_goal: int
    streak_count: int
    last_activity_date: Optional[date] = None
    hearts: int
    max_hearts: int
    gems: int


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    display_name: str
    xp_total: int


# ---------- Skill tree / path ----------

class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    icon: str
    order_index: int
    max_crowns: int
    status: SkillStatus
    crowns: int
    lessons_completed: int
    lesson_count: int
    lesson_ids: List[int]


class UnitOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order_index: int
    color: str
    skills: List[SkillOut]


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    flag_emoji: str
    units: List[UnitOut]


# ---------- Lesson player ----------

class ExerciseOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    order_index: int
    pair_key: Optional[str] = None
    # NOTE: is_correct intentionally omitted from the outbound payload —
    # don't leak answers to the client. Grading happens server-side.


class ExerciseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_index: int
    type: ExerciseType
    prompt: str
    data: Optional[Any] = None   # parsed data_json (word bank tokens, etc.)
    options: List[ExerciseOptionOut] = []


class LessonOut(BaseModel):
    id: int
    skill_id: int
    xp_reward: int
    exercises: List[ExerciseOut]


class AnswerSubmission(BaseModel):
    exercise_id: int
    # for multiple_choice: option_id. for type_answer/fill_blank: answer_text.
    # for match_pairs: list of matched option_id pairs as [[id1,id2], ...]
    option_id: Optional[int] = None
    answer_text: Optional[str] = None
    matched_pairs: Optional[List[List[int]]] = None


class AnswerResult(BaseModel):
    correct: bool
    correct_answer: Optional[str] = None
    hearts_remaining: int
    lesson_failed: bool = False


class LessonCompleteRequest(BaseModel):
    user_id: int


class LessonCompleteResult(BaseModel):
    xp_earned: int
    xp_total: int
    streak_count: int
    crowns: int
    skill_status: SkillStatus
    newly_unlocked_skill_ids: List[int] = []
