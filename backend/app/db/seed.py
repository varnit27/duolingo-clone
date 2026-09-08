"""
Seeds a small Spanish course + a sample learner with some progress.
Run with: python -m app.db.seed
"""
import json

from app.db.database import Base, engine, SessionLocal
from app.models import models as m


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(m.Course).first():
        print("Already seeded — skipping. Delete app.db to reseed from scratch.")
        db.close()
        return

    course = m.Course(name="Spanish", slug="es", flag_emoji="🇪🇸")
    db.add(course)
    db.flush()

    unit1 = m.Unit(course_id=course.id, title="Basics", order_index=1, color="#58CC02")
    unit2 = m.Unit(course_id=course.id, title="Phrases", order_index=2, color="#1CB0F6")
    db.add_all([unit1, unit2])
    db.flush()

    skill1 = m.Skill(unit_id=unit1.id, title="Greetings", icon="wave", order_index=1)
    skill2 = m.Skill(unit_id=unit1.id, title="Animals", icon="paw", order_index=2)
    skill3 = m.Skill(unit_id=unit2.id, title="Food", icon="utensils", order_index=1)
    db.add_all([skill1, skill2, skill3])
    db.flush()

    def add_lesson(skill, xp=10):
        lesson = m.Lesson(skill_id=skill.id, order_index=1, xp_reward=xp)
        db.add(lesson)
        db.flush()
        return lesson

    # --- Skill 1: Greetings — one lesson, all five exercise types ---
    l1 = add_lesson(skill1)

    e1 = m.Exercise(lesson_id=l1.id, order_index=1, type=m.ExerciseType.multiple_choice,
                     prompt="How do you say 'hello' in Spanish?")
    db.add(e1); db.flush()
    db.add_all([
        m.ExerciseOption(exercise_id=e1.id, text="Hola", is_correct=True, order_index=1),
        m.ExerciseOption(exercise_id=e1.id, text="Adiós", is_correct=False, order_index=2),
        m.ExerciseOption(exercise_id=e1.id, text="Gracias", is_correct=False, order_index=3),
        m.ExerciseOption(exercise_id=e1.id, text="Sí", is_correct=False, order_index=4),
    ])

    e2 = m.Exercise(lesson_id=l1.id, order_index=2, type=m.ExerciseType.translate,
                     prompt="Translate: 'Good morning'", correct_answer="buenos dias",
                     data_json=json.dumps({"word_bank": ["buenos", "dias", "noches", "tardes", "hola"]}))
    db.add(e2)

    e3 = m.Exercise(lesson_id=l1.id, order_index=3, type=m.ExerciseType.match_pairs,
                     prompt="Match the Spanish word to its English meaning")
    db.add(e3); db.flush()
    db.add_all([
        m.ExerciseOption(exercise_id=e3.id, text="Hola", pair_key="p1", order_index=1),
        m.ExerciseOption(exercise_id=e3.id, text="Hello", pair_key="p1", order_index=2),
        m.ExerciseOption(exercise_id=e3.id, text="Gracias", pair_key="p2", order_index=3),
        m.ExerciseOption(exercise_id=e3.id, text="Thanks", pair_key="p2", order_index=4),
        m.ExerciseOption(exercise_id=e3.id, text="Adiós", pair_key="p3", order_index=5),
        m.ExerciseOption(exercise_id=e3.id, text="Goodbye", pair_key="p3", order_index=6),
    ])

    e4 = m.Exercise(lesson_id=l1.id, order_index=4, type=m.ExerciseType.fill_blank,
                     prompt="Complete: 'Buenas ___' (Good afternoon)", correct_answer="tardes")
    db.add(e4)

    e5 = m.Exercise(lesson_id=l1.id, order_index=5, type=m.ExerciseType.type_answer,
                     prompt="Type 'thank you' in Spanish", correct_answer="gracias")
    db.add(e5)

    # --- Skill 2: Animals — one short lesson ---
    l2 = add_lesson(skill2)
    e6 = m.Exercise(lesson_id=l2.id, order_index=1, type=m.ExerciseType.multiple_choice,
                     prompt="Which word means 'dog'?")
    db.add(e6); db.flush()
    db.add_all([
        m.ExerciseOption(exercise_id=e6.id, text="Perro", is_correct=True, order_index=1),
        m.ExerciseOption(exercise_id=e6.id, text="Gato", is_correct=False, order_index=2),
        m.ExerciseOption(exercise_id=e6.id, text="Pájaro", is_correct=False, order_index=3),
    ])
    e7 = m.Exercise(lesson_id=l2.id, order_index=2, type=m.ExerciseType.type_answer,
                     prompt="Type the Spanish word for 'cat'", correct_answer="gato")
    db.add(e7)

    # --- Skill 3: Food (unit 2) — one short lesson ---
    l3 = add_lesson(skill3)
    e8 = m.Exercise(lesson_id=l3.id, order_index=1, type=m.ExerciseType.multiple_choice,
                     prompt="Which word means 'bread'?")
    db.add(e8); db.flush()
    db.add_all([
        m.ExerciseOption(exercise_id=e8.id, text="Pan", is_correct=True, order_index=1),
        m.ExerciseOption(exercise_id=e8.id, text="Agua", is_correct=False, order_index=2),
        m.ExerciseOption(exercise_id=e8.id, text="Leche", is_correct=False, order_index=3),
    ])

    # --- Additional units, generated from a compact data table below.
    # Each new skill gets one lesson with a multiple_choice + type_answer
    # exercise — enough to be fully playable, kept terse since it's mostly
    # vocab content rather than new mechanics (those are already covered,
    # with every exercise type, by skill1/skill2/skill3 above).
    # No UserSkillProgress rows are created for these — the path router
    # already treats "no progress row" as locked, which is what we want
    # here since they all sit behind the still-locked Food skill.
    def add_simple_skill(unit, title, icon, order_index, mc_prompt, mc_correct, mc_wrong, type_prompt, type_answer):
        skill = m.Skill(unit_id=unit.id, title=title, icon=icon, order_index=order_index)
        db.add(skill)
        db.flush()
        lesson = add_lesson(skill)

        mc = m.Exercise(lesson_id=lesson.id, order_index=1, type=m.ExerciseType.multiple_choice, prompt=mc_prompt)
        db.add(mc)
        db.flush()
        db.add(m.ExerciseOption(exercise_id=mc.id, text=mc_correct, is_correct=True, order_index=1))
        for i, wrong in enumerate(mc_wrong, start=2):
            db.add(m.ExerciseOption(exercise_id=mc.id, text=wrong, is_correct=False, order_index=i))

        db.add(m.Exercise(lesson_id=lesson.id, order_index=2, type=m.ExerciseType.type_answer,
                           prompt=type_prompt, correct_answer=type_answer))
        return skill

    EXTRA_UNITS = [
        ("Travel", "#FF9600", [
            ("Airport", "plane", "Which word means 'airport'?", "Aeropuerto", ["Estación", "Hotel"],
             "Type the Spanish word for 'ticket'", "boleto"),
            ("Directions", "map", "Which word means 'left'?", "Izquierda", ["Derecha", "Arriba"],
             "Type the Spanish word for 'right'", "derecha"),
        ]),
        ("Family", "#CE82FF", [
            ("Relatives", "family", "Which word means 'mother'?", "Madre", ["Padre", "Hermano"],
             "Type the Spanish word for 'brother'", "hermano"),
            ("Numbers", "numbers", "Which word means 'three'?", "Tres", ["Dos", "Cinco"],
             "Type the Spanish word for 'five'", "cinco"),
        ]),
        ("Time", "#2B70C9", [
            ("Days", "calendar", "Which word means 'Monday'?", "Lunes", ["Martes", "Viernes"],
             "Type the Spanish word for 'today'", "hoy"),
            ("Clock", "clock", "Which word means 'hour'?", "Hora", ["Minuto", "Día"],
             "Type the Spanish word for 'now'", "ahora"),
        ]),
        ("Shopping", "#FF86D0", [
            ("Clothes", "shirt", "Which word means 'shirt'?", "Camisa", ["Zapato", "Sombrero"],
             "Type the Spanish word for 'shoes'", "zapatos"),
            ("Money", "money", "Which word means 'money'?", "Dinero", ["Tiempo", "Trabajo"],
             "Type the Spanish word for 'price'", "precio"),
        ]),
        ("Nature", "#4B4B4B", [
            ("Weather", "cloud", "Which word means 'rain'?", "Lluvia", ["Sol", "Nieve"],
             "Type the Spanish word for 'sun'", "sol"),
            ("Colors", "star", "Which word means 'red'?", "Rojo", ["Azul", "Verde"],
             "Type the Spanish word for 'blue'", "azul"),
        ]),
    ]

    next_unit_order = unit2.order_index + 1
    for unit_title, unit_color, skills_data in EXTRA_UNITS:
        unit = m.Unit(course_id=course.id, title=unit_title, order_index=next_unit_order, color=unit_color)
        db.add(unit)
        db.flush()
        for i, (title, icon, mc_prompt, mc_correct, mc_wrong, type_prompt, type_answer) in enumerate(skills_data, start=1):
            add_simple_skill(unit, title, icon, i, mc_prompt, mc_correct, mc_wrong, type_prompt, type_answer)
        next_unit_order += 1

    # --- Sample learner with a bit of existing progress ---
    user = m.User(
        username="demo",
        display_name="Demo Learner",
        xp_total=40,
        streak_count=3,
        hearts=5,
        max_hearts=5,
        gems=500,
    )
    db.add(user)
    db.flush()

    db.add(m.UserSkillProgress(user_id=user.id, skill_id=skill1.id, status=m.SkillStatus.completed, crowns=1, lessons_completed=1))
    db.add(m.UserSkillProgress(user_id=user.id, skill_id=skill2.id, status=m.SkillStatus.available, crowns=0, lessons_completed=0))
    db.add(m.UserSkillProgress(user_id=user.id, skill_id=skill3.id, status=m.SkillStatus.locked, crowns=0, lessons_completed=0))

    # a couple more users for the leaderboard
    db.add(m.User(username="ana", display_name="Ana", xp_total=120, streak_count=7))
    db.add(m.User(username="miguel", display_name="Miguel", xp_total=85, streak_count=2))

    db.commit()
    db.close()
    print("Seeded course, 13 skills across 7 units, and 3 users (demo/ana/miguel).")


if __name__ == "__main__":
    run()