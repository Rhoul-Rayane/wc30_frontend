import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('wc30_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: true, user: null });
    }

    try {
      const user = JSON.parse(sessionCookie.value);
      return NextResponse.json({ success: true, user });
    } catch {
      // Cookie corrompu ou mal formé, on le supprime
      cookieStore.delete('wc30_session');
      return NextResponse.json({ success: true, user: null });
    }
  } catch (error: any) {
    console.error('[API Session] Erreur serveur:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
