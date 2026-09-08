"use client";

import { useSearchParams } from "next/navigation";
import Mascot from "@/components/Mascot";
import { Suspense } from "react";

function ComingSoonContent() {
  const params = useSearchParams();
  const feature = params.get("f") || "This feature";

  return (
    <div className="mt-20 text-center">
      <Mascot size={100} mood="happy" />
      <h1 className="font-display text-2xl font-extrabold mt-4">{feature} — Coming Soon</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">We're still building this part.</p>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    // The Suspense boundary fixes the Next.js build error!
    <Suspense fallback={<div className="mt-20 text-center font-bold dark:text-gray-400">Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}