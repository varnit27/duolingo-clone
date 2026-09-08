"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, DEFAULT_USER_ID } from "@/lib/api";
import type { Lesson, Exercise } from "@/lib/types";
import ExercisePlayer from "@/components/ExercisePlayer";
import FeedbackBar from "@/components/FeedbackBar";
import LessonCompleteModal from "@/components/LessonCompleteModal";
import OutOfHeartsModal from "@/components/OutOfHeartsModal";

export default function LessonPage({ params }: { params: { id: string } }) {
  const lessonId = Number(params.id);
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [correctAnswerText, setCorrectAnswerText] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number | null>(null);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [completeResult, setCompleteResult] = useState<
    Awaited<ReturnType<typeof api.completeLesson>> | null
  >(null);

  useEffect(() => {
    api.getLesson(lessonId).then(setLesson).catch(console.error);
    api.getProfile().then((p) => setHearts(p.hearts)).catch(console.error);
  }, [lessonId]);

  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  const currentLesson = lesson;
  const currentExercise: Exercise = currentLesson.exercises[index];
  const progressPct = Math.round(((index + (feedback === "correct" ? 1 : 0)) / currentLesson.exercises.length) * 100);

  async function handleSubmit(answer: {
    option_id?: number;
    answer_text?: string;
    matched_pairs?: number[][];
  }) {
    const result = await api.submitAnswer(DEFAULT_USER_ID, {
      exercise_id: currentExercise.id,
      ...answer,
    });
    setHearts(result.hearts_remaining);
    setFeedback(result.correct ? "correct" : "incorrect");
    setCorrectAnswerText(result.correct_answer);

    if (result.lesson_failed) {
      setTimeout(() => setOutOfHearts(true), 900);
    }
  }

  async function handleContinue() {
    setFeedback(null);
    setCorrectAnswerText(null);

    if (index + 1 < currentLesson.exercises.length) {
      setIndex(index + 1);
    } else {
      const result = await api.completeLesson(currentLesson.id, DEFAULT_USER_ID);
      setCompleteResult(result);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-4 px-4 md:px-8 py-4">
        <button
          onClick={() => router.push("/")}
          className="text-duo-grayDark hover:text-gray-500 text-2xl font-bold leading-none"
          aria-label="Exit lesson"
        >
          ✕
        </button>
        <div className="flex-1 h-4 bg-duo-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-duo-green transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-duo-red font-display font-extrabold flex items-center gap-1 min-w-[3rem]">
          ❤️ {hearts ?? "-"}
        </span>
      </div>

      <div className="flex-1 max-w-xl w-full mx-auto px-4 pt-8 pb-32">
        <ExercisePlayer
          key={currentExercise.id}
          exercise={currentExercise}
          disabled={feedback !== null}
          onSubmit={handleSubmit}
        />
      </div>

      {feedback && (
        <FeedbackBar
          correct={feedback === "correct"}
          correctAnswer={correctAnswerText}
          onContinue={handleContinue}
        />
      )}

      {completeResult && (
        <LessonCompleteModal
          result={completeResult}
          onClose={() => router.push("/")}
        />
      )}

      {outOfHearts && (
        <OutOfHeartsModal
          onRefill={async () => {
            await api.refillHearts(DEFAULT_USER_ID);
            setOutOfHearts(false);
            setHearts(5);
          }}
          onQuit={() => router.push("/")}
        />
      )}
    </div>
  );
}
