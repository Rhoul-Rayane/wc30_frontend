/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VolunteerSection from "@/components/features/VolunteerSection";

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const [count, setCount] = useState<number>(3200);

  useEffect(() => {
    const savedCount = localStorage.getItem("volunteerCount");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleAddVolunteer = async (data: any) => {
    // Persist to Odoo or local mock fallback
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("[volunteer] Résultat enregistrement Odoo/Mock:", result);
    } catch (error) {
      console.error("[volunteer] Échec envoi API:", error);
    }

    // Sync with local storage
    const score = data.matching_score || 75;
    const currentCount = parseInt(localStorage.getItem("volunteerCount") || "3200", 10);
    const currentAvg = parseFloat(localStorage.getItem("volunteerAverageScore") || "72.3");
    
    const newCount = currentCount + 1;
    const currentSum = currentAvg * currentCount;
    const newSum = currentSum + score;
    const newAvg = parseFloat((newSum / newCount).toFixed(1));

    localStorage.setItem("volunteerCount", newCount.toString());
    localStorage.setItem("volunteerAverageScore", newAvg.toString());
    
    setCount(newCount);
  };

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case "matchs":
        router.push("/matches");
        break;
      case "stades":
        router.push("/stadiums");
        break;
      case "dashboard":
        router.push("/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="pt-16 pb-12">
      <VolunteerSection
        onAddVolunteer={handleAddVolunteer}
        currentCount={count}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
