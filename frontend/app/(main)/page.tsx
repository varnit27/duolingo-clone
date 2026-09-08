"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Course, Skill } from "@/lib/types";
import SkillNode from "@/components/SkillNode";
import PathTrack from "@/components/PathTrack";
// import { TopBar } from "@/components/TopBar"; // Uncomment if TopBar is ready
import { shade } from "@/lib/colors";

// Serpentine wiggle pattern, repeating: center, right, center, left...
const OFFSET_PATTERN = [0, 1, 0, -1];

export default function HomePage() {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    api.getPath().then(setCourse).catch(console.error);
  }, []);

  if (!course) return <p className="text-center mt-10 dark:text-white">Loading path...</p>;

  const allSkills: Skill[] = course.units.flatMap((u) => u.skills);
  const currentSkill = allSkills.find((s) => s.status === "available");

  let globalIndex = 0;

  return (
    <div className="flex gap-[48px] w-full max-w-[1056px] mx-auto lg:px-6">
      
      {/* LEFT COLUMN: The Learning Path */}
      <div className="flex-1 max-w-[600px] pt-6 pb-24 px-4 lg:px-0">
        {course.units.map((unit) => {
          const unitOffsets = unit.skills.map(
            () => OFFSET_PATTERN[globalIndex++ % OFFSET_PATTERN.length]
          );
          // reset globalIndex back for the actual render pass below
          globalIndex -= unit.skills.length;

          return (
            <section key={unit.id} className="mb-8">
              {/* AUTHENTIC UNIT HEADER */}
              <div
                className="rounded-xl p-4 lg:p-6 mb-8 flex flex-col lg:flex-row lg:items-center justify-between text-white"
                style={{ 
                  backgroundColor: unit.color, 
                  boxShadow: `0 4px 0 0 ${shade(unit.color)}` 
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold text-sm opacity-90 uppercase tracking-widest">
                    <span>←</span> SECTION {unit.order_index}, UNIT {unit.order_index}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-extrabold max-w-[300px] leading-tight">
                    {unit.title}
                  </h2>
                </div>
                <button className="hidden lg:flex items-center gap-2 text-duo-text bg-white border-2 border-duo-gray shadow-duoButton shadow-duo-gray active:shadow-none active:translate-y-1 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold uppercase tracking-widest transition-all mt-4 lg:mt-0">
                  📖 Guidebook
                </button>
              </div>

              <div className="relative flex flex-col items-center gap-10">
                <PathTrack offsets={unitOffsets} gapY={64} />
                {unit.skills.map((skill) => {
                  const offset = OFFSET_PATTERN[globalIndex % OFFSET_PATTERN.length];
                  globalIndex++;
                  return (
                    <SkillNode
                      key={skill.id}
                      skill={skill}
                      color={unit.color}
                      offsetX={offset}
                      isCurrent={currentSkill?.id === skill.id}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* RIGHT COLUMN: Stats & Widgets */}
      <div className="hidden lg:flex flex-col w-[368px] pt-6 gap-6">
        {/* <TopBar /> */}
        
        {/* Super Duolingo Promo Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder bg-white dark:bg-duo-nightBg rounded-xl p-6">
          <h3 className="font-extrabold text-duo-text dark:text-white text-lg mb-4">Try Super for free</h3>
          <p className="text-gray-500 dark:text-duo-nightText mb-6">
            No ads, personalized practice, and unlimited Legendary!
          </p>
          <button className="w-full bg-[#7B7BFF] hover:bg-[#6b6bee] text-white font-extrabold uppercase tracking-widest py-3 rounded-xl transition-all">
            Try 1 Week Free
          </button>
        </div>

        {/* Leaderboard Locked Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder bg-white dark:bg-duo-nightBg rounded-xl p-6">
          <h3 className="font-extrabold text-duo-text dark:text-white text-lg mb-4">Unlock Leaderboards!</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-duo-nightPanel rounded-full flex items-center justify-center text-2xl">
              🛡️
            </div>
            <p className="text-gray-500 dark:text-duo-nightText flex-1 text-sm">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}