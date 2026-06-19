/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MatchesSection from "@/components/features/MatchesSection";
import { Match } from "@/lib/types";

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stadiumFilter = searchParams.get("stadium") || "Tous";

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
    />
  );
}

export default function MatchesPage() {
  return (
    <div className="pt-16 pb-12">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Chargement du calendrier...</div>}>
        <MatchesContent />
      </Suspense>
    </div>
  );
}
