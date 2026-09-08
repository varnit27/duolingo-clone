# Duolingo Web App Clone

A functional clone of Duolingo's core lesson loop and gamification mechanics,
built as a Next.js (TypeScript) frontend + FastAPI backend + SQLite database.

> **Status**: this is a working boilerplate/scaffold — the core loop (path →
> lesson → grading → completion → unlock → persistence) is implemented and
> tested end-to-end. UI polish, additional exercise variety, and the bonus
> features are next steps (see "What's left" at the bottom).

## Tech stack

- **Frontend**: Next.js 14 (App Router, TypeScript), Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy
- **Database**: SQLite (file-based, `backend/app.db`, created on first run)

## Setup instructions

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python -m app.db.seed        # creates app.db and seeds course + demo users
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Interactive docs at
`http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points NEXT_PUBLIC_API_URL at the backend
npm run dev
```

The app is now at `http://localhost:3000`.

There's no real authentication — every request acts as the seeded "demo"
learner (`user_id=1`), per the assignment's simplification allowance.

## Architecture overview

```
backend/
  app/
    main.py           FastAPI app, CORS, router registration
    game_logic.py      Streak, heart-regeneration, and skill-unlock rules
                        (kept separate from route handlers on purpose)
    db/
      database.py      SQLAlchemy engine/session
      seed.py           Seeds one course + 3 skills + 4 lessons + 3 users
    models/models.py    SQLAlchemy ORM models (the schema, see below)
    schemas/schemas.py  Pydantic request/response shapes
    routers/
      path.py           GET learning path (course/units/skills + user progress)
      lessons.py        GET lesson, POST answer (server-side grading),
                         POST complete (XP/streak/unlock)
      users.py          GET profile, POST refill-hearts, GET leaderboard

frontend/
  app/
    page.tsx            Home: skill tree / learning path
    lesson/[id]/page.tsx  Lesson player (the core loop)
    profile/page.tsx     Learner stats + leaderboard
  components/
    TopBar.tsx           Streak / XP / hearts / gems bar
    SkillNode.tsx         One node in the skill tree
    ExercisePlayer.tsx    Renders the right UI per exercise type
    FeedbackBar.tsx       Correct/incorrect feedback bar
    LessonCompleteModal.tsx / OutOfHeartsModal.tsx
  lib/
    api.ts               Typed fetch client for the backend
    types.ts              Shared TypeScript types matching backend schemas
```

**Why grading happens server-side**: the `/api/lessons/{id}` response never
includes `is_correct` on options or the answer key for multiple-choice, so a
learner can't read the answer out of the network tab. Only `/api/lessons/answer/{user_id}`
knows the answer, and it's the only thing that can dock a heart.

## Database schema

```
Course (1) ──< Unit (1) ──< Skill (1) ──< Lesson (1) ──< Exercise (1) ──< ExerciseOption
                                │
User ──< UserSkillProgress >── Skill      (per-user lock/available/completed + crowns)
User ──< UserLessonCompletion >── Lesson   (history, used for XP/streak logging)
```

- **Course / Unit / Skill / Lesson / Exercise / ExerciseOption** — the static
  content tree, seeded once.
- **ExerciseOption** does double duty: multiple-choice answer options
  (`is_correct` flag) and match-pairs tiles (`pair_key` groups the two tiles
  that belong together).
- **Exercise.data_json** is a flexible JSON text column for exercise-specific
  payloads that don't fit a fixed column (currently used for the `translate`
  exercise's word bank).
- **UserSkillProgress** is the join table that makes the skill tree
  per-learner: `status` (locked/available/completed) and `crowns` (0–5,
  mastery depth) live here, not on `Skill` itself.
- **User** carries all gamification state directly: `xp_total`, `xp_today`,
  `streak_count`, `last_activity_date`, `hearts`, `hearts_last_refill_at`,
  `gems`.

## API overview

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/path/{user_id}` | Full course tree merged with this user's skill progress |
| GET | `/api/lessons/{lesson_id}` | Lesson's exercises (answers withheld) |
| POST | `/api/lessons/answer/{user_id}` | Grade one answer server-side; docks a heart if wrong |
| POST | `/api/lessons/{lesson_id}/complete` | Award XP, update streak/crowns, unlock next skill(s) |
| GET | `/api/users/{user_id}` | Profile (also lazily regenerates hearts based on elapsed time) |
| POST | `/api/users/{user_id}/refill-hearts` | Mocked instant refill ("practice" / gem purchase) |
| GET | `/api/users/leaderboard/top` | Top users by total XP |

Full interactive schema at `/docs` once the backend is running.

## Assumptions

- Single default learner, no real auth (per assignment's allowance).
- Each skill in the seed data has exactly one lesson; the schema supports
  many lessons per skill and the frontend picks the next-incomplete one by
  index.
- Heart regeneration is computed lazily (elapsed time since last refill,
  checked whenever `/api/users/{id}` is read) rather than via a background
  cron job, to keep the assignment's scope reasonable.
- Streak logic: same calendar day = no change, exactly one day later = +1,
  more than a day later = resets to 1.

## What's left

- Visual pass to match Duolingo's actual look more closely (current UI uses
  approximate colors/spacing as a starting point, not a pixel match)
- Deployment (Vercel for frontend, Render/Railway for backend)
- Bonus features: achievements/badges, audio, dark mode, responsive polish
- More seeded content (currently 1 course / 3 skills / 4 lessons, enough to
  exercise every mechanic but thin for a real demo)
