import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authenticateUser, callOdoo } from '@/lib/odoo';
import { getVolunteerByEmail } from '@/lib/services/volunteerService';
import { USE_MOCK } from '@/lib/config';
import { AuthUser } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Veuillez saisir votre email et votre mot de passe' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let userSession: AuthUser | null = null;

    if (USE_MOCK) {
      console.log('[API Login] Mode MOCK - Authentification simulée');
      // Mock logins
      if (cleanEmail === 'admin_wc@worldcup.com' && password === 'worldcup') {
        userSession = {
          uid: 9,
          email: 'admin_wc@worldcup.com',
          name: 'Youssef Rhoul (Admin)',
          role: 'admin',
        };
      } else if (cleanEmail === 'volunteer@worldcup.com' && password === 'worldcup') {
        userSession = {
          uid: 7,
          email: 'volunteer@worldcup.com',
          name: 'Ahmed El Fadili (Volontaire)',
          role: 'volunteer',
        };
      } else if (cleanEmail === 'rayane@leapter.com') {
        userSession = {
          uid: 1,
          email: 'rayane@leapter.com',
          name: 'Rayane Rhouli',
          role: 'volunteer',
        };
      } else if (cleanEmail.endsWith('@test.com') || password === 'test') {
        userSession = {
          uid: 100,
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          role: 'public',
        };
      } else {
        return NextResponse.json(
          { success: false, error: 'Identifiants incorrects (mode Mock)' },
          { status: 401 }
        );
      }
    } else {
      // Authentification réelle Odoo
      console.log('[API Login] Authentification réelle Odoo pour', cleanEmail);
      const uid = await authenticateUser(cleanEmail, password);

      if (!uid) {
        return NextResponse.json(
          { success: false, error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      // Lecture des détails de l'utilisateur avec la session API admin
      const users = await callOdoo<any[]>('res.users', 'read', [[uid]], {
        fields: ['name', 'login', 'share', 'group_ids']
      });

      if (!users || users.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la lecture des détails de l\'utilisateur Odoo' },
          { status: 500 }
        );
      }

      const odooUser = users[0];
      const name = odooUser.name;
      const groupIds = odooUser.group_ids || [];

      let isOdooAdmin = false;
      let isOdooVolunteer = false;

      // Détermination du rôle en fonction des groupes de sécurité réels
      if (groupIds.length > 0) {
        try {
          const groups = await callOdoo<any[]>('res.groups', 'read', [groupIds], {
            fields: ['name']
          });
          isOdooAdmin = groups.some(g => 
            g.name === 'Role / Administrator' || 
            g.name === 'Administrateur' || 
            g.name.includes('Admin')
          );
          isOdooVolunteer = groups.some(g => 
            g.name === 'Volontaire / Stadier (Scanner)' || 
            g.name.includes('Volontaire')
          );
        } catch (groupErr) {
          console.error('[API Login] Erreur lors de la lecture des groupes Odoo :', groupErr);
        }
      }

      let role: 'admin' | 'volunteer' | 'public' = 'public';

      // 1. Vérifier si l'utilisateur possède un profil de volontaire (wc.volunteer)
      const volunteer = await getVolunteerByEmail(cleanEmail);

      if (volunteer || isOdooVolunteer) {
        role = 'volunteer';
      } else if (isOdooAdmin) {
        role = 'admin';
      } else {
        role = 'public';
      }

      userSession = {
        uid,
        email: cleanEmail,
        name,
        role,
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
    console.error('[API Login] Erreur serveur:', error);
    
    // Default safe user-friendly message
    const errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
