import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('wc30_session');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Logout] Erreur serveur:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
