"use client";

import TopBar from "@/components/TopBar";

export default function QuestsPage() {
  return (
    <div className="flex w-full max-w-[1056px] mx-auto gap-[48px] px-6">
      
      {/* LEFT COLUMN: Main Content */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-[580px] pt-6 pb-24 transition-colors duration-300">
        {/* Purple Promo Banner */}
        <div className="bg-[#CE82FF] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white mb-2">Welcome!</h2>
            <p className="text-white font-bold text-sm leading-relaxed max-w-[250px]">
              Complete quests to earn rewards! Quests refresh every day.
            </p>
          </div>
          <div className="text-7xl">🦉</div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mt-4 border-b-2 border-duo-gray dark:border-duo-nightBorder pb-4">
          <h3 className="text-2xl font-extrabold text-duo-text dark:text-white">Daily Quests</h3>
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
            🕒 14 HOURS
          </span>
        </div>

        {/* Quest Cards */}
        <div className="flex flex-col gap-4">
          <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-duo-nightPanel transition-colors">
            <div className="text-4xl text-yellow-400 drop-shadow-md">⚡</div>
            <div className="flex-1">
              <h4 className="font-extrabold text-duo-text dark:text-white text-lg mb-2">Earn 10 XP</h4>
              <div className="flex items-center gap-3">
                <div className="h-4 flex-1 bg-duo-gray dark:bg-duo-nightBorder rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[0%] rounded-full" />
                </div>
                <span className="text-gray-400 font-bold text-sm">0 / 10</span>
              </div>
            </div>
            <div className="text-3xl grayscale opacity-50">🎁</div>
          </div>

          <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl p-4 sm:p-6 flex items-center gap-4 opacity-60">
            <div className="text-3xl text-gray-400">🔒</div>
            <h4 className="font-extrabold text-gray-400 text-lg flex-1">More quests unlock soon</h4>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Stats & Widgets */}
      <div className="hidden lg:flex flex-col w-[368px] pt-6 gap-6">
        <TopBar /> 
        
        {/* Monthly Challenge Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-lg text-duo-text dark:text-white max-w-[200px]">
              Monthly challenges unlock soon!
            </h3>
            <div className="text-4xl drop-shadow-md">🪙</div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
            Complete each month's challenge to earn exclusive badges
          </p>
          <button className="w-full mt-2 py-3 rounded-xl border-2 border-b-4 border-duo-gray dark:border-duo-nightBorder font-extrabold uppercase tracking-widest text-duo-text dark:text-white hover:bg-gray-50 dark:hover:bg-duo-nightPanel active:translate-y-[2px] active:border-b-2 transition-all">
            Start a Lesson
          </button>
        </div>

        {/* Footer Links */}
        <FooterLinks />
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 mt-4 text-[13px] font-bold text-gray-400 uppercase tracking-wide">
      <a href="#" className="hover:text-gray-300">About</a>
      <a href="#" className="hover:text-gray-300">Blog</a>
      <a href="#" className="hover:text-gray-300">Store</a>
      <a href="#" className="hover:text-gray-300">Efficacy</a>
      <a href="#" className="hover:text-gray-300">Careers</a>
      <a href="#" className="hover:text-gray-300">Investors</a>
      <a href="#" className="hover:text-gray-300">Terms</a>
      <a href="#" className="hover:text-gray-300">Privacy</a>
    </div>
  );
}