"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UserProfile, LeaderboardEntry } from "@/lib/types";
import Mascot from "@/components/Mascot";
import TopBar from "@/components/TopBar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
    api.getLeaderboard().then(setLeaderboard).catch(console.error);
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  const dailyGoalPct = Math.min(100, Math.round((profile.xp_today / profile.daily_xp_goal) * 100));

  return (
    <div className="mt-6 space-y-8">
      <section className="text-center">
        <Mascot size={90} mood="happy" />
        <h1 className="font-display text-2xl font-extrabold mt-3">{profile.display_name}</h1>
        <p className="text-gray-500">@{profile.username}</p>
      </section>

      <section className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Total XP" value={profile.xp_total} color="text-duo-gold" />
        <Stat label="Streak" value={`🔥 ${profile.streak_count}`} color="text-orange-500" />
        <Stat label="Gems" value={`💎 ${profile.gems}`} color="text-duo-blue" />
      </section>

      <section>
        <h2 className="font-display font-bold mb-2">Daily goal</h2>
        <div className="h-4 bg-duo-gray rounded-full overflow-hidden">
          <div className="h-full bg-duo-gold transition-all" style={{ width: `${dailyGoalPct}%` }} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {profile.xp_today} / {profile.daily_xp_goal} XP today
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold mb-3">Leaderboard</h2>
        <ol className="space-y-2">
          {leaderboard.map((entry) => (
            <li
              key={entry.username}
              className={`flex justify-between px-4 py-3 rounded-2xl border-2 ${
                entry.username === profile.username
                  ? "border-duo-blue bg-blue-50 font-bold"
                  : "border-duo-gray"
              }`}
            >
              <span>
                #{entry.rank} {entry.display_name}
              </span>
              <span className="text-duo-gold font-bold">{entry.xp_total} XP</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="duo-card text-center text-gray-400 text-sm py-6">
        🏅 Achievements — Coming Soon
      </section>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="duo-card py-4">
      <p className={`text-xl font-display font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
