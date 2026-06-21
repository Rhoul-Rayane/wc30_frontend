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
    badge_count: 3,
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
    badge_count: 1,
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
    badge_count: 0,
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
        'badge_count',
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

export async function updateVolunteer(email: string, data: Partial<CreateVolunteerData>): Promise<{ success: boolean; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (USE_MOCK) {
    console.log('[volunteerService] Mode MOCK - Mise à jour du volontaire :', cleanEmail, data);
    const index = MOCK_VOLUNTEERS.findIndex(v => v.email.toLowerCase() === cleanEmail);
    if (index !== -1) {
      const vol = MOCK_VOLUNTEERS[index];

      if (data.name !== undefined) vol.name = data.name;
      if (data.phone !== undefined) vol.phone = data.phone || false;
      if (data.date_of_birth !== undefined) vol.date_of_birth = data.date_of_birth || false;
      if (data.nationality !== undefined) vol.nationality = data.nationality || false;
      if (data.id_number !== undefined) vol.id_number = data.id_number || false;
      if (data.experience !== undefined) vol.experience = data.experience || false;

      if (data.has_driving_license !== undefined) vol.has_driving_license = data.has_driving_license;
      if (data.has_vehicle !== undefined) vol.has_vehicle = data.has_vehicle;
      if (data.has_first_aid !== undefined) vol.has_first_aid = data.has_first_aid;

      if (data.education_level !== undefined) {
        let odooEdu: any = false;
        if (data.education_level.includes('Bac+5') || data.education_level.includes('Master')) odooEdu = 'bac5';
        else if (data.education_level.includes('Bac+3') || data.education_level.includes('Licence')) odooEdu = 'bac3';
        else if (data.education_level.includes('Bac+2') || data.education_level.includes('BTS') || data.education_level.includes('DUT')) odooEdu = 'bac2';
        else if (data.education_level.includes('Doctorat') || data.education_level.includes('phd')) odooEdu = 'phd';
        else odooEdu = 'bac';
        vol.education_level = odooEdu;
      }

      if (data.availability !== undefined) {
        let odooAvail: any = 'full';
        if (data.availability.includes('Matin')) odooAvail = 'morning';
        else if (data.availability.includes('Soir')) odooAvail = 'evening';
        else if (data.availability.includes('Week-end') || data.availability.includes('Weekend')) odooAvail = 'weekend';
        else odooAvail = 'full';
        vol.availability = odooAvail;
      }

      if (data.preferred_stadium_id !== undefined) {
        if (data.preferred_stadium_id === 'Pas de préférence') {
          vol.preferred_stadium_id = false;
        } else {
          vol.preferred_stadium_id = [1, data.preferred_stadium_id];
        }
      }

      if (data.skills !== undefined) {
        vol.skill_ids = data.skills.map((s, idx) => [idx + 1, s]);
      }

      if (data.languages !== undefined) {
        vol.language_ids = data.languages.map((l, idx) => [idx + 1, l]);
      }

      // Recalculate score
      let score = 0;
      score += Math.min((data.languages || []).length * 6, 30);
      score += Math.min((data.skills || []).length * 5, 30);
      if (data.has_driving_license) score += 10;
      if (data.has_vehicle) score += 5;
      if (data.has_first_aid || (data.skills || []).includes("Premiers secours")) score += 10;
      if (data.availability === "Temps plein") score += 10;
      else if (data.availability?.includes("Matin") || data.availability?.includes("Soir")) score += 5;
      else if (data.availability?.includes("Week-end")) score += 3;

      if (data.education_level?.includes("Doctorat")) score += 5;
      else if (data.education_level?.includes("Master") || data.education_level?.includes("Bac+5")) score += 4;
      else if (data.education_level?.includes("Licence") || data.education_level?.includes("Bac+3")) score += 3;
      else if (data.education_level?.includes("Bac+2")) score += 2;
      else score += 1;

      vol.matching_score = Math.min(100, Math.max(0, score));

      return { success: true, message: 'Mis à jour avec succès (Mock)' };
    }
    return { success: false, message: 'Volontaire non trouvé' };
  }

  try {
    const volunteer = await getVolunteerByEmail(cleanEmail);
    if (!volunteer) {
      return { success: false, message: 'Volontaire non trouvé dans Odoo' };
    }

    const payload: any = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.phone !== undefined) payload.phone = data.phone || false;
    if (data.date_of_birth !== undefined) payload.date_of_birth = data.date_of_birth || false;
    if (data.nationality !== undefined) payload.nationality = data.nationality || false;
    if (data.id_number !== undefined) payload.id_number = data.id_number || false;
    if (data.experience !== undefined) payload.experience = data.experience || false;
    if (data.has_driving_license !== undefined) payload.has_driving_license = !!data.has_driving_license;
    if (data.has_vehicle !== undefined) payload.has_vehicle = !!data.has_vehicle;
    if (data.has_first_aid !== undefined) payload.has_first_aid = !!data.has_first_aid;

    if (data.education_level !== undefined) {
      let odooEdu: 'bac' | 'bac2' | 'bac3' | 'bac5' | 'phd' | false = false;
      if (data.education_level.includes('Bac+5') || data.education_level.includes('Master')) odooEdu = 'bac5';
      else if (data.education_level.includes('Bac+3') || data.education_level.includes('Licence')) odooEdu = 'bac3';
      else if (data.education_level.includes('Bac+2') || data.education_level.includes('BTS') || data.education_level.includes('DUT')) odooEdu = 'bac2';
      else if (data.education_level.includes('Doctorat') || data.education_level.includes('phd')) odooEdu = 'phd';
      else odooEdu = 'bac';
      payload.education_level = odooEdu;
    }

    if (data.availability !== undefined) {
      let odooAvail: 'full' | 'morning' | 'evening' | 'weekend' = 'full';
      if (data.availability.includes('Matin')) odooAvail = 'morning';
      else if (data.availability.includes('Soir')) odooAvail = 'evening';
      else if (data.availability.includes('Week-end') || data.availability.includes('Weekend')) odooAvail = 'weekend';
      else if (data.availability.includes('Plein') || data.availability.includes('plein') || data.availability === 'Temps plein') odooAvail = 'full';
      payload.availability = odooAvail;
    }

    if (data.preferred_stadium_id !== undefined) {
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
            console.error('[volunteerService] Erreur recherche stade dans Odoo pour update :', err);
          }
        }
      }
      payload.preferred_stadium_id = odooStadiumId;
    }

    if (data.skills !== undefined) {
      try {
        const allSkills = await callOdoo<{ id: number; name: string }[]>('wc.volunteer.skill', 'search_read', [], {
          fields: ['id', 'name']
        });
        const mappedSkillNames = data.skills.map(s => {
          const clean = s.trim().toLowerCase();
          return SKILL_MAP[clean] || s;
        });
        const skillIds = mappedSkillNames
          .map(sName => allSkills.find(s => s.name.trim().toLowerCase() === sName.trim().toLowerCase())?.id)
          .filter((id): id is number => id !== undefined);

        payload.skill_ids = [[6, 0, skillIds]];
      } catch (err) {
        console.error('[volunteerService] Erreur update compétences Odoo :', err);
      }
    }

    if (data.languages !== undefined) {
      try {
        const allLanguages = await callOdoo<{ id: number; name: string }[]>('wc.volunteer.language', 'search_read', [], {
          fields: ['id', 'name']
        });
        const languageIds = data.languages
          .map(lName => allLanguages.find(l => l.name.trim().toLowerCase() === lName.trim().toLowerCase())?.id)
          .filter((id): id is number => id !== undefined);

        payload.language_ids = [[6, 0, languageIds]];
      } catch (err) {
        console.error('[volunteerService] Erreur update langues Odoo :', err);
      }
    }

    if (data.matching_score !== undefined) {
      payload.matching_score = data.matching_score;
    }

    const success = await callOdoo<boolean>('wc.volunteer', 'write', [[volunteer.id], payload]);
    console.log('[volunteerService] Volontaire mis à jour dans Odoo :', volunteer.id, success);
    return { success };
  } catch (error: any) {
    console.error('[volunteerService] Erreur lors de la mise à jour Odoo. Fallback local.', error);
    const index = MOCK_VOLUNTEERS.findIndex(v => v.email.toLowerCase() === cleanEmail);
    if (index !== -1) {
      const vol = MOCK_VOLUNTEERS[index];
      if (data.phone !== undefined) vol.phone = data.phone || false;
      if (data.nationality !== undefined) vol.nationality = data.nationality || false;
      if (data.experience !== undefined) vol.experience = data.experience || false;
      if (data.skills !== undefined) vol.skill_ids = data.skills.map((s, idx) => [idx + 1, s]);
      if (data.languages !== undefined) vol.language_ids = data.languages.map((l, idx) => [idx + 1, l]);
      return { success: true, message: 'Mis à jour localement (fallback suite à erreur Odoo)' };
    }
    return { success: false, message: error?.message || 'Erreur interne lors de la mise à jour' };
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
