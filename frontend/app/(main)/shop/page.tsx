"use client";

import TopBar from "@/components/TopBar";

export default function ShopPage() {
  return (
    <div className="flex w-full max-w-[1056px] mx-auto gap-[48px] px-6">
      
      {/* LEFT COLUMN: Main Content */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-[580px] pt-6 pb-24 transition-colors duration-300">
        {/* Dark Blue Promo Banner */}
        <div className="bg-[#101F33] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
          <div className="flex-1 z-10 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-white mb-2">Start a family plan!</h2>
            <p className="text-gray-300 font-bold text-sm mb-4 leading-relaxed">
              Save on Super Duolingo when you learn with friends
            </p>
            <button className="bg-white text-[#101F33] hover:bg-gray-100 font-extrabold text-sm uppercase tracking-widest px-6 py-3 rounded-xl transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </div>
          <div className="text-7xl z-10 hidden sm:block">👨‍👩‍👧‍👦</div>
        </div>

        <div className="mt-4 border-b-2 border-duo-gray dark:border-duo-nightBorder pb-4">
          <h3 className="text-2xl font-extrabold text-duo-text dark:text-white">Hearts</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-t-2 border-transparent py-4 flex items-center gap-4 sm:gap-6 border-b-2 border-duo-gray dark:border-duo-nightBorder">
            <div className="text-5xl drop-shadow-sm">❤️</div>
            <div className="flex-1">
              <h4 className="font-extrabold text-duo-text dark:text-white text-lg">Refill Hearts</h4>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-1">
                Get full hearts so you can worry less about making mistakes in a lesson
              </p>
            </div>
            <button disabled className="bg-duo-gray dark:bg-duo-nightBorder text-gray-400 dark:text-gray-500 font-extrabold text-sm uppercase tracking-widest px-4 py-2 rounded-xl cursor-not-allowed">
              Full
            </button>
          </div>

          <div className="border-t-2 border-transparent py-4 flex items-center gap-4 sm:gap-6 border-b-2 border-duo-gray dark:border-duo-nightBorder">
            <div className="text-5xl drop-shadow-sm">♾️</div>
            <div className="flex-1">
              <h4 className="font-extrabold text-duo-text dark:text-white text-lg">Unlimited Hearts</h4>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-1">
                Never run out of hearts with Super!
              </p>
            </div>
            <button className="text-duo-blue hover:bg-blue-50 dark:hover:bg-blue-500/10 font-extrabold text-sm uppercase tracking-widest px-4 py-2 rounded-xl transition-colors">
              Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Stats & Widgets */}
      <div className="hidden lg:flex flex-col w-[368px] pt-6 gap-6">
        <TopBar /> 
        
        {/* Unlock Leaderboards Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-extrabold text-lg text-duo-text dark:text-white mb-1">
            Unlock Leaderboards!
          </h3>
          <div className="flex gap-4 items-center">
            <div className="text-3xl text-gray-400">🛡️</div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quests Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-duo-gray dark:border-duo-nightBorder pb-4">
            <h3 className="font-extrabold text-lg text-duo-text dark:text-white">Daily Quests</h3>
            <span className="text-duo-blue font-bold text-sm uppercase cursor-pointer hover:brightness-110">View All</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-3xl text-yellow-400">⚡</div>
            <div className="flex-1">
              <h4 className="font-extrabold text-duo-text dark:text-white text-sm mb-2">Earn 10 XP</h4>
              <div className="flex items-center gap-3">
                <div className="h-4 flex-1 bg-duo-gray dark:bg-duo-nightBorder rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[0%] rounded-full" />
                </div>
                <span className="text-gray-400 font-bold text-sm">0 / 10</span>
              </div>
            </div>
            <div className="text-xl text-orange-500">🎁</div>
          </div>
        </div>

        {/* Ad Placeholder Widget */}
        <div className="border-2 border-duo-gray dark:border-duo-nightBorder rounded-2xl overflow-hidden flex flex-col relative group">
          <div className="h-[200px] bg-sky-200 dark:bg-sky-900 flex items-center justify-center">
             <span className="font-extrabold text-2xl text-sky-400 dark:text-sky-700">ADVERTISEMENT</span>
          </div>
          <div className="p-4 flex flex-col items-center bg-white dark:bg-duo-nightBg">
            <span className="font-extrabold text-sm text-duo-blue uppercase tracking-widest cursor-pointer hover:brightness-110">
              Remove Ads
            </span>
          </div>
        </div>

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