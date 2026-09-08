import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import models as m
from app.schemas import schemas as s
from app.game_logic import apply_daily_streak, regenerate_hearts, unlock_next_skills

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("/{lesson_id}", response_model=s.LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(m.Lesson).get(lesson_id)
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    exercises_out = []
    for ex in lesson.exercises:
        exercises_out.append(
            s.ExerciseOut(
                id=ex.id,
                order_index=ex.order_index,
                type=ex.type,
                prompt=ex.prompt,
                data=json.loads(ex.data_json) if ex.data_json else None,
                options=[
                    s.ExerciseOptionOut(
                        id=o.id, text=o.text, order_index=o.order_index, pair_key=o.pair_key
                    )
                    for o in ex.options
                ],
            )
        )

    return s.LessonOut(
        id=lesson.id, skill_id=lesson.skill_id, xp_reward=lesson.xp_reward, exercises=exercises_out
    )


@router.post("/answer/{user_id}", response_model=s.AnswerResult)
def submit_answer(user_id: int, submission: s.AnswerSubmission, db: Session = Depends(get_db)):
    """
    Grades a single exercise answer server-side (client never receives
    correct answers up front) and deducts a heart on a wrong answer.
    """
    exercise = db.query(m.Exercise).get(submission.exercise_id)
    if not exercise:
        raise HTTPException(404, "Exercise not found")
    user = db.query(m.User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    regenerate_hearts(user)

    correct = _grade(exercise, submission)

    if not correct and user.hearts > 0:
        user.hearts -= 1
        if user.hearts == 0:
            user.hearts_last_refill_at = user.hearts_last_refill_at or __import__("datetime").datetime.utcnow()

    db.commit()

    return s.AnswerResult(
        correct=correct,
        correct_answer=exercise.correct_answer if not correct else None,
        hearts_remaining=user.hearts,
        lesson_failed=(user.hearts == 0 and not correct),
    )


def _grade(exercise: m.Exercise, submission: s.AnswerSubmission) -> bool:
    if exercise.type == m.ExerciseType.multiple_choice:
        opt = next((o for o in exercise.options if o.id == submission.option_id), None)
        return bool(opt and opt.is_correct)

    if exercise.type in (m.ExerciseType.type_answer, m.ExerciseType.fill_blank, m.ExerciseType.translate):
        given = (submission.answer_text or "").strip().lower()
        expected = (exercise.correct_answer or "").strip().lower()
        return given == expected

    if exercise.type == m.ExerciseType.match_pairs:
        if not submission.matched_pairs:
            return False
        options_by_id = {o.id: o for o in exercise.options}
        for id1, id2 in submission.matched_pairs:
            o1, o2 = options_by_id.get(id1), options_by_id.get(id2)
            if not o1 or not o2 or o1.pair_key != o2.pair_key or id1 == id2:
                return False
        return True

    return False


@router.post("/{lesson_id}/complete", response_model=s.LessonCompleteResult)
def complete_lesson(lesson_id: int, body: s.LessonCompleteRequest, db: Session = Depends(get_db)):
    """
    Called when the learner finishes all exercises in a lesson with hearts
    remaining. Awards XP, updates streak, bumps crowns/lesson progress,
    and unlocks the next skill(s) if this lesson completed a skill's set.
    """
    lesson = db.query(m.Lesson).get(lesson_id)
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    user = db.query(m.User).get(body.user_id)
    if not user:
        raise HTTPException(404, "User not found")

    user.xp_total += lesson.xp_reward
    user.xp_today += lesson.xp_reward
    apply_daily_streak(user)

    progress = (
        db.query(m.UserSkillProgress)
        .filter_by(user_id=user.id, skill_id=lesson.skill_id)
        .first()
    )
    if progress is None:
        progress = m.UserSkillProgress(
            user_id=user.id, skill_id=lesson.skill_id, status=m.SkillStatus.available
        )
        db.add(progress)

    progress.lessons_completed += 1
    skill = lesson.skill
    if progress.lessons_completed >= len(skill.lessons):
        progress.status = m.SkillStatus.completed
        progress.crowns = min(skill.max_crowns, progress.crowns + 1)
    else:
        progress.crowns = min(skill.max_crowns, progress.crowns)

    db.add(m.UserLessonCompletion(user_id=user.id, lesson_id=lesson.id, xp_earned=lesson.xp_reward))

    newly_unlocked: list[int] = []
    if progress.status == m.SkillStatus.completed:
        newly_unlocked = unlock_next_skills(db, user, skill)

    db.commit()
    db.refresh(progress)

    return s.LessonCompleteResult(
        xp_earned=lesson.xp_reward,
        xp_total=user.xp_total,
        streak_count=user.streak_count,
        crowns=progress.crowns,
        skill_status=progress.status,
        newly_unlocked_skill_ids=newly_unlocked,
    )
