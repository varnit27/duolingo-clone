"""
Gamification rules, kept out of the route handlers so they're easy to find,
test, and explain in an evaluation interview.
"""
from datetime import date, datetime, timedelta

from sqlalchemy.orm import Session

from app.models.models import User, Skill, UserSkillProgress, SkillStatus

HEART_REFILL_INTERVAL_MINUTES = 30  # regen 1 heart every 30 min, mocked/testable


def apply_daily_streak(user: User) -> None:
    """
    Call this whenever a user completes a lesson.
    - Same day as last activity -> no change.
    - Exactly one day later -> streak += 1.
    - More than one day later -> streak resets to 1.
    - First ever activity -> streak = 1.
    """
    today = date.today()
    if user.last_activity_date == today:
        return
    if user.last_activity_date == today - timedelta(days=1):
        user.streak_count += 1
    else:
        user.streak_count = 1
    user.last_activity_date = today
    user.xp_today = 0 if user.last_activity_date != today else user.xp_today


def regenerate_hearts(user: User) -> None:
    """
    Lazily regenerate hearts based on elapsed time since hearts_last_refill_at.
    Called at the start of any request that reads/uses hearts, so no
    background job/cron is needed for the assignment's purposes.
    """
    if user.hearts >= user.max_hearts:
        user.hearts_last_refill_at = None
        return
    if user.hearts_last_refill_at is None:
        user.hearts_last_refill_at = datetime.utcnow()
        return

    elapsed = datetime.utcnow() - user.hearts_last_refill_at
    intervals_passed = int(elapsed.total_seconds() // (HEART_REFILL_INTERVAL_MINUTES * 60))
    if intervals_passed > 0:
        user.hearts = min(user.max_hearts, user.hearts + intervals_passed)
        if user.hearts >= user.max_hearts:
            user.hearts_last_refill_at = None
        else:
            user.hearts_last_refill_at += timedelta(
                minutes=intervals_passed * HEART_REFILL_INTERVAL_MINUTES
            )


def unlock_next_skills(db: Session, user: User, completed_skill: Skill) -> list[int]:
    """
    After a skill is completed, unlock the next skill in the same unit
    (by order_index), and if it was the unit's last skill, unlock the
    first skill of the next unit. Returns list of newly-unlocked skill ids.
    """
    unlocked_ids: list[int] = []
    unit = completed_skill.unit

    next_in_unit = next(
        (s for s in unit.skills if s.order_index == completed_skill.order_index + 1),
        None,
    )
    candidates = []
    if next_in_unit:
        candidates.append(next_in_unit)
    else:
        course = unit.course
        next_unit = next(
            (u for u in course.units if u.order_index == unit.order_index + 1), None
        )
        if next_unit and next_unit.skills:
            candidates.append(next_unit.skills[0])

    for skill in candidates:
        progress = (
            db.query(UserSkillProgress)
            .filter_by(user_id=user.id, skill_id=skill.id)
            .first()
        )
        if progress is None:
            progress = UserSkillProgress(user_id=user.id, skill_id=skill.id)
            db.add(progress)
        if progress.status == SkillStatus.locked:
            progress.status = SkillStatus.available
            unlocked_ids.append(skill.id)

    return unlocked_ids
