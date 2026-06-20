/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Données de démonstration centralisées.
 * Utilisées en mode mock (NEXT_PUBLIC_USE_MOCK=true) ou quand Odoo est indisponible.
 * Regroupe toutes les données éparpillées dans les composants.
 */

import {
  Match,
  Stadium,
  TicketCategory,
  DiscountOption,
  DashboardStats,
  OFFICIAL_STADIUMS,
  DEMO_MATCHES,
  TICKET_CATEGORIES,
  DISCOUNT_OPTIONS,
  DASHBOARD_STATS,
  ScanValidationResult,
} from '../types';

// ============================================================
// Re-exports directs des données de types.ts
// ============================================================
export {
  OFFICIAL_STADIUMS as MOCK_STADIUMS,
  DEMO_MATCHES,
  TICKET_CATEGORIES as MOCK_TICKET_CATEGORIES,
  DISCOUNT_OPTIONS as MOCK_DISCOUNT_OPTIONS,
  DASHBOARD_STATS as MOCK_DASHBOARD_STATS,
};

// ============================================================
// Données étendues de matchs (13 matchs, source : MatchesSection.tsx)
// ============================================================

/** Interface étendue pour les matchs avec statut et groupe */
export interface CompMatch extends Match {
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';
  group?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  day: string;
  month: string;
  phaseCategory: 'Groupes' | '8èmes' | 'Quarts' | 'Demis' | 'Finale';
}

export const MOCK_FIXTURES: CompMatch[] = [
  {
    id: 'match-1', homeTeam: 'Maroc', homeFlag: '🇲🇦', awayTeam: 'Portugal', awayFlag: '🇵🇹',
    phase: 'Groupes (Match d\'ouverture)', phaseCategory: 'Groupes', group: 'A',
    stadium: 'Grand Stade Hassan II', city: 'Casablanca',
    day: '14', month: 'Juin', date: '14 Juin 2030', time: '20:00',
    status: 'Terminé', score: '2 - 1', isPopular: true,
  },
  {
    id: 'match-2', homeTeam: 'Brésil', homeFlag: '🇧🇷', awayTeam: 'Allemagne', awayFlag: '🇩🇪',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'B',
    stadium: 'Grand Stade de Rabat', city: 'Rabat',
    day: '15', month: 'Juin', date: '15 Juin 2030', time: '18:00',
    status: 'En cours', score: '1 - 1',
  },
  {
    id: 'match-3', homeTeam: 'France', homeFlag: '🇫🇷', awayTeam: 'Argentine', awayFlag: '🇦🇷',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'C',
    stadium: 'Grand Stade de Tanger', city: 'Tanger',
    day: '16', month: 'Juin', date: '16 Juin 2030', time: '21:00',
    status: 'Planifié', isPopular: true,
  },
  {
    id: 'match-7', homeTeam: 'Portugal', homeFlag: '🇵🇹', awayTeam: 'Uruguay', awayFlag: '🇺🇾',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'D',
    stadium: 'Grand Stade de Fès', city: 'Fès',
    day: '18', month: 'Juin', date: '18 Juin 2030', time: '15:00',
    status: 'Planifié',
  },
  {
    id: 'match-8', homeTeam: 'Angleterre', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'Sénégal', awayFlag: '🇸🇳',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'E',
    stadium: 'Grand Stade de Marrakech', city: 'Marrakech',
    day: '20', month: 'Juin', date: '20 Juin 2030', time: '18:00',
    status: 'Annulé',
  },
  {
    id: 'match-9', homeTeam: 'Belgique', homeFlag: '🇧🇪', awayTeam: 'Croatie', awayFlag: '🇭🇷',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'F',
    stadium: 'Grand Stade d\'Agadir', city: 'Agadir',
    day: '22', month: 'Juin', date: '22 Juin 2030', time: '21:00',
    status: 'Terminé', score: '3 - 2',
  },
  {
    id: 'match-10', homeTeam: 'Argentine', homeFlag: '🇦🇷', awayTeam: 'Canada', awayFlag: '🇨🇦',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'G',
    stadium: 'Grand Stade de Rabat', city: 'Rabat',
    day: '25', month: 'Juin', date: '25 Juin 2030', time: '20:00',
    status: 'Planifié',
  },
  {
    id: 'match-11', homeTeam: 'Espagne', homeFlag: '🇪🇸', awayTeam: 'Cameroun', awayFlag: '🇨🇲',
    phase: 'Phase de groupes', phaseCategory: 'Groupes', group: 'H',
    stadium: 'Grand Stade de Fès', city: 'Fès',
    day: '26', month: 'Juin', date: '26 Juin 2030', time: '17:00',
    status: 'Planifié',
  },
  {
    id: 'match-4', homeTeam: 'Espagne', homeFlag: '🇪🇸', awayTeam: 'Japon', awayFlag: '🇯🇵',
    phase: 'Huitièmes de finale', phaseCategory: '8èmes',
    stadium: 'Grand Stade de Marrakech', city: 'Marrakech',
    day: '01', month: 'Juill.', date: '01 Juillet 2030', time: '20:00',
    status: 'Planifié',
  },
  {
    id: 'match-12', homeTeam: 'Maroc', homeFlag: '🇲🇦', awayTeam: 'Espagne', awayFlag: '🇪🇸',
    phase: 'Quart de finale', phaseCategory: 'Quarts',
    stadium: 'Grand Stade de Tanger', city: 'Tanger',
    day: '05', month: 'Juill.', date: '05 Juillet 2030', time: '18:00',
    status: 'Planifié', isPopular: true,
  },
  {
    id: 'match-5', homeTeam: 'Maroc', homeFlag: '🇲🇦', awayTeam: 'Brésil', awayFlag: '🇧🇷',
    phase: 'Demi-finale', phaseCategory: 'Demis',
    stadium: 'Grand Stade Hassan II', city: 'Casablanca',
    day: '10', month: 'Juill.', date: '10 Juillet 2030', time: '21:00',
    status: 'Planifié', isPopular: true,
  },
  {
    id: 'match-13', homeTeam: 'France', homeFlag: '🇫🇷', awayTeam: 'Italie', awayFlag: '🇮🇹',
    phase: 'Petite Finale (3e place)', phaseCategory: 'Finale',
    stadium: 'Grand Stade d\'Agadir', city: 'Agadir',
    day: '12', month: 'Juill.', date: '12 Juillet 2030', time: '17:00',
    status: 'Planifié',
  },
  {
    id: 'match-6', homeTeam: 'TBD', homeFlag: '🏳️', awayTeam: 'TBD', awayFlag: '🏳️',
    phase: 'Grande Finale', phaseCategory: 'Finale',
    stadium: 'Grand Stade Hassan II', city: 'Casablanca',
    day: '13', month: 'Juill.', date: '13 Juillet 2030', time: '20:00',
    status: 'Planifié', isPopular: true,
  },
];

// ============================================================
// Données tarifaires par stade (source : TarifsSection.tsx)
// ============================================================

export interface StadiumTarif {
  name: string;
  city: string;
  capacity: number;
  sold: number;
  basePrices: [number, number, number, number]; // [Cat-1, Cat-2, Cat-3, Cat-4]
}

export const MOCK_STADIUM_TARIFS: StadiumTarif[] = [
  { name: 'Grand Stade Hassan II', city: 'Casablanca', capacity: 115000, sold: 82300, basePrices: [4500, 2500, 1200, 400] },
  { name: 'Grand Stade de Rabat', city: 'Rabat', capacity: 70000, sold: 51200, basePrices: [3800, 2200, 1000, 350] },
  { name: 'Grand Stade de Tanger', city: 'Tanger', capacity: 68000, sold: 48500, basePrices: [3600, 2000, 950, 320] },
  { name: 'Grand Stade de Marrakech', city: 'Marrakech', capacity: 45000, sold: 29100, basePrices: [3400, 1900, 900, 300] },
  { name: 'Grand Stade de Fès', city: 'Fès', capacity: 50000, sold: 31000, basePrices: [3200, 1800, 850, 280] },
  { name: 'Grand Stade d\'Agadir', city: 'Agadir', capacity: 45000, sold: 22400, basePrices: [3100, 1750, 800, 250] },
];

export interface PhaseTarif {
  id: string;
  label: string;
  multiplier: number;
}

export const MOCK_PHASES_TARIFS: PhaseTarif[] = [
  { id: 'groupes', label: 'Phase de groupes', multiplier: 1.0 },
  { id: '8emes', label: '8èmes', multiplier: 1.2 },
  { id: 'quarts', label: 'Quarts', multiplier: 1.5 },
  { id: 'demis', label: 'Demis', multiplier: 1.9 },
  { id: '3eme', label: '3ème place', multiplier: 1.6 },
  { id: 'finale', label: 'Finale', multiplier: 2.5 },
];

// ============================================================
// Données de compétences et langues volontaires (mock)
// ============================================================

export const MOCK_VOLUNTEER_SKILLS = [
  { id: 1, name: 'Communication', color: 1 },
  { id: 2, name: 'Premiers secours', color: 2 },
  { id: 3, name: 'Gestion de foule', color: 3 },
  { id: 4, name: 'Conduite', color: 4 },
  { id: 5, name: 'Technologie / IT', color: 5 },
  { id: 6, name: 'Traduction', color: 6 },
  { id: 7, name: 'Accueil / Hospitalité', color: 7 },
  { id: 8, name: 'Logistique', color: 8 },
];

export const MOCK_VOLUNTEER_ROLES = [
  { id: 1, name: 'Agent d\'accueil', functional_area: 'accreditation', description: 'Accueil et orientation des visiteurs' },
  { id: 2, name: 'Agent de sécurité', functional_area: 'security', description: 'Contrôle d\'accès et surveillance' },
  { id: 3, name: 'Médiateur presse', functional_area: 'media', description: 'Accompagnement des journalistes' },
  { id: 4, name: 'Agent médical', functional_area: 'medical', description: 'Premiers soins et assistance médicale' },
  { id: 5, name: 'Coordinateur transport', functional_area: 'transport', description: 'Gestion des navettes et transports' },
  { id: 6, name: 'Agent billetterie', functional_area: 'ticketing', description: 'Vente et contrôle des billets' },
];

// ============================================================
// Données de scan simulées
// ============================================================

export function getMockScanResult(token: string): ScanValidationResult {
  // Simuler un refus d'accès pour les tokens contenant ERR, refus ou invalid
  if (token && (token.includes('ERR') || token.includes('refus') || token.includes('invalid'))) {
    return {
      valid: false,
      message: 'Token invalide ou expiré ❌',
    };
  }

  // Simuler une validation réussie si le token contient un pattern reconnaissable
  if (token && token.length > 5) {
    return {
      valid: true,
      message: 'Badge vérifié avec succès ✅',
      holder_name: 'Validation Simulée',
      category: 'volunteer',
      zones: ['Tribune Nord', 'Zone Presse'],
      scan_count: Math.floor(Math.random() * 10) + 1,
    };
  }
  return {
    valid: false,
    message: 'Token invalide ou expiré ❌',
  };
}
