/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStadiums, getStadiumById } from '@/lib/services/stadiumService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const stadium = await getStadiumById(id);
      if (!stadium) {
        return NextResponse.json({ error: 'Stade non trouvé' }, { status: 404 });
      }
      return NextResponse.json(stadium);
    }

    const stadiums = await getStadiums();
    return NextResponse.json(stadiums);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
