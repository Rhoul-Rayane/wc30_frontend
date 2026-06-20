/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getDashboardKPIs } from '@/lib/services/dashboardService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const kpis = await getDashboardKPIs();
    return NextResponse.json(kpis);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
