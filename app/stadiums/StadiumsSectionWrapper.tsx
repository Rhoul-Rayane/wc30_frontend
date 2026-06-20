/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StadiumsSection from "@/components/features/StadiumsSection";
import { Stadium } from "@/lib/types";

interface StadiumsSectionWrapperProps {
  initialStadiums: Stadium[];
}

export default function StadiumsSectionWrapper({ initialStadiums }: StadiumsSectionWrapperProps) {
  const router = useRouter();

  const handleViewMatches = (stadiumName: string) => {
    router.push(`/matches?stadium=${encodeURIComponent(stadiumName)}`);
  };

  return (
    <StadiumsSection 
      onViewMatchesInStadium={handleViewMatches}
      initialStadiums={initialStadiums}
    />
  );
}
