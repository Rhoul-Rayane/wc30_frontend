/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import MatchesSectionWrapper from "./MatchesSectionWrapper";
import { getMatches } from "@/lib/services/matchService";

interface PageProps {
  searchParams: Promise<{ stadium?: string }>;
}

export default async function MatchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stadiumFilter = params.stadium || "Tous";
  
  // Appel direct du service Odoo côté serveur (avec cache ISR 60s configurable)
  const initialMatches = await getMatches();

  return (
    <div className="pt-16 pb-12">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Chargement du calendrier...</div>}>
        <MatchesSectionWrapper 
          initialMatches={initialMatches} 
          stadiumFilter={stadiumFilter} 
        />
      </Suspense>
    </div>
  );
}
