/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import StadiumsSectionWrapper from "./StadiumsSectionWrapper";
import { getStadiums } from "@/lib/services/stadiumService";

export default async function StadiumsPage() {
  // Direct Server Side fetch with ISR caching
  const initialStadiums = await getStadiums();

  return (
    <div className="pt-16 pb-12">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Chargement des stades...</div>}>
        <StadiumsSectionWrapper initialStadiums={initialStadiums} />
      </Suspense>
    </div>
  );
}
