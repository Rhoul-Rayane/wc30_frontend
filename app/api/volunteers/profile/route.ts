/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getVolunteerByEmail, updateVolunteer } from '@/lib/services/volunteerService';

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

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email');

    if (!email) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('wc30_session');
      if (sessionCookie && sessionCookie.value) {
        const user = JSON.parse(sessionCookie.value);
        email = user.email;
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await updateVolunteer(email, body);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.message || 'Échec de la mise à jour du profil' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[API Volunteer Profile PUT] Erreur profile update :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
