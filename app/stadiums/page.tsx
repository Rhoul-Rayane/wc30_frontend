/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StadiumsSection from "@/components/features/StadiumsSection";

export default function StadiumsPage() {
  const router = useRouter();

  const handleViewMatches = (stadiumName: string) => {
    router.push(`/matches?stadium=${encodeURIComponent(stadiumName)}`);
  };

  return (
    <div className="pt-16 pb-12">
      <StadiumsSection onViewMatchesInStadium={handleViewMatches} />
    </div>
  );
}
