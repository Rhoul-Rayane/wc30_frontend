"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEMO_MATCHES, TICKET_CATEGORIES, DISCOUNT_OPTIONS, Match, TicketCategory } from '@/lib/types';

interface TicketsSectionProps {
  initialSelectedMatch?: Match | null;
  onTicketGenerated: (ticketToken: string) => void;
  onNavigateToScanner: () => void;
}

export interface GeneratedTicket {
  id: string;
  holderName: string;
  matchId: string;
  matchSummary: string;
  stadium: string;
  city: string;
  dateTime: string;
  categoryName: string;
  quantity: number;
  discountType: string;
  basePrice: number;
  finalPrice: number;
  seatNumbers: string[];
  gate: string;
}

export default function TicketsSection({ 
  initialSelectedMatch, 
  onTicketGenerated,
  onNavigateToScanner 
}: TicketsSectionProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match>(DEMO_MATCHES[0]);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>(TICKET_CATEGORIES[2]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedDiscount, setSelectedDiscount] = useState<string>("discount-none");
  const [holderName, setHolderName] = useState<string>("");
  const [holderPhone, setHolderPhone] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [errorBox, setErrorBox] = useState<string>("");

  const [activeTicket, setActiveTicket] = useState<GeneratedTicket | null>(null);

  // Sync if came from reference
  useEffect(() => {
    if (initialSelectedMatch) {
      setSelectedMatch(initialSelectedMatch);
    }
  }, [initialSelectedMatch]);

  // Compute prices
  const baseUnitPrice = selectedCategory.priceMAD;
  const initialTotal = baseUnitPrice * quantity;

  const currentDiscount = DISCOUNT_OPTIONS.find(d => d.id === selectedDiscount) || DISCOUNT_OPTIONS[0];
  const deductionAmount = (initialTotal * currentDiscount.reductionPercent) / 100;
  const finalTotalPrice = initialTotal - deductionAmount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBox("");

    if (!holderName.trim()) {
      setErrorBox("Veuillez saisir le nom complet du détenteur principal.");
      return;
    }
    if (holderName.trim().length < 4) {
      setErrorBox("Le nom complet doit comporter au moins 4 caractères.");
      return;
    }
    if (!isAgreed) {
      setErrorBox("Vous devez accepter les conditions générales de vente de la FIFA 2030.");
      return;
    }

    // Generate simulated seats
    const seatPrefixIndex = TICKET_CATEGORIES.indexOf(selectedCategory);
    const alphabet = ["A", "B", "C", "D", "E", "F"];
    const seatsList = Array.from({ length: quantity }).map((_, i) => {
      const row = Math.floor(Math.random() * 20) + 1;
      const seat = Math.floor(Math.random() * 40) + 1;
      return `${alphabet[seatPrefixIndex] || "X"}-Row${row}-Siège${seat + i}`;
    });

    const gateList = ["Porte d'Or — A1", "Porte Émeraude — B4", "Porte Ouest — C3", "Porte Sud — D2"];
    const selectedGate = gateList[seatPrefixIndex] || "Porte Administrative";

    const ticketId = "WC30-" + Math.floor(100000 + Math.random() * 900000);

    const matchSummary = `${selectedMatch.homeFlag} ${selectedMatch.homeTeam} VS ${selectedMatch.awayTeam} ${selectedMatch.awayFlag}`;

    const newTicket: GeneratedTicket = {
      id: ticketId,
      holderName: holderName.trim(),
      matchId: selectedMatch.id,
      matchSummary,
      stadium: selectedMatch.stadium,
      city: selectedMatch.city,
      dateTime: `${selectedMatch.date} à ${selectedMatch.time}`,
      categoryName: selectedCategory.name,
      quantity,
      discountType: currentDiscount.name,
      basePrice: baseUnitPrice,
      finalPrice: finalTotalPrice,
      seatNumbers: seatsList,
      gate: selectedGate
    };

    setActiveTicket(newTicket);

    // Encode string to send to Scanner
    const serialized = JSON.stringify({
      id: newTicket.id,
      holder: newTicket.holderName,
      match: newTicket.matchSummary,
      stadium: newTicket.stadium,
      cat: newTicket.categoryName,
      qty: newTicket.quantity,
      price: newTicket.finalPrice,
      seats: newTicket.seatNumbers.join(', '),
      gate: newTicket.gate,
      status: "VALIDE",
      verified: false
    });

    // Invoke state update
    onTicketGenerated(serialized);
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
          🎫 Billetterie Securisée
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-3">
          RÉSERVEZ VOS PLACES
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
          Sélectionnez votre match d'exception, choisissez votre catégorie de tribune et appliquez les tarifs préférentiels résidents/étudiants agréés.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reservation form block */}
        <div className="lg:col-span-7">
          <form onSubmit={handleBookingSubmit} className="glass-panel rounded-2xl p-6 border border-zinc-700/30 flex flex-col gap-5">
            <h3 className="text-lg font-display font-extrabold text-[#34d399] border-b border-zinc-800/80 pb-3 uppercase flex items-center gap-2">
              📝 Formulaire de Commande
            </h3>

            {/* Error alerts */}
            {errorBox && (
              <div className="p-3 bg-red-400/10 border border-red-500/40 text-[#f87171] rounded-xl text-xs font-medium uppercase tracking-wide">
                <span>⚠️ Erreur :</span> {errorBox}
              </div>
            )}

            {/* Step 1: Sélection Match */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                1. Match Sélectionné
              </label>
              <select
                id="ticket-match-select"
                value={selectedMatch.id}
                onChange={(e) => {
                  const m = DEMO_MATCHES.find(dm => dm.id === e.target.value);
                  if (m) setSelectedMatch(m);
                }}
                className="w-full px-3 py-3 rounded-xl bg-black/45 border border-zinc-700/60 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer"
              >
                {DEMO_MATCHES.map((match) => (
                  <option key={match.id} value={match.id} disabled={match.homeTeam === 'TBD'} className="bg-[#121214]">
                    {match.homeFlag} {match.homeTeam} VS {match.awayTeam} {match.awayFlag} — {match.city} ({match.date})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                Lieu : {selectedMatch.stadium}, {selectedMatch.city} — {selectedMatch.date} à {selectedMatch.time}
              </p>
            </div>

            {/* Step 2: Choisir Catégorie */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3 font-display">
                2. Catégorie de Tarif
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="categories-grid">
                {TICKET_CATEGORIES.map((category) => {
                  const isSelected = selectedCategory.id === category.id;
                  return (
                    <div
                      id={`ticket-cat-${category.id}`}
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`glass-panel border rounded-xl p-3.5 cursor-pointer hover-glow text-left transition-all ${
                        isSelected
                          ? "border-[#34d399] bg-[#34d399]/5"
                          : "border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white mb-0.5 line-clamp-1">{category.name.split(' / ')[1]}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-[#fbbf24] font-bold md:whitespace-nowrap font-mono shrink-0">
                          {category.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-tight mb-2.5">
                        {category.description}
                      </p>
                      <span className="text-sm font-display font-black text-[#fbbf24]">
                        {category.priceMAD} <span className="text-[10px] font-normal text-zinc-400">MAD</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Quantité & Réduction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                  3. Quantité de Billets
                </label>
                <div className="flex items-center gap-3">
                  <button
                    id="qty-decrement"
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-[#34d399]/20 hover:text-[#34d399] border border-zinc-700/40 font-bold active:scale-95 transition-all text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span id="ticket-qty-display" className="text-lg font-mono font-bold text-white w-8 text-center bg-black/45 py-1.5 border border-zinc-800 rounded-lg">
                    {quantity}
                  </span>
                  <button
                    id="qty-increment"
                    type="button"
                    onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-[#34d399]/20 hover:text-[#34d399] border border-zinc-700/40 font-bold active:scale-95 transition-all text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Limite max de 10 places par transaction.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                  4. Réduction applicable
                </label>
                <select
                  id="ticket-discount-select"
                  value={selectedDiscount}
                  onChange={(e) => setSelectedDiscount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/45 border border-zinc-700/60 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer"
                >
                  {DISCOUNT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#121214]">
                      {opt.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">{currentDiscount.description}</p>
              </div>
            </div>

            {/* Holder information */}
            <div className="pt-2 border-t border-zinc-800/80">
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                5. Informations Détenteur Principal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <input
                  id="holder-name-input"
                  type="text"
                  placeholder="Nom & Prénom"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/45 border border-zinc-700/60 text-white focus:outline-none focus:border-[#33d399] transition-all text-xs"
                />
                <input
                  id="holder-phone-input"
                  type="tel"
                  placeholder="N° Mobile (Ex: +212...)"
                  value={holderPhone}
                  onChange={(e) => setHolderPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/45 border border-zinc-700/60 text-white focus:outline-none focus:border-[#33d399] transition-all text-xs"
                />
              </div>
            </div>

            {/* Price statement & Agreement */}
            <div className="bg-[#121214]/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-2 font-mono">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Prix unitaire ({quantity}x) :</span>
                <span>{baseUnitPrice} MAD</span>
              </div>
              {deductionAmount > 0 && (
                <div className="flex justify-between text-xs text-[#f87171]">
                  <span>Remise ({currentDiscount.reductionPercent}%) :</span>
                  <span>-{deductionAmount.toLocaleString()} MAD</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-white pt-2 border-t border-zinc-800/80">
                <span className="font-display">TOTAL À PAYER :</span>
                <span className="text-base text-[#fbbf24]">{finalTotalPrice.toLocaleString()} MAD</span>
              </div>

              <div className="flex items-start gap-2.5 mt-3 pt-3 border-t border-zinc-800/40">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 rounded accent-[#34d399] bg-black border-zinc-700 focus:ring-[#34d399] focus:ring-offset-[#0a0a0a]"
                />
                <span className="text-[10px] text-zinc-500 leading-tight">
                  Je certifie l'exactitude des informations encodées et accepte sans réserves le règlement intérieur des stades FIFA Coupe du Monde 2030.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <button
              id="buy-btn"
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-sm uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              🔒 Payer & Générer mon Billet
            </button>
          </form>
        </div>

        {/* Generated dynamic ticket preview */}
        <div className="lg:col-span-5">
          {activeTicket ? (
            <div className="flex flex-col gap-4 animate-slide-up">
              {/* Receipt Alert */}
              <div className="p-3 bg-[#34d399]/10 border border-[#34d399]/40 text-[#34d399] rounded-xl text-xs font-semibold uppercase tracking-wide text-center">
                🎉 Réservation validée avec succès !
              </div>

              {/* The Holographic Ticket Card */}
              <div className="glass-panel rounded-2xl border border-[#fbbf24]/50 overflow-hidden relative shadow-[0_0_30px_rgba(251,191,36,0.12)]">
                {/* Micro holographic visual details */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#34d399] via-[#fbbf24] to-[#34d399]" />
                
                {/* Background watermarked star */}
                <div className="absolute -bottom-8 -right-8 opacity-5 w-48 h-48 select-none pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#fbbf24]">
                    <path d="M50 0 L64 36 L100 50 L64 64 L50 100 L36 64 L0 50 L36 36 Z" />
                  </svg>
                </div>

                {/* Ticket Header */}
                <div className="p-5 border-b border-zinc-800 text-center relative bg-[#121214]/50">
                  <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest block mb-0.5">
                    🌟 BILLET OFFICIEL DE MATCH
                  </span>
                  <div className="font-display font-black text-white text-base tracking-wider uppercase">
                    FIFA WORLD CUP 2300 <span className="text-[#34d399]">Morocco</span>
                  </div>
                  <span className="absolute top-4 right-4 text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                    AUTHENTIQUE
                  </span>
                </div>

                {/* Middle match block */}
                <div className="p-5 flex flex-col items-center border-b border-dashed border-zinc-800 relative">
                  {/* Circle punches (simulate tickets) */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0a0a] border-r border-zinc-800" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0a0a] border-l border-zinc-800" />

                  <span className="text-xs font-mono font-bold bg-[#34d399]/10 text-[#34d399] px-2.5 py-1 rounded mb-3">
                    🎟️ N° : {activeTicket.id}
                  </span>

                  <span className="text-lg md:text-xl font-display font-black text-white text-center mb-1">
                    {activeTicket.matchSummary}
                  </span>

                  <span className="text-xs text-[#fbbf24] font-mono font-bold uppercase mb-4">
                    📢 {activeTicket.dateTime}
                  </span>

                  <div className="w-full text-xs text-zinc-400 space-y-1 bg-black/35 border border-zinc-800 rounded-lg p-3">
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Stade :</span> 
                      <span className="text-white font-semibold">{activeTicket.stadium}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Ville-Hôte :</span> 
                      <span className="text-white italic">{activeTicket.city}, Maroc</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Accès Porte :</span> 
                      <span className="text-[#fbbf24] font-bold">{activeTicket.gate}</span>
                    </p>
                    <p className="flex justify-between border-t border-zinc-800/40 pt-1 mt-1">
                      <span className="text-zinc-500">Catégorie :</span> 
                      <span className="text-white text-[10px] font-mono font-bold">{activeTicket.categoryName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Détenteur :</span> 
                      <span className="text-white font-semibold">{activeTicket.holderName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Quantité :</span> 
                      <span className="text-white font-bold">{activeTicket.quantity} places</span>
                    </p>
                    <p className="flex justify-between text-xs border-t border-zinc-800/40 pt-1 mt-1">
                      <span className="text-zinc-500 font-bold">Total Réglé :</span> 
                      <span className="text-[#34d399] font-bold">{activeTicket.finalPrice.toLocaleString()} MAD</span>
                    </p>
                  </div>
                </div>

                {/* Simulated QR & Barcode Section */}
                <div className="p-5 flex flex-col items-center bg-white/3">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">
                    SCAN D'ACCÈS NOMINATIF INDIVIDUEL
                  </span>

                  {/* QR Core simulation visual */}
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center border-4 border-[#34d399]/30 relative mb-3">
                    <div className="relative w-full h-full bg-slate-900 rounded flex flex-wrap p-0.5 overflow-hidden justify-center items-center">
                      {/* Generates a nice retro QR-pattern grid using a looping matrix */}
                      <span className="text-[7px] text-emerald-400 leading-none select-none font-mono text-center block tracking-tighter opacity-80 break-all p-1 h-full font-bold">
                        {`0101-${activeTicket.id}-48-FIFA30-RES-${activeTicket.holderName.replace(/\s+/g, '')}-SECURE-HASH-F871-34D3-FBBF-MAROC`}
                      </span>
                      {/* Corners markers */}
                      <div className="absolute top-1 left-1 w-3.5 h-3.5 bg-emerald-400 border border-black" />
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border border-black" />
                      <div className="absolute bottom-1 left-1 w-3.5 h-3.5 bg-emerald-400 border border-black" />
                    </div>
                  </div>

                  {/* Seat details */}
                  <div className="text-center font-mono text-xs mb-3 text-zinc-400">
                    <span className="font-bold text-white">Sièges assignés :</span>{" "}
                    <span className="text-[#fbbf24] font-bold text-[10px]">
                      {activeTicket.seatNumbers.join(", ")}
                    </span>
                  </div>

                  {/* Simulated barcode */}
                  <div className="w-full h-10 flex items-stretch gap-[1.5px] bg-black/60 rounded px-2.5 py-1.5 justify-center mb-1">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, idx) => (
                      <div key={idx} className="bg-white" style={{ width: `${w * 1.5}px` }} />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500">
                    *SECURE-UUID-{activeTicket.id}-SHA256*
                  </span>
                </div>
              </div>

              {/* Magical shortcut button to load ticket in scanner */}
              <button
                id="preload-scanner-btn"
                onClick={() => {
                  onNavigateToScanner();
                }}
                className="w-full py-2.5 rounded-xl bg-[#fbbf24] text-[#0a0a0a] hover:bg-[#fbbf24]/90 font-display font-semibold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)] active:scale-[0.98]"
              >
                📲 Envoyer ce billet vers le scanneur QR 💥
              </button>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 border border-zinc-800 border-dashed text-center text-zinc-500 min-h-[460px] flex flex-col justify-center items-center">
              <div className="text-5xl mb-3 animate-pulse">🎟️</div>
              <h4 className="text-base font-display font-bold text-white mb-1.5 uppercase">Aucun billet généré</h4>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Remplissez les informations de réservation à gauche pour payer virtuellement et recevoir votre badge d'accès officiel sécurisé en format numérique.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

