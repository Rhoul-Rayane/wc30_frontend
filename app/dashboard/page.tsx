/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from "react";
import DashboardSection from "@/components/features/DashboardSection";
import CodeViewer from "@/components/features/CodeViewer";

export default function DashboardPage() {
  const [volunteerCount, setVolunteerCount] = useState<number>(3200);
  const [volunteerAvgScore, setVolunteerAvgScore] = useState<number>(72.3);
  const [showCodeSection, setShowCodeSection] = useState<boolean>(false);

  useEffect(() => {
    const savedCount = localStorage.getItem("volunteerCount");
    if (savedCount) {
      setVolunteerCount(parseInt(savedCount, 10));
    }
    const savedScore = localStorage.getItem("volunteerAverageScore");
    if (savedScore) {
      setVolunteerAvgScore(parseFloat(savedScore));
    }
  }, []);

  return (
    <div className="pt-16 pb-12 flex flex-col items-center">
      <DashboardSection
        volunteerCount={volunteerCount}
        volunteerAverageScore={volunteerAvgScore}
      />

      {/* DETACHED COMPILABLE CODE SOURCE DRAWER (Highly elegant for PFE validation MGSI) */}
      <div className="w-full text-center mt-12 mb-3">
        <button
          id="toggle-source-btn"
          onClick={() => setShowCodeSection(!showCodeSection)}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer inline-flex items-center gap-2 select-none"
        >
          {showCodeSection ? "Masquer le Code Vanille" : "💻 Afficher l'intégration Code Source HTML / JS"}
        </button>
      </div>

      {showCodeSection && (
        <div className="w-full max-w-6xl px-4 md:px-8 animate-slide-up">
          <CodeViewer />
        </div>
      )}
    </div>
  );
}
