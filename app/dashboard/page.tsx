/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import DashboardSectionWrapper from "./DashboardSectionWrapper";
import { getDashboardKPIs } from "@/lib/services/dashboardService";

export default async function DashboardPage() {
  // Call our server-side service directly
  const initialStats = await getDashboardKPIs();

  return (
    <div className="pt-16 pb-12 flex flex-col items-center">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Chargement des statistiques...</div>}>
        <DashboardSectionWrapper initialStats={initialStats} />
      </Suspense>
    </div>
  );
}
