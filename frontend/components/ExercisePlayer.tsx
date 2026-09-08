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
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 pb-24">
      <h2 className="font-display text-2xl md:text-3xl font-extrabold text-duo-text dark:text-white transition-colors duration-300">
        {exercise.prompt}
      </h2>

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

// ----------------------------------------------------------------------
// Reusable Check Button
// ----------------------------------------------------------------------
function CheckButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t-2 border-duo-gray dark:border-duo-nightBorder bg-white dark:bg-duo-nightBg p-4 sm:p-6 flex justify-center z-50 transition-colors duration-300">
      <div className="w-full max-w-5xl flex justify-end">
        <button
          disabled={disabled}
          onClick={onClick}
          className={`w-full sm:w-[150px] py-3 rounded-xl font-extrabold uppercase tracking-widest transition-all select-none
            ${disabled 
              ? "bg-[#E5E5E5] dark:bg-duo-nightBorder text-[#AFAFAF] dark:text-gray-500 cursor-not-allowed" 
              : "bg-duo-green text-white border-b-4 border-duo-greenDark hover:brightness-110 active:border-b-0 active:translate-y-1"}`}
        >
          Check
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Multiple Choice
// ----------------------------------------------------------------------
function MultipleChoice({ exercise, disabled, onSubmit }: { exercise: Exercise; disabled: boolean; onSubmit: (a: Answer) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exercise.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              disabled={disabled}
              className={`rounded-2xl border-2 border-b-4 px-4 py-6 text-center font-bold text-lg transition-all select-none active:border-b-2 active:translate-y-[2px]
                ${isSelected 
                  ? "border-duo-blue bg-blue-50 text-duo-blue dark:bg-duo-blue/10" 
                  : "border-duo-gray hover:bg-gray-50 dark:border-duo-nightBorder dark:hover:bg-duo-nightPanel bg-white dark:bg-duo-nightBg text-duo-text dark:text-white"}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      <CheckButton disabled={selected === null || disabled} onClick={() => selected !== null && onSubmit({ option_id: selected })} />
    </div>
  );
}

// ----------------------------------------------------------------------
// Type Answer / Fill Blank
// ----------------------------------------------------------------------
function TypeAnswer({ disabled, onSubmit }: { disabled: boolean; onSubmit: (a: Answer) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <input
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer"
        className="w-full bg-gray-50 dark:bg-duo-nightPanel border-2 border-duo-gray dark:border-duo-nightBorder text-duo-text dark:text-white rounded-2xl px-4 py-4 text-lg font-bold focus:border-duo-blue dark:focus:border-duo-blue outline-none transition-colors duration-300 placeholder-gray-400"
      />
      <CheckButton disabled={!text.trim() || disabled} onClick={() => onSubmit({ answer_text: text })} />
    </div>
  );
}

// ----------------------------------------------------------------------
// Translate (Word Bank)
// ----------------------------------------------------------------------
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
    <div className="flex flex-col gap-8">
      {/* Picked Words Area */}
      <div className="min-h-[4rem] border-b-2 border-duo-gray dark:border-duo-nightBorder pb-2 flex flex-wrap gap-2 items-end">
        {picked.map((w, i) => (
          <button 
            key={i} 
            onClick={() => unpick(i)} 
            className="bg-white dark:bg-duo-nightBg border-2 border-b-4 border-duo-gray dark:border-duo-nightBorder text-duo-text dark:text-white rounded-xl px-4 py-2 font-bold text-lg active:border-b-2 active:translate-y-[2px] transition-all select-none"
          >
            {w}
          </button>
        ))}
      </div>
      
      {/* Available Word Bank */}
      <div className="flex flex-wrap gap-3 justify-center">
        {bank.map((w) => {
          const isPicked = picked.includes(w);
          return (
            <button
              key={w}
              onClick={() => pick(w)}
              disabled={disabled || isPicked}
              className={`rounded-xl px-4 py-2 font-bold text-lg transition-all select-none
                ${isPicked 
                  ? "bg-[#E5E5E5] text-[#E5E5E5] dark:bg-duo-nightBorder dark:text-duo-nightBorder border-none cursor-default" 
                  : "bg-white dark:bg-duo-nightBg border-2 border-b-4 border-duo-gray dark:border-duo-nightBorder hover:bg-gray-50 dark:hover:bg-duo-nightPanel text-duo-text dark:text-white active:border-b-2 active:translate-y-[2px]"}`}
            >
              {w}
            </button>
          );
        })}
      </div>
      <CheckButton disabled={picked.length === 0 || disabled} onClick={() => onSubmit({ answer_text: picked.join(" ") })} />
    </div>
  );
}

// ----------------------------------------------------------------------
// Match Pairs
// ----------------------------------------------------------------------
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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        {exercise.options.map((opt) => {
          const isMatched = matchedIds.has(opt.id);
          const isSelected = firstPick === opt.id;
          
          return (
            <button
              key={opt.id}
              onClick={() => handleTileClick(opt.id)}
              disabled={disabled || isMatched}
              className={`rounded-2xl border-2 border-b-4 px-4 py-5 font-bold text-lg text-center transition-all select-none active:border-b-2 active:translate-y-[2px]
                ${isMatched 
                  ? "bg-[#E5E5E5] border-[#E5E5E5] text-transparent dark:bg-duo-nightBorder dark:border-duo-nightBorder pointer-events-none" 
                  : isSelected 
                    ? "border-duo-blue bg-blue-50 text-duo-blue dark:bg-duo-blue/10 dark:border-duo-blue" 
                    : "border-duo-gray hover:bg-gray-50 dark:border-duo-nightBorder dark:hover:bg-duo-nightPanel bg-white dark:bg-duo-nightBg text-duo-text dark:text-white"}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      <CheckButton disabled={matched.length === 0 || disabled} onClick={() => onSubmit({ matched_pairs: matched })} />
    </div>
  );
}