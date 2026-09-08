"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Learn", icon: "🏠" },
  { href: "/sounds", label: "Sounds", icon: "👄" },
  { href: "/profile", label: "Leaderboards", icon: "🏆" },
  { href: "/coming-soon?f=Quests", label: "Quests", icon: "🎯" },
  { href: "/coming-soon?f=Shop", label: "Shop", icon: "🛒" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/coming-soon?f=More", label: "More", icon: "⋯" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:flex-col w-64 shrink-0 border-r-2 border-duo-gray dark:border-white/10 h-screen sticky top-0 py-6 px-4 justify-between transition-colors duration-300">
      <div>
        <Link href="/" className="font-display font-extrabold text-duo-green text-2xl mb-10 px-2 block transition-colors duration-300">
          duolingo
        </Link>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = !item.href.includes("coming-soon") && pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-bold text-sm uppercase tracking-wide border-2 transition-all duration-300
                    ${active
                      ? "bg-blue-50 border-blue-200 text-duo-blue dark:bg-duo-blue/10 dark:border-duo-blue/30"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <ThemeToggle />
    </nav>
  );
}