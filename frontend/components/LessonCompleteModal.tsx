"use client";

import type { LessonCompleteResult } from "@/lib/types";
import Mascot from "./Mascot";

export default function LessonCompleteModal({
  result,
  onClose,
}: {
  result: LessonCompleteResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-20 p-6">
      <div className="max-w-sm w-full text-center">
        <Mascot size={110} mood="happy" />
        <h2 className="font-display text-3xl font-extrabold mt-4 mb-6">Lesson Complete!</h2>

        <div className="flex justify-center gap-4 mb-8">
          <div className="duo-card px-6 py-4 flex-1">
            <p className="text-duo-gold text-2xl font-display font-extrabold">+{result.xp_earned} XP</p>
            <p className="text-xs text-gray-500 mt-1">Total: {result.xp_total}</p>
          </div>
          <div className="duo-card px-6 py-4 flex-1">
            <p className="text-orange-500 text-2xl font-display font-extrabold">🔥 {result.streak_count}</p>
            <p className="text-xs text-gray-500 mt-1">Day streak</p>
          </div>
        </div>

        {result.newly_unlocked_skill_ids.length > 0 && (
          <p className="text-sm text-duo-green font-display font-bold mb-6">🎉 New skill unlocked!</p>
        )}

        <button onClick={onClose} className="duo-button duo-button-green w-full">
          Continue
        </button>
      </div>
    </div>
  );
}
