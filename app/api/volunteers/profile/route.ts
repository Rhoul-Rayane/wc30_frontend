/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { getVolunteerByEmail } from '@/lib/services/volunteerService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    const volunteer = await getVolunteerByEmail(email);

    if (!volunteer) {
      return NextResponse.json(
        { error: "Aucun volontaire trouvé avec cette adresse email" },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer);
  } catch (error: any) {
    console.error('[API Volunteer Profile] Erreur profile lookup :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
