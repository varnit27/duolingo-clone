"use client";

import Mascot from "./Mascot";

export default function OutOfHeartsModal({
  onRefill,
  onQuit,
}: {
  onRefill: () => void;
  onQuit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-20 p-6">
      <div className="max-w-sm w-full text-center">
        <Mascot size={110} mood="sad" />
        <h2 className="font-display text-2xl font-extrabold mt-4 mb-2">Out of hearts!</h2>
        <p className="text-gray-500 mb-8">
          Practice to refill your hearts, or wait for them to regenerate over time.
        </p>
        <button onClick={onRefill} className="duo-button duo-button-blue w-full mb-3">
          Refill hearts
        </button>
        <button onClick={onQuit} className="text-duo-grayDark font-display font-bold uppercase text-sm">
          Quit lesson
        </button>
      </div>
    </div>
  );
}
