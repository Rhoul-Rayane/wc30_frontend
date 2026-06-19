"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  MapPin, 
  Info, 
  Percent, 
  GraduationCap, 
  CheckCircle, 
  ShoppingBag,
  ExternalLink,
  Users
} from 'lucide-react';

interface TarifsSectionProps {
  onNavigateToBooking: () => void;
}

interface StadiumTarif {
  name: string;
  city: string;
  capacity: number;
  sold: number;
  basePrices: [number, number, number, number]; // [Cat-1, Cat-2, Cat-3, Cat-4]
}

const STADIUM_TARIFS_DATA: StadiumTarif[] = [
  {
    name: "Grand Stade Hassan II",
    city: "Casablanca",
    capacity: 115000,
    sold: 82300,
    basePrices: [4500, 2500, 1200, 400]
  },
  {
    name: "Grand Stade de Rabat",
    city: "Rabat",
    capacity: 70000,
    sold: 51200,
    basePrices: [3800, 2200, 1000, 350]
  },
  {
    name: "Grand Stade de Tanger",
    city: "Tanger",
    capacity: 68000,
    sold: 48500,
    basePrices: [3600, 2000, 950, 320]
  },
  {
    name: "Grand Stade de Marrakech",
    city: "Marrakech",
    capacity: 45000,
    sold: 29100,
    basePrices: [3400, 1900, 900, 300]
  },
  {
    name: "Grand Stade de Fès",
    city: "Fès",
    capacity: 50000,
    sold: 31000,
    basePrices: [3200, 1800, 850, 280]
  },
  {
    name: "Grand Stade d'Agadir",
    city: "Agadir",
    capacity: 45000,
    sold: 22400,
    basePrices: [3100, 1750, 800, 250]
  }
];

const MATRICES_PHASES = [
  { id: "groupes", label: "Phase de groupes", multiplier: 1.0 },
  { id: "8emes", label: "8èmes", multiplier: 1.2 },
  { id: "quarts", label: "Quarts", multiplier: 1.5 },
  { id: "demis", label: "Demis", multiplier: 1.9 },
  { id: "3eme", label: "3ème place", multiplier: 1.6 },
  { id: "finale", label: "Finale", multiplier: 2.5 }
];

export default function TarifsSection({ onNavigateToBooking }: TarifsSectionProps) {
  const [activePhaseId, setActivePhaseId] = useState<string>("groupes");
  const [selectedMobileCell, setSelectedMobileCell] = useState<{stadiumIndex: number, colIndex: number} | null>(null);

  const activePhase = MATRICES_PHASES.find(p => p.id === activePhaseId) || MATRICES_PHASES[0];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(num);
  };

  const calculateDiscountedPrices = (basePrice: number) => {
    const rawPrice = basePrice * activePhase.multiplier;
    return {
      normal: Math.round(rawPrice),
      earlyBird: Math.round(rawPrice * 0.85),
      lastMinute: Math.round(rawPrice * 1.30),
      resident: Math.round(rawPrice * 0.80),
      student: Math.round(rawPrice * 0.60)
    };
  };

  return (
    <div id="pricing-tarifs-page" className="py-12 px-4 md:px-8 max-w-6xl mx-auto min-h-[800px] animate-slide-up">
      
      {/* 1. EN-TÊTE DE SECTION */}
      <div className="text-center mb-10" id="pricing-section-header">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#fbbf24] bg-[#fbbf24]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
          💰 Guide des Grilles Tarifaires
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">
          Billetterie & Tarifs 🎫
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
          Tous les prix en Dirhams Marocains (MAD) — Remises résidents et étudiants disponibles.
        </p>
      </div>

      {/* 2. SÉLECTEUR DE PHASE */}
      <div className="mb-8" id="phase-tabs-selector">
        <span className="block text-zinc-500 text-[10px] font-mono uppercase tracking-widest text-center mb-4">
          Sélectionnez la Phase du Tournoi
        </span>
        
        {/* Horizontal scrollable tab layout */}
        <div className="flex overflow-x-auto pb-2 justify-start md:justify-center items-center gap-2 md:gap-3 scrollbar-none snap-x select-none">
          {MATRICES_PHASES.map((phase) => {
            const isActive = activePhaseId === phase.id;
            return (
              <button
                key={phase.id}
                id={`tab-phase-${phase.id}`}
                onClick={() => {
                  setActivePhaseId(phase.id);
                  setSelectedMobileCell(null);
                }}
                className={`px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 snap-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 relative ${
                  isActive 
                    ? 'bg-[#34d399] text-[#0a0a0a] shadow-[0_4px_12px_rgba(52,211,153,0.3)]' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{phase.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white rounded-full" />
                )}
                <span className="text-[9px] block opacity-60 font-mono tracking-tight font-normal lowercase mt-0.5">
                  (x{phase.multiplier.toFixed(1)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TABLEAU TARIFAIRE */}
      <div className="mb-10" id="pricing-matrix-table">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Info className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="hidden sm:inline">Survoler (ou cliquer sur mobile) pour afficher les tarifs réduits</span>
            <span className="inline sm:hidden">Cliquer sur un prix pour voir les remises</span>
          </div>
          <span className="font-mono text-zinc-500 uppercase text-[10px]">Coef : {activePhase.label} (x{activePhase.multiplier})</span>
        </div>

        {/* Glassmorphic Responsive Container */}
        <div className="glass-panel rounded-2xl border border-zinc-800 bg-[#0d0d0f]/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800/80 text-[10px] md:text-xs font-display uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-4 md:px-6 font-black">Stade</th>
                  <th className="py-4 px-3 font-bold text-center">Cat. 1 (VIP)</th>
                  <th className="py-4 px-3 font-bold text-center">Cat. 2 (Centrale)</th>
                  <th className="py-4 px-3 font-bold text-center">Cat. 3 (Latérale)</th>
                  <th className="py-4 px-3 font-bold text-center text-emerald-400">Cat. 4 (Populaire)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/45">
                {STADIUM_TARIFS_DATA.map((stad, stadIdx) => (
                  <tr key={stadIdx} className="hover:bg-zinc-900/20 transition-all">
                    
                    {/* Stadium title cell */}
                    <td className="py-4 px-4 md:px-6">
                      <div className="font-display font-extrabold text-white text-xs md:text-sm">{stad.name}</div>
                      <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#34d399]" /> {stad.city}
                      </div>
                    </td>

                    {/* Columns containing prices and tooltips */}
                    {stad.basePrices.map((base, catIdx) => {
                      const computed = calculateDiscountedPrices(base);
                      const isSelectedOnMobile = selectedMobileCell?.stadiumIndex === stadIdx && selectedMobileCell?.colIndex === catIdx;
                      
                      return (
                        <td 
                          key={catIdx} 
                          tabIndex={0}
                          role="button"
                          aria-label={`Tarifs pour ${stad.name}, Catégorie ${catIdx + 1}`}
                          onClick={() => {
                            if (selectedMobileCell?.stadiumIndex === stadIdx && selectedMobileCell?.colIndex === catIdx) {
                              setSelectedMobileCell(null);
                            } else {
                              setSelectedMobileCell({ stadiumIndex: stadIdx, colIndex: catIdx });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (selectedMobileCell?.stadiumIndex === stadIdx && selectedMobileCell?.colIndex === catIdx) {
                                setSelectedMobileCell(null);
                              } else {
                                setSelectedMobileCell({ stadiumIndex: stadIdx, colIndex: catIdx });
                              }
                            }
                          }}
                          className="py-4 px-2 text-center relative group cursor-pointer transition-colors hover:bg-zinc-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-lg"
                        >
                          <div className="font-mono font-black text-[#fbbf24] text-xs md:text-base">
                            {formatNumber(computed.normal)} <span className="text-[9px] font-normal text-zinc-500">MAD</span>
                          </div>
                          
                          {/* Indicator dot */}
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 hover:bg-[#fbbf24] mx-auto mt-1 transition-all" />

                          {/* Hover Tooltip - Absolute floating card */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-950/95 border border-zinc-700/60 backdrop-blur-md rounded-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-[10.5px] font-mono text-left z-30 pointer-events-none transition-all duration-200 ${
                            isSelectedOnMobile 
                              ? 'block opacity-100 scale-100' 
                              : 'hidden group-hover:block opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                          }`}>
                            {/* Speech bubble pointer bottom */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-950" />

                            <div className="pb-1.5 border-b border-zinc-800 text-[11px] font-bold text-white uppercase flex justify-between items-center">
                              <span>Tarifs Ajustés</span>
                              <span className="text-zinc-500 text-[9px]">Cat. {catIdx + 1}</span>
                            </div>

                            <div className="space-y-1.5 pt-2">
                              {/* Tarifs standard */}
                              <div className="flex justify-between items-center text-zinc-350">
                                <span>Plein Tarif :</span>
                                <strong className="text-white">{formatNumber(computed.normal)} MAD</strong>
                              </div>

                              {/* Early Bird */}
                              <div className="flex justify-between items-center text-zinc-400">
                                <span>Early Bird (-15%) :</span>
                                <span className="text-[#34d399] font-bold">{formatNumber(computed.earlyBird)} MAD</span>
                              </div>

                              {/* Last minute */}
                              <div className="flex justify-between items-center text-zinc-400">
                                <span>Last Minute (+30%) :</span>
                                <span className="text-[#f87171] font-bold">{formatNumber(computed.lastMinute)} MAD</span>
                              </div>

                              {/* Resident */}
                              <div className="flex justify-between items-center text-zinc-400 border-t border-zinc-900 pt-1.5">
                                <span className="flex items-center gap-1">🇲🇦 Résident (-20%) :</span>
                                <span className="text-[#fbbf24] font-bold">{formatNumber(computed.resident)} MAD</span>
                              </div>

                              {/* Student */}
                              <div className="flex justify-between items-center text-zinc-400">
                                <span className="flex items-center gap-1">🎓 Étudiant (-40%) :</span>
                                <span className="text-sky-400 font-bold">
                                  {/* Student is -40% only on Cat 3/4. For Cat 1/2 indicate they are not student discountable or calculate anyway with asterick */}
                                  {catIdx >= 2 ? (
                                    `${formatNumber(computed.student)} MAD`
                                  ) : (
                                    <span className="text-[8.5px] text-zinc-500 font-normal">Non éligible</span>
                                  )}
                                </span>
                              </div>
                            </div>

                            <p className="text-[8px] text-zinc-500 mt-2 border-t border-zinc-900 pt-1 leading-tight text-center">
                              *Tarifs applicables pour {activePhase.label}
                            </p>
                          </div>

                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* 4. ENCADRÉ REMISES SPÉCIALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10" id="special-discounts">
        
        {/* Resident discount card */}
        <div className="glass-panel bg-[#121915]/50 border border-[#34d399]/30 rounded-2xl p-5 relative overflow-hidden flex gap-4">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-bold text-7xl font-sans pointer-events-none text-[#34d399]">🇲🇦</div>
          <div className="w-11 h-11 rounded-xl bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center text-[#34d399] shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-white text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
              <span>🇲🇦</span> Remise Résidents
            </h4>
            <p className="text-xs text-zinc-300 leading-normal mb-2">
              <span className="text-[#34d399] font-bold">-20% sur tous les billets</span> du tournoi. 
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-black/40 border border-[#34d399]/25 text-[10px] text-zinc-400 font-mono">
              Présentez votre CIN ou carte de résident marocaine au guichet d'accès.
            </span>
          </div>
        </div>

        {/* Student discount card */}
        <div className="glass-panel bg-[#12161b]/50 border border-sky-500/30 rounded-2xl p-5 relative overflow-hidden flex gap-4">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-bold text-7xl font-sans pointer-events-none text-sky-400">🎓</div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-white text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
              <span>🎓</span> Remise Étudiants
            </h4>
            <p className="text-xs text-zinc-300 leading-normal mb-2">
              <span className="text-sky-400 font-bold">-40% sur la Cat. 3 & Cat. 4</span> pour encourager la jeunesse.
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-black/40 border border-sky-500/20 text-[10px] text-zinc-400 font-mono">
              Présentez votre carte étudiante valide (nationale ou ISIC).
            </span>
          </div>
        </div>

      </div>

      {/* 5. STATISTIQUES DE VENTE (barre de progression) */}
      <div className="glass-panel rounded-2xl border border-zinc-800 p-6 mb-10 text-left bg-zinc-950/40" id="sales-statistics-stage">
        
        <div className="flex justify-between items-center mb-5 border-b border-zinc-900 pb-3">
          <div>
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#34d399]" />
              <span>Réserve de Ventes des Stades (Mise à Jour En Direct)</span>
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ESTIMATION DES TICKETS ÉMIS SUR LE TOTAL DES PLACES DISPONIBLES</p>
          </div>
          <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-400">LIVE SYSTEM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {STADIUM_TARIFS_DATA.map((stad, idx) => {
            const percent = parseFloat(((stad.sold / stad.capacity) * 100).toFixed(1));
            return (
              <div key={idx} className="space-y-1.5 py-1">
                
                {/* Information row */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-200 font-bold truncate pr-2" title={stad.name}>{stad.name}</span>
                  <span className="font-mono text-zinc-400 text-[11px] shrink-0">
                    <strong>{formatNumber(stad.sold)}</strong> / {formatNumber(stad.capacity)} <span className="text-[#34d399] font-black">({percent}%)</span>
                  </span>
                </div>

                {/* Simulated Graphical Progress Bar */}
                <div className="w-full h-2.5 bg-zinc-900/90 rounded-full overflow-hidden border border-zinc-850 relative flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-[#34d399] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                    style={{ width: `${percent}%` }}
                  />
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 6. BOUTON D'ACTION */}
      <div className="text-center" id="coming-soon-buy-button">
        
        {/* Centered CTA area */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-zinc-900/30 border border-zinc-855 flex flex-col items-center justify-center gap-4 text-center">
          
          {/* Action button requested exactly */}
          <div className="relative w-full group">
            <button
              type="button"
              disabled
              className="w-full py-3.5 rounded-xl bg-zinc-805/80 border border-zinc-800 text-zinc-500 font-display font-bold text-xs uppercase tracking-widest cursor-not-allowed select-none flex items-center justify-center gap-2"
            >
              <span>Acheter des billets (bientôt disponible)</span>
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-zinc-900 text-[#fbbf24] font-bold border border-zinc-800 uppercase tracking-tight">
                Coming soon
              </span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 font-mono leading-normal">
            La phase officielle de distribution ouvrira à l'automne 2029 via le système d'accord FIFA. 
            <br />
            <button
              onClick={onNavigateToBooking}
              className="mt-2 text-[#34d399] hover:text-emerald-300 font-bold underline cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <span>Tester le simulateur de réservation en direct</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

