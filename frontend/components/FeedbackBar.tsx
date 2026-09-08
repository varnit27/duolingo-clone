"use client";

export default function FeedbackBar({
  correct,
  correctAnswer,
  onContinue,
}: {
  correct: boolean;
  correctAnswer: string | null;
  onContinue: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t-2 py-5 px-4 md:px-8"
      style={{
        backgroundColor: correct ? "#D7FFB8" : "#FFDFE0",
        borderColor: correct ? "#58CC02" : "#FF4B4B",
      }}
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: correct ? "#58CC02" : "#FF4B4B" }}
          >
            {correct ? "✓" : "✕"}
          </span>
          <div>
            <p
              className="font-display font-extrabold text-lg"
              style={{ color: correct ? "#58A700" : "#EA2B2B" }}
            >
              {correct ? "Nicely done!" : "Not quite right"}
            </p>
            {!correct && correctAnswer && (
              <p className="text-sm text-gray-600">
                Correct answer: <span className="font-bold">{correctAnswer}</span>
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onContinue}
          className={`duo-button shrink-0 ${correct ? "duo-button-green" : "duo-button-red"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
