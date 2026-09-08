export default function Mascot({ size = 96, mood = "happy" }: { size?: number; mood?: "happy" | "sad" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* body */}
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="#58CC02" />
      {/* belly */}
      <ellipse cx="50" cy="66" rx="20" ry="16" fill="#7FE010" />
      {/* ear tufts */}
      <circle cx="26" cy="30" r="9" fill="#58CC02" />
      <circle cx="74" cy="30" r="9" fill="#58CC02" />
      {/* eyes */}
      {mood === "happy" ? (
        <>
          <circle cx="38" cy="52" r="7" fill="white" />
          <circle cx="62" cy="52" r="7" fill="white" />
          <circle cx="39" cy="53" r="3.2" fill="#3C3C3C" />
          <circle cx="63" cy="53" r="3.2" fill="#3C3C3C" />
        </>
      ) : (
        <>
          <path d="M32 48 L44 54" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" />
          <path d="M68 48 L56 54" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* beak/mouth */}
      {mood === "happy" ? (
        <path d="M42 64 Q50 72 58 64" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M42 68 Q50 62 58 68" stroke="#3C3C3C" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}
