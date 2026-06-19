"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OFFICIAL_STADIUMS, Stadium } from '@/lib/types';
import { MapPin, Trophy, ArrowRight } from 'lucide-react';

interface StadiumsSectionProps {
  onViewMatchesInStadium?: (stadiumName: string) => void;
}

export default function StadiumsSection({ onViewMatchesInStadium }: StadiumsSectionProps) {
  const [hoveredStadiumId, setHoveredStadiumId] = useState<string | null>(null);

  // Maps coordinates and information for the custom SVG interactive map based on official borders
  const mapCities = [
    { city: "Tanger", left: "75%", top: "2.7%", id: "stadium-3" },
    { city: "Rabat", left: "59%", top: "16%", id: "stadium-2" },
    { city: "Casablanca", left: "54%", top: "20.7%", id: "stadium-1" },
    { city: "Fès", left: "69%", top: "16.7%", id: "stadium-4" },
    { city: "Marrakech", left: "50%", top: "28%", id: "stadium-5" },
    { city: "Agadir", left: "41%", top: "38.7%", id: "stadium-6" },
  ];

  // Dynamically map realistic counts for programmed matches in each arena
  const matchesCountMap: Record<string, string> = {
    "stadium-1": "12 matchs",
    "stadium-2": "9 matchs",
    "stadium-3": "10 matchs",
    "stadium-4": "8 matchs",
    "stadium-5": "8 matchs",
    "stadium-6": "7 matchs"
  };

  // Safe scroll helper to stadium card when clicked on the interactive map
  const handleCityClick = (stadiumId: string) => {
    const cardElement = document.getElementById(`stadium-card-${stadiumId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a momentary high-light glow effect
      cardElement.classList.add('ring-2', 'ring-[#34d399]/80');
      setTimeout(() => {
        cardElement.classList.remove('ring-2', 'ring-[#34d399]/80');
      }, 2000);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0a0a0a]" id="stadiums-section-wrapper">
      
      {/* 1. EN-TÊTE */}
      <section className="pt-8 pb-10 px-4 md:px-8 max-w-6xl mx-auto w-full select-none text-center" id="stadiums-header">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-3">
          Les Stades du Maroc 🏟️
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          6 enceintes de classe mondiale pour accueillir le plus grand spectacle sportif
        </p>
      </section>

      {/* 2. CARTE INTERACTIVE */}
      <section className="py-6 px-4 md:px-8 max-w-5xl mx-auto w-full mb-16" id="interactive-map-section">
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[660px]">
          
          {/* Subtle background network mesh / decorations */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#34d399]/5 to-transparent pointer-events-none" />
          
          <div className="w-full text-center md:text-left mb-6 relative z-10 select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#34d399] bg-[#34d399]/15 px-3 py-1 rounded-full border border-[#34d399]/30">
              EXPLORATION GÉOGRAPHIQUE
            </span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mt-3">
              Villes Hôtes Représentées 🇲🇦
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Survolez les points émeraude pour voir les stades en temps réel ou cliquez pour faire défiler jusqu'à leur fiche technique.
            </p>
          </div>

          {/* Morocco schematic map container (proportional tall aspect ratio for official map silhouette) */}
          <div className="relative w-full max-w-[400px] h-[580px] bg-[#121214]/50 rounded-2xl border border-[#34d399]/20 p-5 shadow-inner flex items-center justify-center">
            
            {/* Soft geometric background outlines representing Morocco boundaries map */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 150" preserveAspectRatio="none">
              {/* Subtle green pulse fill representing the authentic landmass */}
              <path 
                d="M 76,2 L 79,4 L 83,5 L 88,7 L 91,10 L 91,18 L 85,27 L 87,33 L 80,38 L 74,45 L 66,52 L 58,59 L 58,75 L 38,75 L 38,108 L 24,108 L 24,148 L 11,148 L 11,138 L 15,125 L 19,110 L 23,98 L 28,86 L 33,75 L 38,66 L 41,58 L 46,47 L 49,39 L 54,31 L 59,24 L 64,16 L 69,8 Z" 
                fill="rgba(52,211,153,0.08)" 
              />
              {/* Exact official dotted outline of Moroccan territory */}
              <path 
                d="M 76,2 L 79,4 L 83,5 L 88,7 L 91,10 L 91,18 L 85,27 L 87,33 L 80,38 L 74,45 L 66,52 L 58,59 L 58,75 L 38,75 L 38,108 L 24,108 L 24,148 L 11,148 L 11,138 L 15,125 L 19,110 L 23,98 L 28,86 L 33,75 L 38,66 L 41,58 L 46,47 L 49,39 L 54,31 L 59,24 L 64,16 L 69,8 Z" 
                stroke="#34d399" 
                strokeWidth="1.25" 
                fill="none" 
                strokeDasharray="2.5 2.5" 
              />
            </svg>

            {/* Simulated Geographic Labels */}
            <div className="absolute inset-x-0 top-6 text-center pointer-events-none select-none">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold bg-[#0a0a0a]/80 px-2 py-0.5 rounded-md border border-zinc-900">
                MER MÉDITERRANÉE ⛵
              </span>
            </div>
            <div className="absolute left-4 top-[35%] pointer-events-none select-none flex flex-col items-start gap-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#34d399]/50 font-bold">
                OCÉAN
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#34d399]/50 font-bold">
                ATLANTIQUE 🌊
              </span>
            </div>

            {/* City Hotspots */}
            {mapCities.map((point) => {
              const info = OFFICIAL_STADIUMS.find(s => s.id === point.id);
              const isHovered = hoveredStadiumId === point.id;
              
              return (
                <div
                  key={point.id}
                  style={{ left: point.left, top: point.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  onMouseEnter={() => setHoveredStadiumId(point.id)}
                  onMouseLeave={() => setHoveredStadiumId(null)}
                >
                  <button
                    onClick={() => handleCityClick(point.id)}
                    className="relative flex items-center justify-center p-2 focus:outline-none cursor-pointer group"
                    aria-label={`Voir le stade de ${point.city}`}
                  >
                    {/* Pulsing emerald core indicator glow */}
                    <span className="absolute inline-flex h-7 w-7 rounded-full bg-[#34d399]/45 animate-ping opacity-75" />
                    
                    {/* Circle button marker with premium styled ring */}
                    <span className="relative w-4 h-4 rounded-full bg-[#10b981] border-2 border-white shadow-[0_0_12px_rgba(52,211,153,0.8)] group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    {/* Static label showing city name below/beside */}
                    <span className="absolute top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/75 border border-zinc-800 text-[9px] font-bold text-zinc-300 pointer-events-none group-hover:text-[#34d399] transition-all whitespace-nowrap">
                      {point.city}
                    </span>
                  </button>

                  {/* Glassmorphic interactive Tooltip on Hover */}
                  <div 
                    className={`absolute bottom-9 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-50 ${
                      isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                    }`}
                  >
                    <div className="glass-panel border border-[#34d399]/40 bg-zinc-950/90 text-white rounded-xl py-2.5 px-3.5 shadow-2xl min-w-[190px] text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-xs">🏟️</span>
                        <span className="font-mono text-[9px] font-bold tracking-widest text-[#34d399] uppercase">
                          {point.city.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-display font-black text-white leading-tight">
                        {info?.name}
                      </h4>
                      <p className="text-[10px] text-[#fbbf24] font-bold mt-1 inline-flex items-center gap-0.5">
                        ⭐ {info?.capacity.toLocaleString() ?? "N/A"} places
                      </p>
                    </div>
                    {/* Tooltip triangle tail */}
                    <div className="w-2.5 h-2.5 bg-zinc-950 border-r border-b border-[#34d399]/40 rotate-45 mx-auto -mt-1.5" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 text-center text-[10px] text-zinc-500 font-mono tracking-wide">
            ● Les points émeraude pulsent aux emplacements officiels approuvés par la FIFA
          </div>
        </div>
      </section>

      {/* 3. GRILLE DE STADES (2 colonnes desktop, 1 colonne mobile) */}
      <section className="py-6 px-4 md:px-8 max-w-6xl mx-auto w-full mb-16" id="stadiums-grid-section">
        <div className="text-left mb-8 select-none">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fbbf24] bg-[#fbbf24]/10 px-3 py-1 rounded-full border border-[#fbbf24]/20">
            CATALOGUE DES ENCEINTES
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white mt-3">
            Fiches Techniques des 6 Arènes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Explorez les capacités hors normes, les statuts et le calendrier d'attribution des matchs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="stadiums-showcase-grid">
          {OFFICIAL_STADIUMS.map((stadium) => {
            const matchesCount = matchesCountMap[stadium.id] || "8 matchs";
            const isReady = stadium.progress === "Prêt";
            
            return (
              <div 
                id={`stadium-card-${stadium.id}`}
                key={stadium.id}
                className="glass-panel rounded-2xl border border-zinc-800/80 hover-glow overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                {/* Zone supérieure : rectangle en dégradé sombre simulant une photo de stade */}
                <div className="relative h-44 sm:h-48 bg-gradient-to-br from-zinc-900 via-emerald-950/45 to-black flex items-end p-5 select-none overflow-hidden border-b border-zinc-900">
                  {/* Visual grid pattern / decoration inside gradient */}
                  <div className="absolute inset-0 moroccan-grid opacity-30 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />
                  
                  {/* Subtle top-right icon overlay */}
                  <div className="absolute top-4 right-4 text-3xl font-display bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
                    {stadium.image}
                  </div>

                  <div className="relative z-10 w-full">
                    {/* Stadium Name in overlay (text-2xl, Outfit, bold) */}
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                      {stadium.name}
                    </h3>
                  </div>
                </div>

                {/* Zone inférieure */}
                <div className="p-6 flex-grow flex flex-col justify-between bg-zinc-900/10">
                  <div className="space-y-4">
                    {/* Info rows */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        <span className="font-semibold text-zinc-300">Ville :</span>
                      </div>
                      <span className="font-mono text-white font-bold tracking-wide">
                        {stadium.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Trophy className="w-4 h-4 text-[#fbbf24]" />
                        <span className="font-semibold text-zinc-300">Capacité :</span>
                      </div>
                      <span className="text-lg sm:text-xl font-display font-black text-[#fbbf24]">
                        {stadium.capacity.toLocaleString()} <span className="text-[10px] text-zinc-400 font-sans font-normal uppercase">places</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-zinc-400">Pays :</span>
                      <span className="font-bold text-white flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-lg border border-zinc-800">
                        🇲🇦 Maroc
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-zinc-400">Statut :</span>
                      {isReady ? (
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center gap-1">
                          Prêt ✅
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center gap-1">
                          🏗️ En construction
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-zinc-400">Type de site :</span>
                      <span className="font-mono text-[11px] tracking-wide text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/50">
                        Stade de Match FIFA
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-zinc-400">Matchs programmés :</span>
                      <span className="font-display font-bold text-emerald-400 text-sm">
                        {matchesCount}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-2 border-t border-zinc-850/60 font-light">
                      {stadium.description}
                    </p>
                  </div>

                  {/* Bouton Voir les matchs dans ce stade */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/50">
                    <button
                      onClick={() => onViewMatchesInStadium && onViewMatchesInStadium(stadium.name)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#18181b] hover:bg-[#34d399] hover:text-[#0a0a0a] border border-zinc-800/80 hover:border-transparent cursor-pointer transition-all duration-300 shadow-md group active:scale-95"
                    >
                      <span>Voir les matchs dans ce stade</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION COMPARAISON AVEC QATAR 2022 */}
      <section className="py-6 px-4 md:px-8 max-w-4xl mx-auto w-full mb-12" id="comparison-section">
        <div className="text-left mb-6 select-none">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#34d399] bg-[#34d399]/15 px-3 py-1 rounded-full border border-[#34d399]/30">
            RAPPORT DE PERFORMANCE
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mt-3">
            Comparatif Élite : Qatar 2022 vs Maroc 2030 📊
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Analyse comparative de l'infrastructure globale d'accueil de la Coupe du Monde.
          </p>
        </div>

        {/* Tableau comparatif glassmorphique */}
        <div className="glass-panel rounded-2xl border border-zinc-800/80 shadow-2xl relative overflow-hidden">
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[480px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/35">
                  <th className="py-4 px-6 text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
                    Critère
                  </th>
                  <th className="py-4 px-6 text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">
                    Qatar 2022
                  </th>
                  <th className="py-4 px-6 text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">
                    Maroc 2030
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-sm">
                
                {/* Row 1: Stades */}
                <tr className="hover:bg-white/1 transition-all">
                  <td className="py-4 px-6 font-semibold text-zinc-300">
                    Stades
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    8
                  </td>
                  <td className="py-4 px-6 text-zinc-300">
                    6 <span className="text-xs text-zinc-500 italic">(+ stades en Espagne/Portugal)</span>
                  </td>
                </tr>

                {/* Row 2: Capacité Totale */}
                <tr className="hover:bg-white/1 transition-all">
                  <td className="py-4 px-6 font-semibold text-zinc-300">
                    Capacité totale
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    437 000
                  </td>
                  <td className="py-4 px-6 text-zinc-300">
                    393 000
                  </td>
                </tr>

                {/* Row 3: Plus grand stade */}
                <tr className="hover:bg-white/1 transition-all">
                  <td className="py-4 px-6 font-semibold text-zinc-300">
                    Plus grand stade
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    Lusail (80 000)
                  </td>
                  <td className="py-4 px-6 text-[#fbbf24] font-bold">
                    Hassan II (115 000) 🏆
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="p-4 bg-zinc-900/20 border-t border-zinc-800 text-[11px] text-zinc-500 leading-normal flex items-start gap-1.5 font-mono select-none">
            <span className="text-[#fbbf24] text-xs">ℹ</span>
            <span>Les valeurs du Maroc 2030 qui surpassent le Qatar sont affichées en doré. Le Grand Stade Hassan II constituera le plus gigantesque temple de football de l'histoire moderne de la FIFA.</span>
          </div>

        </div>
      </section>

    </div>
  );
}

