/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/services/volunteerService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
