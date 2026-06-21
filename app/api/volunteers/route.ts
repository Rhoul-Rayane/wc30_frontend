/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createVolunteer } from '@/lib/services/volunteerService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createVolunteer(body);

    // Si l'enregistrement a réussi, mettre à jour le cookie de session locale
    if (result.success) {
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('wc30_session');
        if (sessionCookie && sessionCookie.value) {
          const user = JSON.parse(sessionCookie.value);
          if (user.role === 'public') {
            user.role = 'volunteer';
            cookieStore.set('wc30_session', JSON.stringify(user), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7 jours
              path: '/',
            });
            console.log('[API Volunteers] Cookie de session mis à jour avec le rôle volontaire.');
          }
        }
      } catch (cookieErr) {
        console.error('[API Volunteers] Échec de la mise à jour du cookie de session :', cookieErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
