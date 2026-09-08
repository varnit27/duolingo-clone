"""
SQLAlchemy models.

Hierarchy:
  Course -> Unit -> Skill -> Lesson -> Exercise -> ExerciseOption

Progress:
  User -> UserSkillProgress (per skill: locked/available/completed, crowns)
  User -> UserLessonCompletion (history of finished lessons, for XP/streak logging)

Design notes:
- `data_json` on Exercise is a flexible text (JSON-encoded) field for exercise-type-
  specific payloads (e.g. word bank tokens for "translate", pair groupings for
  "match_pairs") so we don't need a different table per exercise type.
- Crowns (0-5) track mastery depth per skill, separate from locked/available/completed
  status, mirroring Duolingo's progress-ring-per-skill idea.
"""
import enum
from datetime import datetime, date

from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, DateTime, Date, Enum, Text
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class ExerciseType(str, enum.Enum):
    multiple_choice = "multiple_choice"
    translate = "translate"          # tap-the-words / word bank
    match_pairs = "match_pairs"
    fill_blank = "fill_blank"
    type_answer = "type_answer"


class SkillStatus(str, enum.Enum):
    locked = "locked"
    available = "available"
    completed = "completed"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)

    xp_total = Column(Integer, default=0, nullable=False)
    daily_xp_goal = Column(Integer, default=30, nullable=False)
    xp_today = Column(Integer, default=0, nullable=False)

    streak_count = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(Date, nullable=True)

    hearts = Column(Integer, default=5, nullable=False)
    max_hearts = Column(Integer, default=5, nullable=False)
    hearts_last_refill_at = Column(DateTime, nullable=True)

    gems = Column(Integer, default=500, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    skill_progress = relationship("UserSkillProgress", back_populates="user")
    lesson_completions = relationship("UserLessonCompletion", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)          # e.g. "Spanish"
    slug = Column(String, unique=True, nullable=False)
    flag_emoji = Column(String, default="🌐")

    units = relationship("Unit", back_populates="course", order_by="Unit.order_index")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    color = Column(String, default="#58CC02")       # unit theme color

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String, default="star")
    order_index = Column(Integer, nullable=False)
    max_crowns = Column(Integer, default=5, nullable=False)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index")
    user_progress = relationship("UserSkillProgress", back_populates="skill")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    xp_reward = Column(Integer, default=10, nullable=False)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    type = Column(Enum(ExerciseType), nullable=False)

    prompt = Column(String, nullable=False)          # question / instruction text
    correct_answer = Column(String, nullable=True)   # for type_answer / fill_blank
    data_json = Column(Text, nullable=True)           # exercise-type-specific payload

    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", order_by="ExerciseOption.order_index")


class ExerciseOption(Base):
    """Used by multiple_choice (answer choices) and match_pairs (pair tiles)."""
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    pair_key = Column(String, nullable=True)   # matching options share a pair_key

    exercise = relationship("Exercise", back_populates="options")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    status = Column(Enum(SkillStatus), default=SkillStatus.locked, nullable=False)
    crowns = Column(Integer, default=0, nullable=False)
    lessons_completed = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="user_progress")


class UserLessonCompletion(Base):
    __tablename__ = "user_lesson_completions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    xp_earned = Column(Integer, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lesson_completions")
    lesson = relationship("Lesson")
