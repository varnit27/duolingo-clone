from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import models as m
from app.schemas import schemas as s

router = APIRouter(prefix="/api/path", tags=["path"])


@router.get("/{user_id}", response_model=s.CourseOut)
def get_path(user_id: int, db: Session = Depends(get_db)):
    """
    Returns the full course tree (units -> skills) merged with this user's
    per-skill progress (status/crowns), so the frontend can render the
    locked/available/completed path in one call.
    """
    course = db.query(m.Course).first()
    if not course:
        raise HTTPException(404, "No course seeded")

    progress_by_skill = {
        p.skill_id: p
        for p in db.query(m.UserSkillProgress).filter_by(user_id=user_id).all()
    }

    units_out = []
    for unit in course.units:
        skills_out = []
        for skill in unit.skills:
            progress = progress_by_skill.get(skill.id)
            skills_out.append(
                s.SkillOut(
                    id=skill.id,
                    title=skill.title,
                    icon=skill.icon,
                    order_index=skill.order_index,
                    max_crowns=skill.max_crowns,
                    status=progress.status if progress else m.SkillStatus.locked,
                    crowns=progress.crowns if progress else 0,
                    lessons_completed=progress.lessons_completed if progress else 0,
                    lesson_count=len(skill.lessons),
                    lesson_ids=[l.id for l in skill.lessons],
                )
            )
        units_out.append(
            s.UnitOut(
                id=unit.id,
                title=unit.title,
                order_index=unit.order_index,
                color=unit.color,
                skills=skills_out,
            )
        )

    return s.CourseOut(
        id=course.id,
        name=course.name,
        slug=course.slug,
        flag_emoji=course.flag_emoji,
        units=units_out,
    )
