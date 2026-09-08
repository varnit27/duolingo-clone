"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/types";

type Answer = { option_id?: number; answer_text?: string; matched_pairs?: number[][] };

export default function ExercisePlayer({
  exercise,
  disabled,
  onSubmit,
}: {
  exercise: Exercise;
  disabled: boolean;
  onSubmit: (answer: Answer) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold mb-8">{exercise.prompt}</h2>

      {exercise.type === "multiple_choice" && (
        <MultipleChoice exercise={exercise} disabled={disabled} onSubmit={onSubmit} />
      )}
      {(exercise.type === "type_answer" || exercise.type === "fill_blank") && (
        <TypeAnswer disabled={disabled} onSubmit={onSubmit} />
      )}
      {exercise.type === "translate" && (
        <WordBank exercise={exercise} disabled={disabled} onSubmit={onSubmit} />
      )}
      {exercise.type === "match_pairs" && (
        <MatchPairs exercise={exercise} disabled={disabled} onSubmit={onSubmit} />
      )}
    </div>
  );
}

function MultipleChoice({ exercise, disabled, onSubmit }: { exercise: Exercise; disabled: boolean; onSubmit: (a: Answer) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {exercise.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            disabled={disabled}
            className={`rounded-2xl border-2 border-b-4 px-4 py-4 text-left font-bold transition-colors active:border-b-2 active:translate-y-[2px]
              ${selected === opt.id ? "border-duo-blue bg-blue-50" : "border-duo-gray hover:bg-gray-50"}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <button
        disabled={selected === null || disabled}
        onClick={() => selected !== null && onSubmit({ option_id: selected })}
        className="duo-button duo-button-green disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check
      </button>
    </div>
  );
}

function TypeAnswer({ disabled, onSubmit }: { disabled: boolean; onSubmit: (a: Answer) => void }) {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer"
        className="w-full border-2 border-duo-gray rounded-2xl px-4 py-3 mb-6 focus:border-duo-blue outline-none"
      />
      <button
        disabled={!text.trim() || disabled}
        onClick={() => onSubmit({ answer_text: text })}
        className="duo-button duo-button-green disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check
      </button>
    </div>
  );
}

function WordBank({ exercise, disabled, onSubmit }: { exercise: Exercise; disabled: boolean; onSubmit: (a: Answer) => void }) {
  const bank: string[] = exercise.data?.word_bank || [];
  const [picked, setPicked] = useState<string[]>([]);

  function pick(word: string) {
    if (disabled) return;
    setPicked([...picked, word]);
  }
  function unpick(idx: number) {
    if (disabled) return;
    setPicked(picked.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="min-h-[3rem] border-b-2 border-duo-gray mb-6 flex flex-wrap gap-2">
        {picked.map((w, i) => (
          <button key={i} onClick={() => unpick(i)} className="bg-duo-gray rounded-xl px-3 py-1 font-semibold">
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {bank
          .filter((w) => !picked.includes(w))
          .map((w) => (
            <button
              key={w}
              onClick={() => pick(w)}
              disabled={disabled}
              className="border-2 border-duo-gray rounded-xl px-3 py-1 font-semibold hover:border-duo-blue"
            >
              {w}
            </button>
          ))}
      </div>
      <button
        disabled={picked.length === 0 || disabled}
        onClick={() => onSubmit({ answer_text: picked.join(" ") })}
        className="duo-button duo-button-green disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check
      </button>
    </div>
  );
}

function MatchPairs({ exercise, disabled, onSubmit }: { exercise: Exercise; disabled: boolean; onSubmit: (a: Answer) => void }) {
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[][]>([]);
  const matchedIds = new Set(matched.flat());

  function handleTileClick(id: number) {
    if (disabled || matchedIds.has(id)) return;
    if (firstPick === null) {
      setFirstPick(id);
      return;
    }
    if (firstPick === id) {
      setFirstPick(null);
      return;
    }
    setMatched([...matched, [firstPick, id]]);
    setFirstPick(null);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {exercise.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleTileClick(opt.id)}
            disabled={disabled || matchedIds.has(opt.id)}
            className={`rounded-2xl border-2 px-4 py-4 font-semibold
              ${matchedIds.has(opt.id) ? "opacity-30 border-duo-gray" : firstPick === opt.id ? "border-duo-blue bg-blue-50" : "border-duo-gray hover:border-duo-blue"}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <button
        disabled={matched.length === 0 || disabled}
        onClick={() => onSubmit({ matched_pairs: matched })}
        className="duo-button duo-button-green disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check
      </button>
    </div>
  );
}
