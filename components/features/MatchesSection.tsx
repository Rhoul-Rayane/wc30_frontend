"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Match, translateTeamName, getTeamFlag } from '@/lib/types';
import { MapPin, Flame } from 'lucide-react';

interface MatchesSectionProps {
  onBookMatch: (match: Match) => void;
  initialStadiumFilter?: string;
  onResetStadiumFilter?: () => void;
  initialMatches?: Match[];
}

// Extended interface mapping status and group
interface CompMatch extends Match {
  status: "Planifié" | "En cours" | "Terminé" | "Annulé";
  group?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  day: string;
  month: string;
  phaseCategory: "Groupes" | "8èmes" | "Quarts" | "Demis" | "Finale";
}

// 13 Match fixtures (Original 6 + 7 custom entries covering all groups A-H & phases)
const FIXTURES_DATA: CompMatch[] = [
  {
    id: "match-1",
    homeTeam: "Maroc",
    homeFlag: "🇲🇦",
    awayTeam: "Portugal",
    awayFlag: "🇵🇹",
    phase: "Groupes (Match d'ouverture)",
    phaseCategory: "Groupes",
    group: "A",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    day: "14",
    month: "Juin",
    date: "14 Juin 2030",
    time: "20:00",
    status: "Terminé",
    score: "2 - 1",
    isPopular: true
  },
  {
    id: "match-2",
    homeTeam: "Brésil",
    homeFlag: "🇧🇷",
    awayTeam: "Allemagne",
    awayFlag: "🇩🇪",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "B",
    stadium: "Grand Stade de Rabat",
    city: "Rabat",
    day: "15",
    month: "Juin",
    date: "15 Juin 2030",
    time: "18:00",
    status: "En cours",
    score: "1 - 1"
  },
  {
    id: "match-3",
    homeTeam: "France",
    homeFlag: "🇫🇷",
    awayTeam: "Argentine",
    awayFlag: "🇦🇷",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "C",
    stadium: "Grand Stade de Tanger",
    city: "Tanger",
    day: "16",
    month: "Juin",
    date: "16 Juin 2030",
    time: "21:00",
    status: "Planifié",
    isPopular: true
  },
  {
    id: "match-7",
    homeTeam: "Portugal",
    homeFlag: "🇵🇹",
    awayTeam: "Uruguay",
    awayFlag: "🇺🇾",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "D",
    stadium: "Grand Stade de Fès",
    city: "Fès",
    day: "18",
    month: "Juin",
    date: "18 Juin 2030",
    time: "15:00",
    status: "Planifié"
  },
  {
    id: "match-8",
    homeTeam: "Angleterre",
    homeFlag: "🇬🇧",
    awayTeam: "Sénégal",
    awayFlag: "🇸🇳",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "E",
    stadium: "Grand Stade de Marrakech",
    city: "Marrakech",
    day: "20",
    month: "Juin",
    date: "20 Juin 2030",
    time: "18:00",
    status: "Annulé"
  },
  {
    id: "match-9",
    homeTeam: "Belgique",
    homeFlag: "🇧🇪",
    awayTeam: "Croatie",
    awayFlag: "🇭🇷",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "F",
    stadium: "Grand Stade d'Agadir",
    city: "Agadir",
    day: "22",
    month: "Juin",
    date: "22 Juin 2030",
    time: "21:00",
    status: "Terminé",
    score: "3 - 2"
  },
  {
    id: "match-10",
    homeTeam: "Argentine",
    homeFlag: "🇦🇷",
    awayTeam: "Canada",
    awayFlag: "🇨🇦",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "G",
    stadium: "Grand Stade de Rabat",
    city: "Rabat",
    day: "25",
    month: "Juin",
    date: "25 Juin 2030",
    time: "20:00",
    status: "Planifié"
  },
  {
    id: "match-11",
    homeTeam: "Espagne",
    homeFlag: "🇪🇸",
    awayTeam: "Cameroun",
    awayFlag: "🇨🇲",
    phase: "Phase de groupes",
    phaseCategory: "Groupes",
    group: "H",
    stadium: "Grand Stade de Fès",
    city: "Fès",
    day: "26",
    month: "Juin",
    date: "26 Juin 2030",
    time: "17:00",
    status: "Planifié"
  },
  {
    id: "match-4",
    homeTeam: "Espagne",
    homeFlag: "🇪🇸",
    awayTeam: "Japon",
    awayFlag: "🇯🇵",
    phase: "Huitièmes de finale",
    phaseCategory: "8èmes",
    stadium: "Grand Stade de Marrakech",
    city: "Marrakech",
    day: "01",
    month: "Juill.",
    date: "01 Juillet 2030",
    time: "20:00",
    status: "Planifié"
  },
  {
    id: "match-12",
    homeTeam: "Maroc",
    homeFlag: "🇲🇦",
    awayTeam: "Espagne",
    awayFlag: "🇪🇸",
    phase: "Quart de finale",
    phaseCategory: "Quarts",
    stadium: "Grand Stade de Tanger",
    city: "Tanger",
    day: "05",
    month: "Juill.",
    date: "05 Juillet 2030",
    time: "18:00",
    status: "Planifié",
    isPopular: true
  },
  {
    id: "match-5",
    homeTeam: "Maroc",
    homeFlag: "🇲🇦",
    awayTeam: "Brésil",
    awayFlag: "🇧🇷",
    phase: "Demi-finale",
    phaseCategory: "Demis",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    day: "10",
    month: "Juill.",
    date: "10 Juillet 2030",
    time: "21:00",
    status: "Planifié",
    isPopular: true
  },
  {
    id: "match-13",
    homeTeam: "France",
    homeFlag: "🇫🇷",
    awayTeam: "Italie",
    awayFlag: "🇮🇹",
    phase: "Petite Finale (3e place)",
    phaseCategory: "Finale",
    stadium: "Grand Stade d'Agadir",
    city: "Agadir",
    day: "12",
    month: "Juill.",
    date: "12 Juillet 2030",
    time: "17:00",
    status: "Planifié"
  },
  {
    id: "match-6",
    homeTeam: "TBD",
    homeFlag: "🏳️",
    awayTeam: "TBD",
    awayFlag: "🏳️",
    phase: "Grande Finale",
    phaseCategory: "Finale",
    stadium: "Grand Stade Hassan II",
    city: "Casablanca",
    day: "13",
    month: "Juill.",
    date: "13 Juillet 2030",
    time: "20:00",
    status: "Planifié",
    isPopular: true
  }
];

export default function MatchesSection({ 
  onBookMatch, 
  initialStadiumFilter = 'Tous',
  onResetStadiumFilter,
  initialMatches
}: MatchesSectionProps) {
  // Helpers to enrich Odoo matches with missing fields
  const enrichMatches = (items: Match[]): CompMatch[] => {
    return items.map(item => {
      const comp = item as any;
      
      const homeTeam = translateTeamName(item.homeTeam);
      const awayTeam = translateTeamName(item.awayTeam);
      const homeFlag = item.homeFlag || getTeamFlag(homeTeam);
      const awayFlag = item.awayFlag || getTeamFlag(awayTeam);

      if (comp.phaseCategory && comp.status) {
        return {
          ...comp,
          homeTeam,
          awayTeam,
          homeFlag,
          awayFlag
        } as CompMatch;
      }
      let day = '15';
      let month = 'Juin';
      if (item.date) {
        const parts = item.date.split(' ');
        if (parts.length >= 2) {
          day = parts[0];
          month = parts[1];
        }
      }
      let phaseCategory: 'Groupes' | '8èmes' | 'Quarts' | 'Demis' | 'Finale' = 'Groupes';
      const phaseLower = item.phase.toLowerCase();
      if (phaseLower.includes('huit') || phaseLower.includes('8')) {
        phaseCategory = '8èmes';
      } else if (phaseLower.includes('quart')) {
        phaseCategory = 'Quarts';
      } else if (phaseLower.includes('demi')) {
        phaseCategory = 'Demis';
      } else if (phaseLower.includes('finale') || phaseLower.includes('3e')) {
        phaseCategory = 'Finale';
      }
      return {
        ...item,
        homeTeam,
        awayTeam,
        status: item.score ? 'Terminé' : 'Planifié',
        group: comp.group || 'A',
        day,
        month,
        phaseCategory,
        homeFlag,
        awayFlag,
      } as CompMatch;
    });
  };

  const matchesSource = initialMatches ? enrichMatches(initialMatches) : FIXTURES_DATA;

  // Filters state
  const [phaseFilter, setPhaseFilter] = useState<'Tous' | 'Groupes' | '8èmes' | 'Quarts' | 'Demis' | 'Finale'>('Tous');
  const [stadiumFilter, setStadiumFilter] = useState<string>(initialStadiumFilter);
  const [groupFilter, setGroupFilter] = useState<'Tous' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>('Tous');

  // React to initialStadiumFilter changes
  React.useEffect(() => {
    if (initialStadiumFilter) {
      let mappedFilter = initialStadiumFilter;
      // Normaliser la valeur du filtre initial pour qu'elle corresponde aux clés du select
      if (initialStadiumFilter === 'Grand Stade de Rabat' || initialStadiumFilter.includes('Moulay') || initialStadiumFilter.includes('Rabat')) {
        mappedFilter = 'Stade Prince Moulay Abdellah';
      } else if (initialStadiumFilter === 'Grand Stade de Fès' || initialStadiumFilter.includes('Fès') || initialStadiumFilter.includes('Fes')) {
        mappedFilter = 'Stade de Fès';
      }
      setStadiumFilter(mappedFilter);
      if (initialStadiumFilter !== 'Tous') {
        setPhaseFilter('Tous');
        setGroupFilter('Tous');
      }
    }
  }, [initialStadiumFilter]);

  // Load more pagination state
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Phase badge coloration helper
  const getPhaseBadgeColor = (category: string) => {
    switch (category) {
      case 'Groupes':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
      case '8èmes':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
      case 'Quarts':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/25';
      case 'Demis':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/25';
      case 'Finale':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/35';
      default:
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700/60';
    }
  };

  // Filter evaluation logic
  const filteredMatches = matchesSource.filter((match) => {
    // 1. Phase Filter
    const matchPhase = phaseFilter === 'Tous' || match.phaseCategory === phaseFilter;

    // 2. Stadium Filter
    const normalizeStadiumName = (name: string): string => {
      if (!name) return '';
      const lower = name.toLowerCase();
      if (lower.includes('rabat') || lower.includes('moulay')) return 'rabat';
      if (lower.includes('fès') || lower.includes('fes')) return 'fes';
      if (lower.includes('hassan') || lower.includes('casablanca')) return 'casablanca';
      if (lower.includes('tanger')) return 'tanger';
      if (lower.includes('marrakech')) return 'marrakech';
      if (lower.includes('agadir')) return 'agadir';
      return lower.replace(/[^a-z0-9]/g, '');
    };
    const matchStadium = stadiumFilter === 'Tous' || normalizeStadiumName(match.stadium) === normalizeStadiumName(stadiumFilter);

    // 3. Group Filter
    const matchGroup = groupFilter === 'Tous' || match.group === groupFilter;

    return matchPhase && matchStadium && matchGroup;
  });

  // Action to reset filters
  const resetFilters = () => {
    setPhaseFilter('Tous');
    setStadiumFilter('Tous');
    setGroupFilter('Tous');
    setVisibleCount(6);
    if (onResetStadiumFilter) {
      onResetStadiumFilter();
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0a0a0a]" id="matches-section-wrapper">
      
      {/* 1. EN-TÊTE DE PAGE */}
      <section className="pt-8 pb-6 px-4 md:px-8 max-w-6xl mx-auto w-full select-none" id="matches-section-header">
        <div className="text-left md:text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white inline-flex items-center gap-2.5 uppercase">
            <span>Calendrier des Matchs</span>
            <span className="text-[#34d399] filter drop-shadow">⚽</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-light max-w-xl md:mx-auto">
            Suivez tous les matchs de la Coupe du Monde FIFA 2030
          </p>
        </div>
      </section>

      {/* 2. BARRE DE FILTRES (sticky sous la navbar) */}
      <div 
        id="matches-sticky-filterbar"
        className="sticky top-16 z-30 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-y border-zinc-900/85 px-4 md:px-8 py-3.5 select-none"
      >
        <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5">
          
          {/* Row of filters wrapped beautifully */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-end">
            
            {/* - Filtre par PHASE */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#34d399]" htmlFor="filter-phase-wrapper">
                🏆 Phase de Compétition
              </label>
              <div 
                id="filter-phase-wrapper"
                className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/80 overflow-x-auto scrollbar-none"
              >
                {(['Tous', 'Groupes', '8èmes', 'Quarts', 'Demis', 'Finale'] as const).map((ph) => {
                  const isActive = phaseFilter === ph;
                  return (
                    <button
                      key={ph}
                      id={`filter-phase-${ph}`}
                      onClick={() => {
                        setPhaseFilter(ph);
                        // Safe sync: group buttons only applicable when group or all is selected
                        if (ph !== 'Tous' && ph !== 'Groupes') {
                          setGroupFilter('Tous');
                        }
                        setVisibleCount(6); // reset page view
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/40 shadow-[0_0_12px_rgba(52,211,153,0.12)]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {ph}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* - Filtre par STADE */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500" htmlFor="filter-stadium-select">
                🏟️ Temples Marocains
              </label>
              <div className="relative">
                <select
                  id="filter-stadium-select"
                  value={stadiumFilter}
                  onChange={(e) => {
                    setStadiumFilter(e.target.value);
                    setVisibleCount(6);
                  }}
                  className="appearance-none w-full bg-zinc-900/50 border border-zinc-800/80 px-4 py-2.5 pr-10 rounded-xl text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#34d399] focus:border-[#34d399] transition-all cursor-pointer"
                >
                  <option value="Tous" className="bg-[#121214] text-zinc-400">Tous les stades</option>
                  <option value="Grand Stade Hassan II" className="bg-[#121214] text-zinc-300">Grand Stade Hassan II (Casablanca)</option>
                  <option value="Stade Prince Moulay Abdellah" className="bg-[#121214] text-zinc-300">Stade Prince Moulay Abdellah (Rabat)</option>
                  <option value="Grand Stade de Tanger" className="bg-[#121214] text-zinc-300">Grand Stade de Tanger (Tanger)</option>
                  <option value="Stade de Fès" className="bg-[#121214] text-zinc-300">Stade de Fès (Fès)</option>
                  <option value="Grand Stade de Marrakech" className="bg-[#121214] text-zinc-300">Grand Stade de Marrakech (Marrakech)</option>
                  <option value="Grand Stade d'Agadir" className="bg-[#121214] text-zinc-300">Grand Stade d'Agadir (Agadir)</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500 text-[10px]">
                  ▼
                </span>
              </div>
            </div>

            {/* - Filtre par GROUPE */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#34d399]" htmlFor="filter-group-wrapper">
                🔢 Groupes (Poules A - H)
              </label>
              <div 
                id="filter-group-wrapper"
                className="flex items-center gap-1.5 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/80 overflow-x-auto scrollbar-none"
              >
                {(['Tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const).map((grp) => {
                  const isActive = groupFilter === grp;
                  return (
                    <button
                      key={grp}
                      id={`filter-group-${grp}`}
                      onClick={() => {
                        setGroupFilter(grp);
                        // Auto-align phase option to group stage if any letter is set
                        if (grp !== 'Tous') {
                          setPhaseFilter('Groupes');
                        }
                        setVisibleCount(6);
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/40 shadow-[0_0_10px_rgba(52,211,153,0.12)]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {grp}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. GRILLE DE MATCHS (Horizontal Cards) */}
      <section className="py-10 px-4 md:px-8 max-w-6xl mx-auto w-full flex-grow">
        
        {filteredMatches.length === 0 ? (
          <div 
            id="matches-empty-state"
            className="glass-panel rounded-3xl p-16 text-center border border-zinc-900 bg-zinc-900/10"
          >
            <span className="text-4xl block mb-4">🏟️</span>
            <h4 className="text-base font-display font-bold text-white uppercase tracking-wider mb-2">Aucun match disponible</h4>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
              Aucune rencontre ne correspond au croisement de vos filtres sur le sol marocain.
            </p>
            <button 
              id="btn-reset-filters"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/25 hover:bg-[#34d399]/20 transition-all cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4" id="matches-grid">
            {filteredMatches.slice(0, visibleCount).map((match) => {
              // Parse out split scores
              const scoreA = match.score ? match.score.split('-')[0].trim() : '—';
              const scoreB = match.score ? match.score.split('-')[1].trim() : '—';

              return (
                <div 
                  key={match.id}
                  id={`match-card-${match.id}`}
                  className={`glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 transition-all duration-300 hover:border-zinc-700/60 bg-gradient-to-r from-zinc-950/60 via-zinc-900/25 to-zinc-950/60 border ${
                    match.isPopular ? 'border-amber-500/15' : 'border-zinc-900'
                  }`}
                >
                  
                  {/* - À gauche : DATE & HEURE */}
                  <div className="flex md:flex-col items-center justify-center bg-zinc-950/45 p-3 rounded-xl min-w-[100px] border border-zinc-900/80 text-center select-none shrink-0 gap-1.5">
                    <div className="flex flex-col">
                      <span className="text-2xl sm:text-3xl font-display font-black text-[#fbbf24] leading-none tracking-tight">
                        {match.day}
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase leading-none mt-1">
                        {match.month}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#34d399] bg-[#34d399]/10 px-1.5 py-0.5 rounded-md border border-[#34d399]/15">
                      {match.time}
                    </span>
                  </div>

                  {/* - Au centre : TEAM DETAILS & STATS */}
                  <div className="flex-grow flex flex-col justify-center gap-2">
                    {/* Line 1: [Drapeau] ÉQUIPE A — score — VS — score — ÉQUIPE B [Drapeau] */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6 py-1 select-none">
                      
                      {/* Team A */}
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-end min-w-0">
                        <span className="text-xs sm:text-sm font-display font-bold text-white text-right truncate">
                          {match.homeTeam}
                        </span>
                        <span className="text-3xl sm:text-4xl filter drop-shadow select-none shrink-0" title={match.homeTeam}>
                          {match.homeFlag}
                        </span>
                      </div>

                      {/* Score Box */}
                      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80 shrink-0">
                        <span className="text-lg sm:text-xl font-mono font-black text-[#fbbf24] min-w-[0.75rem] text-center">
                          {scoreA}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider">
                          VS
                        </span>
                        <span className="text-lg sm:text-xl font-mono font-black text-[#fbbf24] min-w-[0.75rem] text-center">
                          {scoreB}
                        </span>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-start min-w-0">
                        <span className="text-3xl sm:text-4xl filter drop-shadow select-none shrink-0" title={match.awayTeam}>
                          {match.awayFlag}
                        </span>
                        <span className="text-xs sm:text-sm font-display font-bold text-white text-left truncate">
                          {match.awayTeam}
                        </span>
                      </div>
                    </div>

                    {/* Line 2 & 3 row details */}
                    <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] select-none">
                      {/* Phase Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${getPhaseBadgeColor(match.phaseCategory)}`}>
                        {match.phase} {match.group ? `• Groupe ${match.group}` : ''}
                      </span>

                      {/* Major match star icon */}
                      {match.isPopular && (
                        <span className="flex items-center gap-0.5 font-bold uppercase text-[9px] tracking-wider text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20 px-2 py-0.5 rounded-full animate-pulse">
                          <Flame size={10} className="fill-[#fbbf24] shrink-0" /> Choc d'Exception
                        </span>
                      )}

                      {/* Stadium details */}
                      <span className="flex items-center gap-1 text-zinc-500 font-light">
                        <MapPin size={10} className="text-[#34d399] shrink-0" />
                        <span className="font-medium text-zinc-400">{match.stadium}</span>
                        <span className="text-zinc-650">•</span>
                        <span>{match.city}</span>
                      </span>
                    </div>

                  </div>

                  {/* - À droite : STATUS BADGES & BOOK TICKETS */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:min-w-[160px] shrink-0 border-t md:border-t-0 md:border-l border-zinc-900/40 pt-4 md:pt-0 md:pl-6 select-none">
                    
                    {/* Status badge representation */}
                    <div className="shrink-0">
                      {match.status === 'Planifié' && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 px-2.5 py-1 rounded-full">
                          ● Planifié
                        </span>
                      )}
                      {match.status === 'En cours' && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          En cours
                        </span>
                      )}
                      {match.status === 'Terminé' && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/25 px-2.5 py-1 rounded-full">
                          ✓ Terminé
                        </span>
                      )}
                      {match.status === 'Annulé' && (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full line-through">
                          ✕ Annulé
                        </span>
                      )}
                    </div>

                    {/* Booking Request Actions */}
                    <button
                      id={`btn-book-match-${match.id}`}
                      onClick={() => {
                        if (match.status !== 'Terminé' && match.status !== 'Annulé' && match.homeTeam !== 'TBD') {
                          onBookMatch(match);
                        }
                      }}
                      disabled={match.status === 'Terminé' || match.status === 'Annulé' || match.homeTeam === 'TBD'}
                      className={`w-full md:w-auto px-4 py-2 text-[10px] font-extrabold rounded-xl transition-all duration-300 font-display uppercase tracking-widest text-center ${
                        match.status === 'Terminé' || match.status === 'Annulé' || match.homeTeam === 'TBD'
                          ? 'bg-zinc-900/60 text-zinc-650 border border-zinc-800/60 cursor-not-allowed'
                          : 'bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30 hover:bg-[#34d399] hover:text-[#0a0a0a] hover:shadow-[0_0_15px_rgba(52,211,153,0.30)] cursor-pointer'
                      }`}
                    >
                      {match.homeTeam === 'TBD' 
                        ? 'Bientôt disponible' 
                        : match.status === 'Terminé' 
                          ? 'Vente close' 
                          : match.status === 'Annulé' 
                            ? 'Annulé' 
                            : 'Réserver Billet 🎫'}
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 4. En bas : pagination ou "Charger plus" */}
        {filteredMatches.length > visibleCount && (
          <div className="text-center mt-10 select-none" id="matches-load-more-container">
            <button
              id="btn-load-more-matches"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              🚀 Afficher plus de matchs ({filteredMatches.length - visibleCount} restants)
            </button>
          </div>
        )}

      </section>

    </div>
  );
}

