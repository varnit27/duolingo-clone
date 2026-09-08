from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import models as m
from app.schemas import schemas as s
from app.game_logic import regenerate_hearts

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/{user_id}", response_model=s.UserOut)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(m.User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    regenerate_hearts(user)
    db.commit()
    return user


@router.post("/{user_id}/refill-hearts", response_model=s.UserOut)
def refill_hearts(user_id: int, db: Session = Depends(get_db)):
    """Mocked 'practice to refill' / gem-purchase refill — instantly maxes hearts."""
    user = db.query(m.User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user.hearts = user.max_hearts
    user.hearts_last_refill_at = None
    db.commit()
    db.refresh(user)
    return user


@router.get("/leaderboard/top", response_model=list[s.LeaderboardEntry])
def leaderboard(db: Session = Depends(get_db), limit: int = 10):
    users = db.query(m.User).order_by(m.User.xp_total.desc()).limit(limit).all()
    return [
        s.LeaderboardEntry(rank=i + 1, username=u.username, display_name=u.display_name, xp_total=u.xp_total)
        for i, u in enumerate(users)
    ]
