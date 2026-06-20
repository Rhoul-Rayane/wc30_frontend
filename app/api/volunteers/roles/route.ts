/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getRoles } from '@/lib/services/volunteerService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
