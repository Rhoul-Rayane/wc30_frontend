/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdoo } from '../odoo';
import { OdooVolunteer, OdooVolunteerSkill, OdooVolunteerRole } from '../types';
import { MOCK_VOLUNTEER_SKILLS, MOCK_VOLUNTEER_ROLES } from '../mock';

export interface CreateVolunteerData {
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'Homme' | 'Femme';
  nationality?: string;
  id_number?: string;
  address?: string;
  skills: string[];
  languages: string[];
  has_driving_license?: boolean;
  has_vehicle?: boolean;
  has_first_aid?: boolean;
  education_level?: string;
  experience?: string;
  availability?: string;
  preferred_stadium_id?: string;
  matching_score?: number;
}

// Table de correspondance pour aligner les compétences du frontend Next.js avec la base de données d'Odoo
const SKILL_MAP: Record<string, string> = {
  "premiers secours": "Assistance médicale",
  "communication": "Média / Communication",
  "logistique": "Logistique",
  "conduite": "Transport / Conduite",
  "accueil": "Accueil / Orientation",
  "sécurité": "Sécurité",
  "securite": "Sécurité",
  "traduction": "Traduction / Interprétation",
  "informatique": "Support technique / IT",
  "restauration": "Restauration / Catering",
  "événementiel": "Protocole / VIP",
  "evenementiel": "Protocole / VIP"
};

export async function createVolunteer(data: CreateVolunteerData): Promise<{ success: boolean; id?: number; message?: string }> {
  if (USE_MOCK) {
    console.log('[volunteerService] Mode MOCK - Enregistrement local simulé.', data);
    return { success: true, message: 'Simulé avec succès ! (Mode Mock)' };
  }

  try {
    console.log('[volunteerService] Création du volontaire dans Odoo...', data.name);

    // Mappage Genre : 'Homme' -> 'male', 'Femme' -> 'female'
    const odooGender = data.gender === 'Homme' ? 'male' : (data.gender === 'Femme' ? 'female' : false);

    // Mappage Niveau d'études
    let odooEdu: 'bac' | 'bac2' | 'bac3' | 'bac5' | 'phd' | false = false;
    if (data.education_level) {
      if (data.education_level.includes('Bac+5') || data.education_level.includes('Master')) odooEdu = 'bac5';
      else if (data.education_level.includes('Bac+3') || data.education_level.includes('Licence')) odooEdu = 'bac3';
      else if (data.education_level.includes('Bac+2') || data.education_level.includes('BTS') || data.education_level.includes('DUT')) odooEdu = 'bac2';
      else if (data.education_level.includes('Doctorat') || data.education_level.includes('phd')) odooEdu = 'phd';
      else odooEdu = 'bac';
    }

    // Mappage Disponibilité
    let odooAvail: 'full' | 'morning' | 'evening' | 'weekend' = 'full';
    if (data.availability) {
      if (data.availability.includes('Matin')) odooAvail = 'morning';
      else if (data.availability.includes('Soir')) odooAvail = 'evening';
      else if (data.availability.includes('Week-end') || data.availability.includes('Weekend')) odooAvail = 'weekend';
      else if (data.availability.includes('Plein') || data.availability.includes('plein') || data.availability === 'Temps plein') odooAvail = 'full';
    }

    // Mappage ID Stade par recherche de nom partiel ou exact
    let odooStadiumId: number | false = false;
    if (data.preferred_stadium_id && data.preferred_stadium_id !== 'Pas de préférence') {
      const prefName = data.preferred_stadium_id.toLowerCase();
      let searchName = '';

      if (prefName.includes('casablanca') || prefName.includes('hassan ii')) {
        searchName = 'Grand Stade Hassan II';
      } else if (prefName.includes('rabat') || prefName.includes('moulay abdellah')) {
        searchName = 'Stade Prince Moulay Abdellah';
      } else if (prefName.includes('tanger')) {
        searchName = 'Grand Stade de Tanger';
      } else if (prefName.includes('marrakech')) {
        searchName = 'Grand Stade de Marrakech';
      } else if (prefName.includes('fès') || prefName.includes('fes')) {
        searchName = 'Stade de Fès';
      } else if (prefName.includes('agadir')) {
        searchName = 'Grand Stade d\'Agadir';
      }

      if (searchName) {
        try {
          const odooStadiums = await callOdoo<{ id: number; name: string }[]>('wc.stadium', 'search_read', [
            [['name', '=', searchName]]
          ], { fields: ['id', 'name'] });
          if (odooStadiums && odooStadiums.length > 0) {
            odooStadiumId = odooStadiums[0].id;
          }
        } catch (err) {
          console.error('[volunteerService] Erreur recherche stade dans Odoo :', err);
        }
      }
    }

    // Récupérer et mapper les IDs des compétences Odoo (Many2many)
    let skillIds: number[] = [];
    if (data.skills && data.skills.length > 0) {
      try {
        const allSkills = await callOdoo<{ id: number; name: string }[]>('wc.volunteer.skill', 'search_read', [], {
          fields: ['id', 'name']
        });
        
        // Traduire le nom de la compétence du frontend vers l'équivalent attendu par Odoo
        const mappedSkillNames = data.skills.map(s => {
          const clean = s.trim().toLowerCase();
          return SKILL_MAP[clean] || s;
        });

        skillIds = mappedSkillNames
          .map(sName => allSkills.find(s => s.name.trim().toLowerCase() === sName.trim().toLowerCase())?.id)
          .filter((id): id is number => id !== undefined);
      } catch (err) {
        console.error('[volunteerService] Erreur mappage compétences Odoo :', err);
      }
    }

    // Récupérer et mapper les IDs des langues Odoo (Many2many)
    let languageIds: number[] = [];
    if (data.languages && data.languages.length > 0) {
      try {
        const allLanguages = await callOdoo<{ id: number; name: string }[]>('wc.volunteer.language', 'search_read', [], {
          fields: ['id', 'name']
        });
        languageIds = data.languages
          .map(lName => allLanguages.find(l => l.name.trim().toLowerCase() === lName.trim().toLowerCase())?.id)
          .filter((id): id is number => id !== undefined);
      } catch (err) {
        console.error('[volunteerService] Erreur mappage langues Odoo :', err);
      }
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || false,
      date_of_birth: data.date_of_birth || false,
      gender: odooGender,
      nationality: data.nationality || false,
      id_number: data.id_number || false,
      address: data.address || false,
      has_driving_license: !!data.has_driving_license,
      has_vehicle: !!data.has_vehicle,
      has_first_aid: !!data.has_first_aid,
      education_level: odooEdu,
      experience: data.experience || false,
      availability: odooAvail,
      preferred_stadium_id: odooStadiumId,
      skill_ids: [[6, 0, skillIds]],
      language_ids: [[6, 0, languageIds]],
      state: 'candidate',
    };

    const newId = await callOdoo<number>('wc.volunteer', 'create', [payload]);
    console.log('[volunteerService] Volontaire créé avec ID Odoo :', newId);
    return { success: true, id: newId };
  } catch (error: any) {
    console.error('[volunteerService] Erreur création volontaire Odoo. Fallback local.', error);
    return { success: true, message: `Sauvegardé localement en raison d'une erreur Odoo: ${error?.message || error}` };
  }
}

// Base de données Mock pour les volontaires de démonstration (PFE)
export const MOCK_VOLUNTEERS: OdooVolunteer[] = [
  {
    id: 1,
    name: 'Rayane Rhouli',
    email: 'rayane@leapter.com',
    phone: '+212 600-112233',
    date_of_birth: '2004-05-15',
    gender: 'male',
    nationality: 'Marocain',
    id_number: 'BK123456',
    skill_ids: [[1, 'Communication'], [6, 'Traduction']],
    language_ids: [[1, 'Arabe'], [2, 'Français'], [3, 'Anglais']],
    has_driving_license: true,
    has_vehicle: false,
    has_first_aid: true,
    education_level: 'bac5',
    experience: 'Développeur et coordinateur événementiel',
    availability: 'full',
    preferred_stadium_id: [1, 'Grand Stade Hassan II'],
    state: 'active',
    matching_score: 94,
    points: 150,
    application_date: '2026-05-01'
  },
  {
    id: 2,
    name: 'Sofia Alaoui',
    email: 'sofia@worldcup.ma',
    phone: '+212 611-445566',
    date_of_birth: '2005-08-20',
    gender: 'female',
    nationality: 'Marocain',
    id_number: 'AB987654',
    skill_ids: [[2, 'Premiers secours'], [7, 'Accueil / Hospitalité']],
    language_ids: [[1, 'Arabe'], [2, 'Français'], [4, 'Espagnol']],
    has_driving_license: false,
    has_vehicle: false,
    has_first_aid: true,
    education_level: 'bac3',
    experience: 'Étudiante en médecine, bénévole secouriste',
    availability: 'weekend',
    preferred_stadium_id: [2, 'Grand Stade de Rabat'],
    state: 'assigned',
    matching_score: 87,
    points: 80,
    application_date: '2026-05-10'
  },
  {
    id: 3,
    name: 'John Miller',
    email: 'john@fifa.org',
    phone: '+41 44 211 4000',
    date_of_birth: '1998-11-02',
    gender: 'male',
    nationality: 'Suisse',
    id_number: 'CH8812903',
    skill_ids: [[3, 'Gestion de foule'], [8, 'Logistique']],
    language_ids: [[3, 'Anglais'], [2, 'Français'], [5, 'Allemand']],
    has_driving_license: true,
    has_vehicle: true,
    has_first_aid: false,
    education_level: 'bac2',
    experience: 'Logistique sportive internationale',
    availability: 'full',
    preferred_stadium_id: [3, 'Grand Stade de Tanger'],
    state: 'trained',
    matching_score: 78,
    points: 40,
    application_date: '2026-05-12'
  }
];

// Limites d'occupation simulées par stade pour la règle du "Premier arrivé, premier servi"
// Si enrolled >= limit, le volontaire est réaffecté au stade de repli
const MOCK_STADIUM_CAPACITIES = {
  1: { name: 'Grand Stade Hassan II', enrolled: 100, limit: 100, fallbackId: 2, fallbackName: 'Grand Stade de Rabat' }, // Casablanca Complet
  2: { name: 'Grand Stade de Rabat', enrolled: 45, limit: 80, fallbackId: 3, fallbackName: 'Grand Stade de Tanger' },   // Disponible
  3: { name: 'Grand Stade de Tanger', enrolled: 30, limit: 70, fallbackId: 2, fallbackName: 'Grand Stade de Rabat' }   // Disponible
};

export async function getVolunteerByEmail(email: string): Promise<OdooVolunteer | null> {
  const cleanEmail = email.trim().toLowerCase();

  if (USE_MOCK) {
    console.log('[volunteerService] Mode MOCK - Recherche par email :', cleanEmail);
    const volunteer = MOCK_VOLUNTEERS.find(v => v.email.toLowerCase() === cleanEmail);
    if (!volunteer) return null;

    // Appliquer la logique d'affectation dynamique de secours ("Premier arrivé, premier servi")
    const prefStadium = volunteer.preferred_stadium_id;
    if (prefStadium && Array.isArray(prefStadium)) {
      const stadiumId = prefStadium[0] as keyof typeof MOCK_STADIUM_CAPACITIES;
      const capInfo = MOCK_STADIUM_CAPACITIES[stadiumId];

      if (capInfo && capInfo.enrolled >= capInfo.limit) {
        console.warn(`[volunteerService] Stade ${capInfo.name} complet (${capInfo.enrolled}/${capInfo.limit}). Réaffectation du volontaire.`);
        // Réaffecter le volontaire au stade de secours
        return {
          ...volunteer,
          preferred_stadium_id: [capInfo.fallbackId, capInfo.fallbackName],
          experience: `${volunteer.experience} (Note PFE : Réaffecté de Casablanca à Rabat car quotas atteints)`
        };
      }
    }
    return volunteer;
  }

  try {
    console.log('[volunteerService] Recherche dans Odoo du volontaire :', cleanEmail);
    const results = await callOdoo<OdooVolunteer[]>('wc.volunteer', 'search_read', [[['email', '=', cleanEmail]]], {
      fields: [
        'id',
        'name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'nationality',
        'id_number',
        'skill_ids',
        'language_ids',
        'has_driving_license',
        'has_vehicle',
        'has_first_aid',
        'education_level',
        'experience',
        'availability',
        'preferred_stadium_id',
        'state',
        'matching_score',
        'points',
        'application_date'
      ]
    });

    if (results && results.length > 0) {
      const volunteer = results[0];
      // Règle du "Premier arrivé, premier servi" sur le serveur Odoo :
      // Odoo applique son algorithme d'IA et renvoie directement la valeur affectée (preferred_stadium_id)
      return volunteer;
    }
    return null;
  } catch (error) {
    console.error('[volunteerService] Erreur lors de la recherche du volontaire dans Odoo. Fallback mock.', error);
    // Fallback de secours en mock si Odoo est indisponible
    const volunteer = MOCK_VOLUNTEERS.find(v => v.email.toLowerCase() === cleanEmail);
    return volunteer || null;
  }
}


export async function getSkills(): Promise<OdooVolunteerSkill[]> {
  if (USE_MOCK) {
    return MOCK_VOLUNTEER_SKILLS;
  }

  try {
    console.log('[volunteerService] Récupération des skills depuis Odoo...');
    return await callOdoo<OdooVolunteerSkill[]>('wc.volunteer.skill', 'search_read', [], {
      fields: ['id', 'name', 'color']
    });
  } catch (error) {
    console.error('[volunteerService] Erreur getSkills Odoo. Fallback.', error);
    return MOCK_VOLUNTEER_SKILLS;
  }
}

export async function getRoles(): Promise<OdooVolunteerRole[]> {
  if (USE_MOCK) {
    return MOCK_VOLUNTEER_ROLES;
  }

  try {
    console.log('[volunteerService] Récupération des rôles depuis Odoo...');
    return await callOdoo<OdooVolunteerRole[]>('wc.volunteer.role', 'search_read', [], {
      fields: ['id', 'name', 'functional_area', 'description']
    });
  } catch (error) {
    console.error('[volunteerService] Erreur getRoles Odoo. Fallback.', error);
    return MOCK_VOLUNTEER_ROLES;
  }
}
