"use client";

import { useRouter } from "next/navigation";
import type { Skill } from "@/lib/types";

import { useRouter } from "next/navigation";
import type { Skill } from "@/lib/types";
import { shade } from "@/lib/colors";

const ICONS: Record<string, string> = {
  wave: "👋",
  paw: "🐾",
  utensils: "🍽️",
  star: "⭐",
  plane: "✈️",
  map: "🗺️",
  family: "👪",
  numbers: "🔢",
  calendar: "📅",
  clock: "⏰",
  shirt: "👕",
  money: "💰",
  cloud: "☁️",
};

export default function SkillNode({
  skill,
  color,
  offsetX,
  isCurrent,
}: {
  skill: Skill;
  color: string;
  offsetX: number;
  isCurrent: boolean;
}) {
  const router = useRouter();
  const locked = skill.status === "locked";
  const completed = skill.status === "completed";
  const progressFrac = skill.max_crowns > 0 ? skill.crowns / skill.max_crowns : 0;

  function handleClick() {
    if (locked || skill.lesson_ids.length === 0) return;
    const idx = Math.min(skill.lessons_completed, skill.lesson_ids.length - 1);
    router.push(`/lesson/${skill.lesson_ids[idx]}`);
  }

  const size = 84;
  const ringColor = locked ? "transparent" : color;

  return (
    <div
      className="flex flex-col items-center"
      style={{ transform: `translateX(${offsetX * 70}px)` }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Progress Ring */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90 z-0">
          <circle 
            cx={size / 2} cy={size / 2} r={size / 2 - 5} fill="none" 
            className="stroke-[#E5E5E5] dark:stroke-duo-nightBorder transition-colors duration-300" 
            strokeWidth="8" 
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 5}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (size / 2 - 5)}
            strokeDashoffset={2 * Math.PI * (size / 2 - 5) * (1 - progressFrac)}
            className="transition-all duration-500"
          />
        </svg>

        {/* 3D Skill Button */}
        <button
          onClick={handleClick}
          disabled={locked}
          className={`absolute inset-2 rounded-full flex items-center justify-center text-3xl font-bold border-b-[6px] transition-transform z-10
            ${locked ? "bg-duo-gray dark:bg-duo-nightPanel border-[#cecece] dark:border-duo-nightBorder cursor-not-allowed" : "hover:scale-105 active:translate-y-1 active:border-b-0"}`}
          style={!locked ? { backgroundColor: color, borderColor: shade(color) } : undefined}
        >
          {locked ? "🔒" : completed ? "👑" : ICONS[skill.icon] || "★"}
        </button>

        {/* Authentic Bouncy START Tooltip */}
        {isCurrent && !locked && !completed && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-duo-nightPanel border-2 border-duo-gray dark:border-duo-nightBorder rounded-xl px-4 py-2 text-xs font-display font-bold shadow-md whitespace-nowrap text-duo-green animate-bounce z-20 transition-colors duration-300">
            START
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white dark:bg-duo-nightPanel border-r-2 border-b-2 border-duo-gray dark:border-duo-nightBorder rotate-45 transition-colors duration-300" />
          </div>
        )}
      </div>
      <p className="font-display font-bold text-xs mt-2 text-center max-w-[80px] text-duo-text dark:text-duo-nightText transition-colors duration-300">
        {skill.title}
      </p>
    </div>
  );
}

function shade(hex: string) {
  const map: Record<string, string> = {
    "#58CC02": "#58A700",
    "#1CB0F6": "#1899D6",
    "#CE82FF": "#A568CC",
    "#FF9600": "#E08600",
  };
  return map[hex] || hex;
}