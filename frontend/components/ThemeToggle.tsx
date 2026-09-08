"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[46px]" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-bold text-sm uppercase tracking-wide text-gray-500 dark:text-duo-nightText hover:bg-gray-50 dark:hover:bg-white/5 w-full"
    >
      <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}