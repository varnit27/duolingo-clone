"use client";

import Link from "next/link";
import { SOUND_CATEGORIES } from "@/lib/sounds-data";

export default function SoundsPage() {
  return (
    <div className="mt-6 max-w-2xl mx-auto text-center px-4 pb-16">
      <h1 className="font-display text-3xl font-extrabold mb-3">Let's learn English sounds!</h1>
      <p className="text-gray-500 dark:text-duo-nightText mb-8">
        Train your ear and learn to pronounce English sounds
      </p>

      <Link
        href="/coming-soon?f=Sounds%20Practice"
        className="duo-button duo-button-blue inline-block mb-12"
      >
        Start +10 XP
      </Link>

      {SOUND_CATEGORIES.map((category) => (
        <section key={category.title} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-duo-gray dark:bg-duo-nightBorder" />
            <h2 className="font-display font-extrabold text-xl">{category.title}</h2>
            <div className="flex-1 h-px bg-duo-gray dark:bg-duo-nightBorder" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {category.sounds.map((sound) => (
              <SoundCard key={sound.symbol} sound={sound} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SoundCard({ sound }: { sound: { symbol: string; example: string } }) {
  return (
    <Link
      href={`/coming-soon?f=${encodeURIComponent(`"${sound.symbol}" sound`)}`}
      className="duo-card px-4 py-5 hover:border-duo-blue dark:hover:border-duo-blue transition-colors"
    >
      <p className="font-display text-2xl font-extrabold mb-1">{sound.symbol}</p>
      <p className="text-gray-400 dark:text-duo-nightText text-sm mb-3">{sound.example}</p>
      <div className="h-1.5 w-full bg-duo-gray dark:bg-duo-nightBorder rounded-full overflow-hidden">
        <div className="h-full w-0 bg-duo-blue" />
      </div>
    </Link>
  );
}