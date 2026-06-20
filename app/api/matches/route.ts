/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/services/matchService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
