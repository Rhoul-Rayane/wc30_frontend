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
