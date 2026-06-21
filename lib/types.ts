/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  highlight: string;
  progress: "Prêt" | "En construction";
  image: string;
  description: string;
  features: string[];
}

export interface Match {
  id: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  phase: string;
  stadium: string;
  city: string;
  date: string;
  time: string;
  score?: string;
  isPopular?: boolean;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  priceMAD: number;
  badge: string;
}

export interface DiscountOption {
  id: string;
  name: string;
  reductionPercent: number;
  description: string;
}

export interface DashboardStats {
  voluntariesCount: number;
  voluntariesGoal: number;
  stadiumsCount: number;
  stadiumsReady: number;
  matchesScheduled: number;
  activeBadges: number;
  estimatedBudgetMAD: number;
  ticketsSold: number;
  ticketsAvailable: number;
  averageMatchingScore: number;
}

// Data Sets
export const OFFICIAL_STADIUMS: Stadium[] = [
  {
    id: "stadium-1",
    name: "Grand Stade Hassan II",
    city: "Casablanca",
    capacity: 115000,
    highlight: "Match d'ouverture & Finale",
    progress: "En construction",
    image: "🏟️",
    description: "Le plus grand stade d'Afrique et l'un des plus monumentaux au monde, doté d'une gigantesque structure en tente inspirée du Moussem traditionnel marocain.",
    features: ["Toiture rétractable", "Acoustique immersive", "Carré d'Or Royal", "Technologie thermo-régulée"]
  },
  {
    id: "stadium-2",
    name: "Grand Stade de Rabat",
    city: "Rabat",
    capacity: 70000,
    highlight: "Phase importante & Quarts",
    progress: "Prêt",
    image: "🏛️",
    description: "Situé au cœur de la capitale administrative, ce stade ultramoderne bénéficie d'une enveloppe bioclimatique et d'une intégration paysagère impériale.",
    features: ["Énergie 100% solaire", "Accès RER dédié", "Piste d'athlétisme rétractable"]
  },
  {
    id: "stadium-3",
    name: "Grand Stade de Tanger",
    city: "Tanger",
    capacity: 68000,
    highlight: "Matchs de Groupes & Quarts",
    progress: "Prêt",
    image: "🌊",
    description: "Surplombant le détroit de Gibraltar, un colosse architectural aux standards FIFA d'élite, offrant des conditions exceptionnelles de diffusion TV.",
    features: ["Zone de presse XXL", "Éclairage LED dynamique", "Héliport VIP"]
  },
  {
    id: "stadium-4",
    name: "Grand Stade de Fès",
    city: "Fès",
    capacity: 50000,
    highlight: "Groupes & Huitièmes de finale",
    progress: "Prêt",
    image: "🏺",
    description: "Mariant la haute technologie avec les motifs architecturaux de la capitale spirituelle, doté d'éléments sculptés inspirés de l'artisanat de Fès.",
    features: ["Musée du football national", "Pavillon traditionnel", "Système de recyclage des eaux"]
  },
  {
    id: "stadium-5",
    name: "Grand Stade de Marrakech",
    city: "Marrakech",
    capacity: 45000,
    highlight: "Groupes & Huitièmes de finale",
    progress: "Prêt",
    image: "🌴",
    description: "Un chef d'œuvre à la silhouette rectangulaire ocre s'intégrant au panorama majestueux de l'Atlas, entièrement modernisé pour 2030.",
    features: ["Éco-conception terre crue", "Éclairage solaire autonome", "Proximité hôtelière 5*"]
  },
  {
    id: "stadium-6",
    name: "Grand Stade d'Agadir",
    city: "Agadir",
    capacity: 45000,
    highlight: "Matchs de Groupes",
    progress: "En construction",
    image: "☀️",
    description: "Idéalement situé face à la baie d'Agadir, ce joyau côtier offre une ambiance balnéaire incroyable et des technologies parasismiques de pointe.",
    features: ["Aération naturelle marine", "Complexe hôtelier intégré", "Parcs d'activité connexes"]
  }
];

export const DEMO_MATCHES: Match[] = [
  {
    id: "match-1",
    homeTeam: "Maroc",
    homeFlag: "🇲🇦",
    awayTeam: "Portugal",
    awayFlag: "🇵🇹",
    phase: "Match d'ouverture",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    date: "14 Juin 2030",
    time: "20:00",
    isPopular: true
  },
  {
    id: "match-2",
    homeTeam: "Brésil",
    homeFlag: "🇧🇷",
    awayTeam: "Allemagne",
    awayFlag: "🇩🇪",
    phase: "Phase de groupes",
    stadium: "Grand Stade de Rabat",
    city: "Rabat",
    date: "15 Juin 2030",
    time: "18:00"
  },
  {
    id: "match-3",
    homeTeam: "France",
    homeFlag: "🇫🇷",
    awayTeam: "Argentine",
    awayFlag: "🇦🇷",
    phase: "Phase de groupes",
    stadium: "Grand Stade de Tanger",
    city: "Tanger",
    date: "16 Juin 2030",
    time: "21:00",
    isPopular: true
  },
  {
    id: "match-4",
    homeTeam: "Espagne",
    homeFlag: "🇪🇸",
    awayTeam: "Japon",
    awayFlag: "🇯🇵",
    phase: "Huitièmes de finale",
    stadium: "Grand Stade de Marrakech",
    city: "Marrakech",
    date: "1 Juillet 2030",
    time: "20:00"
  },
  {
    id: "match-5",
    homeTeam: "Maroc",
    homeFlag: "🇲🇦",
    awayTeam: "Brésil",
    awayFlag: "🇧🇷",
    phase: "Demi-finale",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    date: "10 Juillet 2030",
    time: "21:00",
    isPopular: true,
    score: "À jouer"
  },
  {
    id: "match-6",
    homeTeam: "TBD",
    homeFlag: "🏳️",
    awayTeam: "TBD",
    awayFlag: "🏳️",
    phase: "Grande Finale",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    date: "13 Juillet 2030",
    time: "20:00",
    isPopular: true
  }
];

export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: "cat-1",
    name: "Catégorie 1 / Carré VIP",
    description: "Sièges rembourrés en tribune officielle centre, accès salon VIP Lounge avec traiteur marocain raffiné, wifi très haut débit et cadeau souvenir premium.",
    priceMAD: 4500,
    badge: "👑 VIP"
  },
  {
    id: "cat-2",
    name: "Catégorie 2 / Tribune Centrale",
    description: "Excellente visibilité latérale haute, accès prioritaire aux stands d'animation officiels et sièges confortables idéalement situés face à la ligne médiane.",
    priceMAD: 2500,
    badge: "✨ Premium"
  },
  {
    id: "cat-3",
    name: "Catégorie 3 / Tribune Latérale",
    description: "Excellente vue d'ensemble derrière les buts et en diagonal, parfait pour vivre l'ambiance authentique du stade en famille ou entre amis.",
    priceMAD: 1200,
    badge: "👍 Standard"
  },
  {
    id: "cat-4",
    name: "Catégorie 4 / Virage Populaire",
    description: "L'épicentre de la ferveur et des chants passionnés. Idéal pour les supporters souhaitant chanter et déployer des tifos inoubliables.",
    priceMAD: 400,
    badge: "🔥 Ambiance"
  }
];

export const DISCOUNT_OPTIONS: DiscountOption[] = [
  {
    id: "discount-none",
    name: "Plein Tarif",
    reductionPercent: 0,
    description: "Tarif standard grand public"
  },
  {
    id: "discount-resident",
    name: "Résident Marocain (-20%)",
    reductionPercent: 20,
    description: "Sur présentation de la CNIE valide lors de l'accès au stade"
  },
  {
    id: "discount-student",
    name: "Étudiant (-40%)",
    reductionPercent: 40,
    description: "Sur présentation d'une carte d'étudiant marocaine ou internationale"
  }
];

export const DASHBOARD_STATS: DashboardStats = {
  voluntariesCount: 3200,
  voluntariesGoal: 5000,
  stadiumsCount: 6,
  stadiumsReady: 4,
  matchesScheduled: 48,
  activeBadges: 1240,
  estimatedBudgetMAD: 850000000,
  ticketsSold: 78000,
  ticketsAvailable: 320000,
  averageMatchingScore: 72.3
};

// ============================================================
// Interfaces alignées sur les modèles Odoo réels
// ============================================================

/** Modèle Odoo wc.match (avec extensions wc_data) */
export interface OdooMatch {
  id: number;
  name: string;
  team_a: string;
  team_b: string;
  team_a_id: [number, string] | false;
  team_b_id: [number, string] | false;
  stadium_id: [number, string];
  date_time: string;
  phase: 'group' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
  group: string | false;
  state: 'planned' | 'ongoing' | 'done' | 'cancelled';
  score_a: number;
  score_b: number;
  referee: string | false;
  attendance: number;
  is_historical: boolean;
}

/** Modèle Odoo wc.stadium */
export interface OdooStadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  gross_capacity: number;
  net_capacity: number;
  address: string | false;
  stadium_type: 'match' | 'training';
  state: 'construction' | 'ready' | 'maintenance';
  country: string;
  gps_lat: number;
  gps_lng: number;
  fifa_code: string | false;
  zone_ids: number[];
  match_ids: number[];
  zone_count: number;
  match_count: number;
  image: string | false;
}

/** Modèle Odoo wc.stadium.zone */
export interface OdooStadiumZone {
  id: number;
  name: string;
  stadium_id: [number, string];
  zone_type: 'tribune' | 'vip' | 'press' | 'field' | 'backstage' | 'medical' | 'logistics';
  capacity: number;
}

/** Modèle Odoo wc.volunteer */
export interface OdooVolunteer {
  id: number;
  name: string;
  email: string;
  phone: string | false;
  date_of_birth: string | false;
  gender: 'male' | 'female' | false;
  nationality: string | false;
  id_number: string | false;
  skill_ids: [number, string][];
  language_ids: [number, string][];
  has_driving_license: boolean;
  has_vehicle: boolean;
  has_first_aid: boolean;
  education_level: 'bac' | 'bac2' | 'bac3' | 'bac5' | 'phd' | false;
  experience: string | false;
  availability: 'full' | 'morning' | 'evening' | 'weekend';
  preferred_stadium_id: [number, string] | false;
  state: 'candidate' | 'preselected' | 'trained' | 'assigned' | 'active' | 'archived';
  matching_score: number;
  points: number;
  badge_count: number;
  application_date: string;
}

/** Modèle Odoo wc.volunteer.skill */
export interface OdooVolunteerSkill {
  id: number;
  name: string;
  color: number;
}

/** Modèle Odoo wc.volunteer.role */
export interface OdooVolunteerRole {
  id: number;
  name: string;
  functional_area: string;
  description: string | false;
}

/** Modèle Odoo wc.accreditation */
export interface OdooAccreditation {
  id: number;
  name: string;
  holder_name: string;
  holder_email: string | false;
  category: 'fifa' | 'team' | 'media' | 'volunteer' | 'vip' | 'logistics' | 'medical';
  qr_token: string;
  state: 'draft' | 'approved' | 'printed' | 'active' | 'suspended' | 'revoked';
  zone_ids: [number, string][];
  date_start: string;
  date_end: string;
  is_expired: boolean;
  scan_count: number;
  last_scan_date: string | false;
}

/** Modèle Odoo wc.ticket.pricing */
export interface OdooTicketPricing {
  id: number;
  name: string;
  stadium_id: [number, string];
  phase: 'group' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
  ticket_category: 'cat1' | 'cat2' | 'cat3' | 'cat4';
  base_price: number;
  early_bird_price: number;
  last_minute_price: number;
  resident_discount_pct: number;
  student_discount_pct: number;
  final_price_resident: number;
  final_price_student: number;
  total_available: number;
  total_sold: number;
  fill_rate: number;
}

/** Modèle Odoo wc.dashboard (singleton KPIs) */
export interface OdooDashboard {
  id: number;
  name: string;
  date_refresh: string | false;
  // Volontaires
  vol_total: number;
  vol_candidates: number;
  vol_preselected: number;
  vol_trained: number;
  vol_assigned: number;
  vol_active: number;
  vol_avg_score: number;
  // Stades
  stadium_total: number;
  stadium_ready: number;
  stadium_total_capacity: number;
  // Matchs
  match_total: number;
  match_planned: number;
  match_done: number;
  // Badges
  badge_total: number;
  badge_active: number;
  badge_expired: number;
  badge_revoked: number;
  badge_total_scans: number;
  // Logistique
  incident_total: number;
  incident_open: number;
  incident_critical: number;
  resource_out_of_stock: number;
  transport_planned: number;
  request_pending: number;
  // Finance
  budget_total_planned: number;
  budget_total_spent: number;
  budget_consumption_avg: number;
  revenue_total_projected: number;
  revenue_total_actual: number;
  revenue_variance_pct: number;
  ticket_total_available: number;
  ticket_total_sold: number;
  ticket_fill_rate: number;
}

/** Résultat de validation de scan (badge ou ticket) */
export interface ScanValidationResult {
  valid: boolean;
  message: string;
  holder_name?: string;
  category?: string;
  zones?: string[];
  scan_count?: number;
  ticket_data?: {
    match: string;
    stadium: string;
    zone: string;
    barcode: string;
  };
}

// ============================================================
// Fonctions de mapping Odoo → Frontend
// ============================================================

const PHASE_MAP: Record<string, string> = {
  group: 'Phase de groupes',
  round16: 'Huitièmes de finale',
  quarter: 'Quart de finale',
  semi: 'Demi-finale',
  third: 'Petite Finale (3e place)',
  final: 'Grande Finale',
};

const STATE_MAP: Record<string, string> = {
  planned: 'Planifié',
  ongoing: 'En cours',
  done: 'Terminé',
  cancelled: 'Annulé',
};

export const TEAM_TRANSLATIONS: Record<string, string> = {
  // English -> French
  'Morocco': 'Maroc',
  'Algeria': 'Algérie',
  'Angola': 'Angola',
  'Cameroon': 'Cameroun',
  'Egypt': 'Égypte',
  'Ghana': 'Ghana',
  'Ivory Coast': 'Côte d\'Ivoire',
  'Nigeria': 'Nigéria',
  'Senegal': 'Sénégal',
  'Tunisia': 'Tunisie',
  'South Africa': 'Afrique du Sud',

  'Germany': 'Allemagne',
  'England': 'Angleterre',
  'Austria': 'Autriche',
  'Belgium': 'Belgique',
  'Bosnia and Herzegovina': 'Bosnie-Herzégovine',
  'Bulgaria': 'Bulgarie',
  'Croatia': 'Croatie',
  'Denmark': 'Danemark',
  'Spain': 'Espagne',
  'France': 'France',
  'Italy': 'Italie',
  'Netherlands': 'Pays-Bas',
  'Portugal': 'Portugal',
  'Switzerland': 'Suisse',
  'Sweden': 'Suède',
  'Turkey': 'Turquie',
  'Ukraine': 'Ukraine',

  'Argentina': 'Argentine',
  'Bolivia': 'Bolivie',
  'Brazil': 'Brésil',
  'Chile': 'Chili',
  'Colombia': 'Colombie',
  'Ecuador': 'Équateur',
  'Paraguay': 'Paraguay',
  'Peru': 'Pérou',
  'Uruguay': 'Uruguay',
  'Venezuela': 'Venezuela',

  'Canada': 'Canada',
  'United States': 'États-Unis',
  'Mexico': 'Mexique',
  'Costa Rica': 'Costa Rica',
  'Honduras': 'Honduras',
  'Jamaica': 'Jamaïque',
  'Panama': 'Panama',

  'Australia': 'Australie',
  'China': 'Chine',
  'Japan': 'Japon',
  'South Korea': 'Corée du Sud',
  'Saudi Arabia': 'Arabie Saoudite',
  'Iran': 'Iran',
};

export const TEAM_FLAGS: Record<string, string> = {
  'Maroc': '🇲🇦', 'Morocco': '🇲🇦',
  'Algérie': '🇩🇿', 'Algeria': '🇩🇿',
  'Angola': '🇦🇴',
  'Cameroun': '🇨🇲', 'Cameroon': '🇨🇲',
  'Égypte': '🇪🇬', 'Egypt': '🇪🇬',
  'Ghana': '🇬🇭',
  'Côte d\'Ivoire': '🇨🇮', 'Ivory Coast': '🇨🇮',
  'Nigéria': '🇳🇬', 'Nigeria': '🇳🇬',
  'Sénégal': '🇸🇳', 'Senegal': '🇸🇳',
  'Tunisie': '🇹🇳', 'Tunisia': '🇹🇳',
  'Afrique du Sud': '🇿🇦', 'South Africa': '🇿🇦',

  'Allemagne': '🇩🇪', 'Germany': '🇩🇪',
  'Angleterre': '🇬🇧', 'England': '🇬🇧',
  'Autriche': '🇦🇹', 'Austria': '🇦🇹',
  'Belgique': '🇧🇪', 'Belgium': '🇧🇪',
  'Bosnie-Herzégovine': '🇧🇦', 'Bosnia and Herzegovina': '🇧🇦',
  'Bulgarie': '🇧🇬', 'Bulgaria': '🇧🇬',
  'Croatie': '🇭🇷', 'Croatia': '🇭🇷',
  'Danemark': '🇩🇰', 'Denmark': '🇩🇰',
  'Espagne': '🇪🇸', 'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Italie': '🇮🇹', 'Italy': '🇮🇹',
  'Pays-Bas': '🇳🇱', 'Netherlands': '🇳🇱',
  'Portugal': '🇵🇹',
  'Suisse': '🇨🇭', 'Switzerland': '🇨🇭',
  'Suède': '🇸🇪', 'Sweden': '🇸🇪',
  'Turquie': '🇹🇷', 'Turkey': '🇹🇷',
  'Ukraine': '🇺🇦',

  'Argentine': '🇦🇷', 'Argentina': '🇦🇷',
  'Bolivie': '🇧🇴', 'Bolivia': '🇧🇴',
  'Brésil': '🇧🇷', 'Brazil': '🇧🇷',
  'Chili': '🇨🇱', 'Chile': '🇨🇱',
  'Colombie': '🇨🇴', 'Colombia': '🇨🇴',
  'Équateur': '🇪🇨', 'Ecuador': '🇪🇨',
  'Paraguay': '🇵🇾',
  'Pérou': '🇵🇪', 'Peru': '🇵🇪',
  'Uruguay': '🇺🇾',
  'Venezuela': '🇻🇪',

  'Canada': '🇨🇦',
  'États-Unis': '🇺🇸', 'United States': '🇺🇸',
  'Mexique': '🇲🇽', 'Mexico': '🇲🇽',
  'Costa Rica': '🇨🇷',
  'Honduras': '🇭🇳',
  'Jamaïque': '🇯🇲', 'Jamaica': '🇯🇲',
  'Panama': '🇵🇦',

  'Australie': '🇦🇺', 'Australia': '🇦🇺',
  'Chine': '🇨🇳', 'China': '🇨🇳',
  'Japon': '🇯🇵', 'Japan': '🇯🇵',
  'Corée du Sud': '🇰🇷', 'South Korea': '🇰🇷',
  'Arabie Saoudite': '🇸🇦', 'Saudi Arabia': '🇸🇦',
  'Iran': '🇮🇷',
};

export function translateTeamName(name: string): string {
  if (!name) return name;
  const trimmed = name.trim();
  return TEAM_TRANSLATIONS[trimmed] || trimmed;
}

export function getTeamFlag(name: string): string {
  if (!name) return '🏳️';
  const trimmed = name.trim();
  return TEAM_FLAGS[trimmed] || TEAM_FLAGS[translateTeamName(trimmed)] || '🏳️';
}

/** Convertit un match Odoo vers l'interface Match du frontend */
export function mapOdooMatch(raw: OdooMatch): Match {
  const homeFr = translateTeamName(raw.team_a);
  const awayFr = translateTeamName(raw.team_b);
  return {
    id: `match-${raw.id}`,
    homeTeam: homeFr,
    homeFlag: getTeamFlag(homeFr),
    awayTeam: awayFr,
    awayFlag: getTeamFlag(awayFr),
    phase: PHASE_MAP[raw.phase] || raw.phase,
    stadium: raw.stadium_id[1],
    city: '',  // Dérivé du stade côté frontend
    date: raw.date_time ? new Date(raw.date_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    time: raw.date_time ? new Date(raw.date_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
    score: raw.state === 'done' ? `${raw.score_a} - ${raw.score_b}` : undefined,
    isPopular: raw.phase === 'final' || raw.phase === 'semi',
  };
}

/** Convertit un stade Odoo vers l'interface Stadium du frontend */
export function mapOdooStadium(raw: OdooStadium): Stadium {
  const EMOJI_MAP: Record<string, string> = {
    'Casablanca': '🏟️',
    'Rabat': '🏛️',
    'Tanger': '🌊',
    'Fès': '🏺',
    'Marrakech': '🌴',
    'Agadir': '☀️',
  };

  return {
    id: `stadium-${raw.id}`,
    name: raw.name,
    city: raw.city,
    capacity: raw.capacity,
    highlight: '',
    progress: raw.state === 'ready' ? 'Prêt' : 'En construction',
    image: EMOJI_MAP[raw.city] || '🏟️',
    description: raw.address || '',
    features: [],
  };
}

export interface AuthUser {
  uid: number;
  email: string;
  name: string;
  role: 'admin' | 'volunteer' | 'public';
}

export interface AuthSession {
  user: AuthUser | null;
}
