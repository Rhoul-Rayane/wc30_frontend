/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/services/scanService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ valid: false, message: 'Aucun jeton fourni' }, { status: 400 });
    }
    const result = await validateToken(token);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
