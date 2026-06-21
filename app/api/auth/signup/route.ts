import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createPortalUser } from '@/lib/odoo';
import { USE_MOCK } from '@/lib/config';
import { AuthUser } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let userSession: AuthUser | null = null;

    if (USE_MOCK) {
      console.log('[API Signup] Mode MOCK - Inscription simulée');
      userSession = {
        uid: Math.floor(Math.random() * 1000) + 1000,
        email: cleanEmail,
        name,
        role: 'public',
      };
    } else {
      console.log('[API Signup] Inscription réelle Odoo pour', cleanEmail);
      
      // Crée l'utilisateur res.users dans Odoo avec le groupe Portail (ID 10)
      const uid = await createPortalUser(name, cleanEmail, password);

      userSession = {
        uid,
        email: cleanEmail,
        name,
        role: 'public',
      };
    }

    if (userSession) {
      // Définir le cookie de session
      const cookieStore = await cookies();
      cookieStore.set('wc30_session', JSON.stringify(userSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
      });

      return NextResponse.json({ success: true, user: userSession });
    }

    return NextResponse.json(
      { success: false, error: 'Une erreur inconnue est survenue' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('[API Signup] Erreur serveur:', error);
    
    // Default safe user-friendly error message
    let errorMessage = 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.';
    const rawMessage = error?.message || '';

    // Check if the error indicates that the email is already in use
    if (
      (rawMessage.includes('login') && (rawMessage.includes('déjà') || rawMessage.includes('déja') || rawMessage.includes('already'))) ||
      rawMessage.toLowerCase().includes('already exists') ||
      rawMessage.toLowerCase().includes('unique constraint') ||
      rawMessage.toLowerCase().includes('duplicate key')
    ) {
      errorMessage = 'Cet email est déjà enregistré';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
