"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

export default function TopBar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
  }, []);

  if (!profile) return <div className="h-14" />;

  return (
    <div className="flex items-center justify-between w-full py-2 font-extrabold text-lg transition-colors duration-300">
      <Stat 
        emoji="🔥" 
        value={profile.streak_count} 
        color="text-orange-500" 
        hover="hover:bg-orange-50 dark:hover:bg-orange-500/10" 
      />
      <Stat 
        emoji="⭐" 
        value={profile.xp_total} 
        color="text-duo-gold" 
        hover="hover:bg-yellow-50 dark:hover:bg-yellow-500/10" 
      />
      <Stat 
        emoji="💎" 
        value={profile.gems} 
        color="text-duo-blue" 
        hover="hover:bg-blue-50 dark:hover:bg-blue-500/10" 
      />
      <Stat 
        emoji="❤️" 
        value={`${profile.hearts}`} 
        color="text-duo-red" 
        hover="hover:bg-red-50 dark:hover:bg-red-500/10" 
      />
    </div>
  );
}

function Stat({ 
  emoji, 
  value, 
  color, 
  hover 
}: { 
  emoji: string; 
  value: string | number; 
  color: string;
  hover: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all ${color} ${hover}`}>
      <span className="text-xl mb-1">{emoji}</span>
      <span>{value}</span>
    </div>
  );
}