/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createTicket, getUserTickets } from '@/lib/services/ticketService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let holderName = searchParams.get('holderName');

    if (!holderName) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('wc30_session');
      if (sessionCookie && sessionCookie.value) {
        const sessionUser = JSON.parse(sessionCookie.value);
        holderName = sessionUser.name;
      }
    }

    if (!holderName) {
      return NextResponse.json(
        { error: "Le nom du détenteur principal est requis." },
        { status: 400 }
      );
    }

    const tickets = await getUserTickets(holderName);
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error('[API Tickets GET] Erreur lors de la récupération des billets :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, category, holderName, quantity } = body;

    if (!matchId || !category || !holderName || !quantity) {
      return NextResponse.json(
        { error: 'Données de réservation incomplètes ou invalides' },
        { status: 400 }
      );
    }

    console.log('[API Tickets POST] Création de billets dans Odoo :', body);
    const ticketsCreated = await createTicket({
      matchId,
      category,
      holderName,
      quantity: Number(quantity),
    });

    return NextResponse.json(ticketsCreated);
  } catch (error: any) {
    console.error('[API Tickets POST] Erreur lors de l\'achat de billets :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur interne lors de la création du billet' },
      { status: 500 }
    );
  }
}
