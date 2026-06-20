/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MatchesSection from "@/components/features/MatchesSection";
import { Match } from "@/lib/types";

interface MatchesSectionWrapperProps {
  initialMatches: Match[];
  stadiumFilter: string;
}

export default function MatchesSectionWrapper({ initialMatches, stadiumFilter }: MatchesSectionWrapperProps) {
  const router = useRouter();

  const handleBookMatch = (match: Match) => {
    router.push(`/tickets?tab=billets&matchId=${match.id}`);
  };

  const handleResetStadiumFilter = () => {
    router.replace("/matches");
  };

  return (
    <MatchesSection
      onBookMatch={handleBookMatch}
      initialStadiumFilter={stadiumFilter}
      onResetStadiumFilter={handleResetStadiumFilter}
      initialMatches={initialMatches}
    />
  );
}
