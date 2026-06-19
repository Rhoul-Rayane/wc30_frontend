"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  ChevronDown, 
  Globe, 
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Flame,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { DEMO_MATCHES, OFFICIAL_STADIUMS } from '@/lib/types';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Animated numbers state for Section 4 (Chiffres Clés)
  const [stats, setStats] = useState({
    matchs: 0,
    stades: 0,
    volontaires: 0,
    nations: 0
  });

  // Start animated counters on mount
  useEffect(() => {
    const targetMatchs = 48;
    const targetStades = 6;
    const targetVolontaires = 5000;
    const targetNations = 32;

    const duration = 2000; // 2 seconds animation
    const stepTime = 30; // 30ms interface updates
    const steps = duration / stepTime;
    let currentStep = 0;

    const statsInterval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setStats({
          matchs: targetMatchs,
          stades: targetStades,
          volontaires: targetVolontaires,
          nations: targetNations
        });
        clearInterval(statsInterval);
      } else {
        const progress = currentStep / steps;
        // Ease out quadratic
        const ease = 1 - Math.pow(1 - progress, 2);
        setStats({
          matchs: Math.floor(ease * targetMatchs),
          stades: Math.floor(ease * targetStades),
          volontaires: Math.floor(ease * targetVolontaires),
          nations: Math.floor(ease * targetNations)
        });
      }
    }, stepTime);

    // June 14, 2030 Countdown
    const targetDate = new Date('2030-06-14T20:00:00').getTime();
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(countdownInterval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const scrollToMatches = () => {
    const matchesElem = document.getElementById('prochains-matchs');
    if (matchesElem) {
      matchesElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0a0a0a]">
      {/* 1. HERO SECTION (Plein écran 100vh) */}
      <section 
        id="hero-screen" 
        className="relative min-h-screen flex flex-col justify-between items-center px-4 md:px-8 overflow-hidden moroccan-grid hero-gradient z-10"
      >
        {/* Subtle Moroccan islamic geometric star pattern overlay at 5% opacity */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 overflow-hidden mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="islamic-mosaic-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 80 40 L 40 80 L 0 40 Z" fill="none" stroke="#34d399" strokeWidth="1" />
              <path d="M 40 15 L 65 40 L 40 65 L 15 40 Z" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="8" fill="none" stroke="#34d399" strokeWidth="0.5" />
              <path d="M0 0 L80 80 M80 0 L0 80" stroke="#34d399" strokeWidth="0.3" opacity="0.4" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#islamic-mosaic-pattern)" />
          </svg>
        </div>

        {/* Visual elegant decorative central background star */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none z-0">
          <svg width="450" height="450" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 L64 36 L100 50 L64 64 L50 100 L36 64 L0 50 L36 36 Z" fill="#34d399" />
          </svg>
        </div>

        {/* Dummy spacing helper for vertical flex spacing */}
        <div className="h-20" />

        {/* Center Contents */}
        <div className="max-w-4xl mx-auto text-center z-10 animate-slide-up flex flex-col justify-center items-center my-auto">
          {/* Subtitle with spaced tracking and custom green emerald color */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#34d399] uppercase select-none flex items-center gap-1">
              <span>🇲🇦</span> MAROC • ESPAGNE • PORTUGAL <span>🇪🇸</span>
            </span>
          </div>

          {/* Off-white Outfit Display Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-zinc-100 mb-6 uppercase select-none">
            Coupe du Monde <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] via-[#fbbf24] to-[#34d399] drop-shadow-[0_2px_10px_rgba(52,211,153,0.15)] bg-size-200">
              FIFA 2030
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-sans font-light">
            Découvrez la splendeur du premier mondial unifié reliant deux continents. Bienvenue au cœur de l'hospitalité et de la passion sportive inégalée du Royaume du Maroc.
          </p>

          {/* Majestic Countdown Clocks */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl w-full mx-auto mb-10 select-none">
            {[
              { label: "Jours", value: timeLeft.days },
              { label: "Heures", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Secondes", value: timeLeft.seconds }
            ].map((clockItem, clockIdx) => (
              <div 
                key={clockIdx} 
                className="glass-panel hover-glow rounded-2xl py-3 sm:py-4 px-2 sm:px-4 flex flex-col items-center justify-center transition-all border border-zinc-800/80 bg-zinc-900/45"
              >
                <span className="text-2xl sm:text-4xl font-display font-black text-[#fbbf24] tracking-tight">
                  {String(clockItem.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 mt-1">
                  {clockItem.label}
                </span>
              </div>
            ))}
          </div>

          {/* Action Call to Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <button 
              id="hero-explore-btn"
              onClick={scrollToMatches}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:shadow-[0_4px_30px_rgba(52,211,153,0.5)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explorer les Matchs</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Pulsing down chevron pointer at the bottom */}
        <div className="pb-8 pt-4 z-10">
          <button 
            id="hero-scroll-trigger"
            onClick={scrollToMatches}
            title="Faire défiler vers le bas"
            className="p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-[#34d399] hover:text-emerald-300 transition-all select-none animate-bounce flex items-center justify-center cursor-pointer shadow-lg hover:shadow-emerald-500/10"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </section>

      {/* 2. SECTION "PROCHAINS MATCHS" */}
      <section 
        id="prochains-matchs" 
        className="w-full py-20 px-4 md:px-8 border-t border-zinc-900/85 bg-zinc-950/40 relative"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#34d399] bg-[#34d399]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#34d399]/20">
              ⚽ Calendrier Sélectif
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-3 uppercase tracking-tight">
              PROCHAINS MATCHS HISTORIQUES
            </h2>
            <div className="w-16 h-1 bg-[#34d399] mx-auto mt-4 rounded-full" />
            <p className="text-sm text-zinc-400 max-w-md mx-auto mt-3">
              Vivez les ouvertures mythiques et affiches majeures d'ores et déjà planifiées pour le tourbillon de 2030.
            </p>
          </div>

          {/* Cards Grid: 3 columns on desktop, stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {DEMO_MATCHES.slice(0, 3).map((match) => (
              <div 
                key={match.id}
                className="glass-panel hover-glow rounded-3xl p-6 relative flex flex-col justify-between border border-zinc-800/80 bg-zinc-900/30 overflow-hidden"
              >
                {/* Popularity/Featured Match tag */}
                {match.isPopular && (
                  <div className="absolute top-0 right-0 bg-[#fbbf24] text-black text-[9px] font-bold uppercase px-4 py-1.5 rounded-bl-2xl font-mono flex items-center gap-1">
                    <Flame size={10} className="fill-black" />
                    <span>POPULAIRE</span>
                  </div>
                )}

                <div>
                  {/* Tournament Phase Badge */}
                  <div className="mb-4">
                    <span className="inline-block py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/25">
                      {match.phase}
                    </span>
                  </div>

                  {/* Duel flags display row */}
                  <div className="flex items-center justify-around py-4 border-b border-zinc-800/50 mb-4 select-none">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-4xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">{match.homeFlag}</span>
                      <span className="text-sm sm:text-base font-bold text-white tracking-wide font-display">{match.homeTeam}</span>
                    </div>

                    {/* VS divider */}
                    <div className="text-base font-extrabold text-[#fbbf24] font-mono tracking-widest px-1">
                      VS
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-4xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">{match.awayFlag}</span>
                      <span className="text-sm sm:text-base font-bold text-white tracking-wide font-display">{match.awayTeam}</span>
                    </div>
                  </div>

                  {/* Stadium, city & dates schedule with emojis */}
                  <div className="space-y-2.5 text-xs text-zinc-400 font-sans mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm select-none">🏟️</span>
                      <span className="font-medium text-zinc-300">{match.stadium} • {match.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm select-none">📅</span>
                      <span className="font-mono text-zinc-300">{match.date} à {match.time}</span>
                    </div>
                  </div>
                </div>

                {/* View details button redirects user */}
                <button 
                  onClick={() => onNavigate('matchs')}
                  className="w-full py-3 bg-transparent border border-[#34d399] text-[#34d399] hover:bg-[#34d399] hover:text-[#0a0a0a] font-display font-medium text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Voir détails</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION "NOS STADES" */}
      <section 
        id="stades-section" 
        className="w-full py-20 px-4 md:px-8 border-t border-zinc-950/90 relative bg-[#09090b]/80"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24] bg-[#fbbf24]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#fbbf24]/20">
              🏟️ Temples d'Échelle Royale
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-3 uppercase tracking-tight">
              NOS STADES EXCEPTIONNELS
            </h2>
            <div className="w-16 h-1 bg-[#fbbf24] mx-auto mt-4 rounded-full" />
            <p className="text-sm text-zinc-400 max-w-md mx-auto mt-3">
              Découvrez les 6 enceintes d'élite marocaines réaménagées ou érigées pour accueillir le ballon rond international.
            </p>
          </div>

          {/* Stadium Cards: Scroll horizontal on mobile, 3x2 grid on desktop */}
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-6 scroll-smooth snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 select-none scrollbar-thin">
            {OFFICIAL_STADIUMS.map((stadium) => (
              <div 
                key={stadium.id}
                className="min-w-[290px] w-[82%] sm:w-[325px] md:w-full flex-shrink-0 snap-center glass-panel rounded-3xl overflow-hidden relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(52,211,153,0.18)] hover:border-[#34d399]/40 flex flex-col justify-between border border-zinc-800/80 bg-gradient-to-t from-zinc-950 via-zinc-900 to-zinc-900/30"
              >
                {/* Stadium Top Graphic Arch */}
                <div className="relative h-44 bg-gradient-to-br from-emerald-950/40 to-zinc-900 flex items-center justify-center overflow-hidden border-b border-zinc-800/40">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_4px_12px_rgba(52,211,153,0.25)]">{stadium.image}</span>
                  
                  {/* Phase availability indicator tag */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold font-mono ${stadium.progress === "Prêt" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {stadium.progress}
                    </span>
                  </div>
                </div>

                {/* Stadium content details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-white text-base sm:text-lg mb-1 line-clamp-1 group-hover:text-[#34d399] transition-colors">
                      {stadium.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#fbbf24] font-semibold tracking-wider font-mono mb-2 uppercase">
                      {stadium.highlight}
                    </p>
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-normal line-clamp-3">
                      {stadium.description}
                    </p>
                  </div>

                  {/* Ville + capacité en chiffres d'or en bas de la carte */}
                  <div className="border-t border-zinc-800/60 pt-3 mt-4 flex items-center justify-between text-[11px] sm:text-xs font-mono">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <MapPin size={12} className="text-[#34d399]" />
                      <span>{stadium.city}</span>
                    </div>
                    <div className="text-[#fbbf24] font-bold flex items-center gap-1">
                      <span>🎟️</span>
                      <span>{stadium.capacity.toLocaleString('fr-FR')} places</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION "CHIFFRES CLÉS" */}
      <section 
        id="stats-section" 
        className="w-full py-16 px-4 md:px-8 bg-zinc-950 border-t border-zinc-900/80 relative"
      >
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards Rows */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 select-none">
            {/* 48 Matchs */}
            <div className="glass-panel hover-glow rounded-3xl p-5 md:p-6 text-center border border-zinc-800/80 bg-zinc-900/20">
              <span className="text-3xl md:text-4xl block mb-2 filter drop-shadow">⚽</span>
              <div className="text-3xl md:text-5xl font-display font-black text-[#fbbf24] tracking-tight">
                {stats.matchs}
              </div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
                MATCHS PLANIFIÉS
              </div>
            </div>

            {/* 6 Stades */}
            <div className="glass-panel hover-glow rounded-3xl p-5 md:p-6 text-center border border-zinc-800/80 bg-zinc-900/20">
              <span className="text-3xl md:text-4xl block mb-2 filter drop-shadow">🏟️</span>
              <div className="text-3xl md:text-5xl font-display font-black text-[#fbbf24] tracking-tight">
                {stats.stades}
              </div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
                STADES OFFICIELS
              </div>
            </div>

            {/* 5 000+ Volontaires */}
            <div className="glass-panel hover-glow rounded-3xl p-5 md:p-6 text-center border border-zinc-800/80 bg-zinc-900/20">
              <span className="text-3xl md:text-4xl block mb-2 filter drop-shadow">👥</span>
              <div className="text-3xl md:text-5xl font-display font-black text-[#fbbf24] tracking-tight">
                {stats.volontaires.toLocaleString('fr-FR')}+
              </div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
                VOLONTAIRES REQUIS
              </div>
            </div>

            {/* 32 Nations */}
            <div className="glass-panel hover-glow rounded-3xl p-5 md:p-6 text-center border border-zinc-800/80 bg-zinc-900/20">
              <span className="text-3xl md:text-4xl block mb-2 filter drop-shadow">🌍</span>
              <div className="text-3xl md:text-5xl font-display font-black text-[#fbbf24] tracking-tight">
                {stats.nations}
              </div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
                NATIONS QUALIFIÉES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION CTA "REJOINDRE L'AVENTURE" */}
      <section 
        id="cta-join" 
        className="w-full py-20 px-4 md:px-8 bg-gradient-to-r from-zinc-900 via-emerald-950/20 to-zinc-900 border-t border-zinc-900/80 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none select-none">
          <svg width="250" height="250" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 L64 36 L100 50 L64 64 L50 100 L36 64 L0 50 L36 36 Z" fill="#34d399" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <span className="text-xs font-bold text-[#34d399] tracking-[0.2em] uppercase bg-[#34d399]/10 border border-[#34d399]/20 rounded-full px-4 py-1.5 inline-block mb-4">
            🙌 Ambassadeurs de la Nation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-2">
            Rejoindre l'Aventure
          </h2>
          <p className="text-[#34d399] text-base sm:text-lg font-medium tracking-wide mb-3">
            Deviens volontaire pour la Coupe du Monde 2030
          </p>
          <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed mb-10">
            Rejoins des milliers de bénévoles du monde entier pour faire briller l'hospitalité unique du Maroc et vivre de l’intérieur l'excellence du plus prestigieux tournoi planétaire.
          </p>

          {/* 2 Buttons côte à côte */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button 
              onClick={() => onNavigate('volontaires')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 hover:scale-[1.03] transition-all duration-300 shadow-lg cursor-pointer"
            >
              S'inscrire comme volontaire
            </button>
            <button 
              onClick={() => onNavigate('tarifs')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest bg-transparent border border-[#34d399] text-[#34d399] hover:bg-[#34d399]/10 transition-all duration-300 cursor-pointer"
            >
              Consulter les tarifs
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer 
        id="home-footer" 
        className="w-full bg-[#0a0a0a] border-t border-zinc-900/90 py-12 px-6 md:px-12 relative"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 text-left">
          
          {/* Col 1: Logo & brand description */}
          <div className="md:col-span-1">
            <span className="font-display font-black text-xl text-white flex items-center gap-1.5 select-none mb-3">
              WC 2030 <span className="text-[#34d399]">🏆</span>
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed font-light mb-4">
              Portail Officiel d'accréditation, billetterie d'élite et suivi opérationnel pour la Coupe du Monde FIFA 2030 au Maroc.
            </p>
            {/* Social media icons with premium animations */}
            <div className="flex gap-3.5 text-zinc-500">
              <a href="#" className="hover:text-[#34d399] transition-colors" title="Instagram"><Instagram size={16} /></a>
              <a href="#" className="hover:text-[#34d399] transition-colors" title="Facebook"><Facebook size={16} /></a>
              <a href="#" className="hover:text-[#34d399] transition-colors" title="Twitter"><Twitter size={16} /></a>
              <a href="#" className="hover:text-[#34d399] transition-colors" title="LinkedIn"><Linkedin size={16} /></a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="text-left">
            <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-[#34d399] pl-2">
              NAVIGATION
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {['matchs', 'stades', 'billets', 'volontaires'].map((tab) => (
                <li key={tab}>
                  <button 
                    onClick={() => onNavigate(tab)}
                    className="hover:text-[#34d399] transition-colors cursor-pointer capitalize text-left font-light"
                  >
                    {tab === 'matchs' ? 'Calendrier' : tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Host Nations details */}
          <div className="text-left">
            <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-[#fbbf24] pl-2">
              PAYS ORGANISATEURS
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5 font-light">🇲🇦 Royaume du Maroc</li>
              <li className="flex items-center gap-1.5 font-light">🇪🇸 Royaume d'Espagne</li>
              <li className="flex items-center gap-1.5 font-light">🇵🇹 République du Portugal</li>
            </ul>
          </div>

          {/* Col 4: Operations / Contact */}
          <div className="text-left">
            <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-zinc-700 pl-2">
              CONTACT & INFOS
            </h5>
            <div className="space-y-2.5 text-xs text-zinc-500 font-sans">
              <p className="font-light">Comité National d’Organisation FIFA 2030</p>
              <p className="font-light">Casablanca, Maroc</p>
              <p className="text-zinc-650 font-mono text-[10px] uppercase">PROJECT CODE: PFE MGSI 2026</p>
            </div>
          </div>
        </div>

        {/* Global bottom copyright signature */}
        <div className="max-w-6xl mx-auto border-t border-zinc-900/60 pt-6 text-center text-[10px] text-zinc-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2030 FIFA World Cup Morocco — Projet PFE MGSI | Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-all font-light">Accréditations Securitées</a>
            <span className="text-zinc-800">|</span>
            <a href="#" className="hover:text-white transition-all font-light">Conditions d'Utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

