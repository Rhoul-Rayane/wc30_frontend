/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TicketsSection from "@/components/features/TicketsSection";
import TarifsSection from "@/components/features/TarifsSection";
import { DEMO_MATCHES, Match } from "@/lib/types";

function TicketsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "billets";
  const matchId = searchParams.get("matchId");

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (matchId) {
      const match = DEMO_MATCHES.find((m) => m.id === matchId);
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [matchId]);

  const handleTicketGenerated = (token: string) => {
    localStorage.setItem("lastGeneratedTicketToken", token);
  };

  const handleNavigateToScanner = () => {
    router.push("/scan");
  };

  const handleNavigateToBooking = () => {
    router.push("/tickets?tab=billets");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 min-h-[900px]">
      {/* Sub-navigation inside /tickets page */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-1 flex gap-2">
          <button
            onClick={() => router.push("/tickets?tab=billets")}
            className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "billets"
                ? "bg-[#34d399] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Achat de Billets 🎫
          </button>
          <button
            onClick={() => router.push("/tickets?tab=tarifs")}
            className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "tarifs"
                ? "bg-[#34d399] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Grilles Tarifaires 💰
          </button>
        </div>
      </div>

      {activeTab === "billets" ? (
        <TicketsSection
          initialSelectedMatch={selectedMatch}
          onTicketGenerated={handleTicketGenerated}
          onNavigateToScanner={handleNavigateToScanner}
        />
      ) : (
        <TarifsSection onNavigateToBooking={handleNavigateToBooking} />
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <div className="pt-16 pb-12">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500 font-display">Chargement de la billetterie...</div>}>
        <TicketsContent />
      </Suspense>
    </div>
  );
}
