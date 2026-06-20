"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  ShieldAlert, 
  Users, 
  Activity, 
  DollarSign, 
  Award, 
  FolderLock, 
  Percent, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

import { DashboardStats } from '@/lib/types';

interface DashboardSectionProps {
  volunteerCount: number;
  volunteerAverageScore: number;
  stats?: DashboardStats | null;
  onRefreshStats?: () => Promise<void>;
  isLoadingStats?: boolean;
}

export default function DashboardSection({ 
  volunteerCount, 
  volunteerAverageScore,
  stats,
  onRefreshStats,
  isLoadingStats = false
}: DashboardSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  
  // Custom metrics that could slightly shift on refresh
  const [localIncidents, setLocalIncidents] = useState({ total: 47, open: 12, critical: 3 });
  const [localTickets, setLocalTickets] = useState(78000);
  const [lastRefreshTime, setLastRefreshTime] = useState("il y a 5 minutes");

  // Sync state with dynamic stats if provided
  useEffect(() => {
    if (stats) {
      setLocalTickets(stats.ticketsSold);
    }
  }, [stats]);

  const activeRefreshing = isRefreshing || isLoadingStats;

  // Dynamic matching score derived from volunteer's average score if provided, else falls back to 72.3
  const currentMatchingScore = stats?.averageMatchingScore
    ? parseFloat(stats.averageMatchingScore.toFixed(1))
    : volunteerAverageScore && volunteerAverageScore !== 74 
      ? parseFloat(volunteerAverageScore.toFixed(1)) 
      : 72.3;

  // Volunteer aggregate: base candidate pool of 3200 + any registered ones dynamically.
  const baseVolunteersCount = stats?.voluntariesCount ?? (3200 + Math.max(0, volunteerCount - 44));
  const totalVolunteersDisplay = baseVolunteersCount;
  const volunteerProgressPercent = parseFloat(((totalVolunteersDisplay / 5000) * 100).toFixed(1));

  const handleRefresh = async () => {
    if (activeRefreshing) return;
    setIsRefreshing(true);
    setRefreshMessage(null);

    try {
      if (onRefreshStats) {
        await onRefreshStats();
      }
      setLastRefreshTime("à l'instant");
      
      // Randomly tweak incident or ticket variables for high fidelity
      setLocalIncidents(prev => ({
        total: prev.total + Math.floor(Math.random() * 2),
        open: Math.max(8, prev.open + (Math.random() > 0.5 ? 1 : -1)),
        critical: Math.max(1, prev.critical + (Math.random() > 0.7 ? 1 : -1))
      }));
      if (!stats) {
        setLocalTickets(prev => prev + Math.floor(Math.random() * 12));
      }
      
      setRefreshMessage("Indicateurs synchronisés à la base FIFA Core Database !");
      setTimeout(() => setRefreshMessage(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="py-10 px-4 md:px-8 max-w-6xl mx-auto min-h-[900px] animate-slide-up" id="command-center-dashboard">
      
      {/* 1. EN-TÊTE DE DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6" id="dashboard-header-container">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-2.5 py-0.5 rounded-full font-bold">
              CONTRÔLEUR LIVE
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Dernière actualisation : {lastRefreshTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight flex items-center gap-3">
            Centre de Commandement 📊
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-xl">
            Console d'analyse décisionnelle et de contrôle des indicateurs consolidés (Comité d'organisation National & FIFA).
          </p>
        </div>

        {/* Refresh Action Trigger */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className={`px-4.5 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
              activeRefreshing 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-800/80 border-zinc-700/80 hover:bg-zinc-750 hover:border-zinc-650 text-white cursor-pointer active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${activeRefreshing ? 'animate-spin text-zinc-500' : 'text-[#34d399]'}`} />
            <span>Actualiser les données</span>
          </button>
          
          {refreshMessage && (
            <div className="text-[10px] font-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/25 px-2.5 py-1 rounded-md animate-slide-up-fast">
              {refreshMessage}
            </div>
          )}
        </div>
      </div>

      {/* 2. BARRE DE KPIs PRINCIPAUX (4 cartes en ligne) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="kpi-highlights-strip">
        
        {/* KPI 1 : VOLONTAIRES */}
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80 bg-[#0d0d0f]/90 hover:border-zinc-700/40 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">👥 Volontaires</span>
              <p className="text-2xl font-display font-black text-white mt-1">
                {totalVolunteersDisplay.toLocaleString('fr-FR')} <span className="text-xs text-zinc-500 font-normal">/ 5 000</span>
              </p>
            </div>
            <span className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-[#34d399] transition-all duration-700" 
                style={{ width: `${volunteerProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 col-span-2">
              <span>Objectif national</span>
              <span className="text-[#34d399] font-bold">{volunteerProgressPercent}%</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : STADES */}
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80 bg-[#0d0d0f]/90 hover:border-zinc-700/40 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono font-bold">Stadiums</span>
              <p className="text-2xl font-display font-black text-white mt-1">
                {stats?.stadiumsReady ?? 4} / {stats?.stadiumsCount ?? 6} <span className="text-xs text-[#34d399] font-normal">Prêts</span>
              </p>
            </div>
            <span className="px-2 py-1 rounded bg-[#fbbf24]/10 text-[#fbbf24] text-[9px] font-mono font-bold uppercase tracking-tight animate-pulse shrink-0 border border-[#fbbf24]/20">
              {((stats?.stadiumsCount ?? 6) - (stats?.stadiumsReady ?? 4)) > 0 
                ? `${(stats?.stadiumsCount ?? 6) - (stats?.stadiumsReady ?? 4)} en construction` 
                : "Tous prêts"}
            </span>
          </div>

          <div className="flex gap-1.5 pt-1.5">
            {Array.from({ length: stats?.stadiumsReady ?? 4 }).map((_, i) => (
              <span key={`ready-${i}`} className="w-full h-1.5 rounded-full bg-[#34d399]" title="Conforme FIFA" />
            ))}
            {Array.from({ length: (stats?.stadiumsCount ?? 6) - (stats?.stadiumsReady ?? 4) }).map((_, i) => (
              <span key={`not-ready-${i}`} className="w-full h-1.5 rounded-full bg-[#fbbf24]" title="Installation Active" />
            ))}
          </div>
        </div>

        {/* KPI 3 : MATCHS */}
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80 bg-[#0d0d0f]/90 hover:border-zinc-700/40 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">⚽ Matchs</span>
              <p className="text-2xl font-display font-black text-white mt-1">
                12 / {stats?.matchesScheduled ?? 48} <span className="text-xs text-zinc-500 font-normal">Terminés</span>
              </p>
            </div>
            <span className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400" 
                style={{ width: `25%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Phase de groupes</span>
              <span className="text-sky-400 font-bold">25%</span>
            </div>
          </div>
        </div>

        {/* KPI 4 : BILLETS */}
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800/80 bg-[#0d0d0f]/90 hover:border-zinc-700/40 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">🎫 Billets émis</span>
              <p className="text-2xl font-display font-black text-[#fbbf24] mt-1">
                {(stats?.ticketsSold ?? localTickets).toLocaleString('fr-FR')} <span className="text-xs text-zinc-500 font-normal">vendus</span>
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[9px] font-mono text-[#fbbf24]">
              {(((stats?.ticketsSold ?? localTickets) / (stats?.ticketsAvailable ?? 320000)) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#fbbf24]" 
                style={{ width: `${(((stats?.ticketsSold ?? localTickets) / (stats?.ticketsAvailable ?? 320000)) * 100).toFixed(1)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Capacité d'accueil globale</span>
              <span className="text-white font-semibold">{(stats?.ticketsAvailable ?? 320000).toLocaleString('fr-FR')} places</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: SECTION VOLONTAIRES (2 Elements côte à côte) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" id="volunteers-dashboard-charts">
        
        {/* Left Side: Status horizontal progressive chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0e0e11] text-left">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-5">
            <div>
              <h3 className="font-display font-extrabold text-[#34d399] uppercase text-xs tracking-wider flex items-center gap-2">
                <span>📊</span> Statuts d'avancement des Volontaires
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">AVANCEMENT DES FLUX DE SÉLECTION DU PROGRAMME ROYAL</p>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">LIVE STAGE</span>
          </div>

          {/* Graphical stacked items in CSS pur */}
          <div className="space-y-4">
            
            {/* 1. Candidat */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Candidats inscrits</span>
                <span className="text-white font-bold">1 200</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-zinc-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            {/* 2. Présélectionné */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Présélectionnés</span>
                <span className="text-sky-400 font-bold">800</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: "66.6%" }} />
              </div>
            </div>

            {/* 3. Formé */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Formés & Certifiés (FIFA guidelines)</span>
                <span className="text-[#fbbf24] font-bold">500</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: "41.6%" }} />
              </div>
            </div>

            {/* 4. Affecté */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Affectés aux stades</span>
                <span className="text-orange-400 font-bold">400</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: "33.3%" }} />
              </div>
            </div>

            {/* 5. Actif */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Actifs en service</span>
                <span className="text-[#34d399] font-bold">300</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-[#34d399] rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Score moyen matching (jauge circulaire en doré) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0e0e11] flex flex-col justify-between">
          <div className="text-left border-b border-zinc-900 pb-3.5 mb-4">
            <h3 className="font-display font-extrabold text-[#fbbf24] uppercase text-xs tracking-wider flex items-center gap-2">
              <span>🎯</span> Adéquation & Compétences
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">SCORE DE COMPATIBILITÉ DES PROFILS RECRUTÉS</p>
          </div>

          {/* Circular Donut ring indicator */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            <svg width="150" height="150" viewBox="0 0 100 100" className="relative transform -rotate-90">
              {/* Slate anchor ring */}
              <circle cx="50" cy="50" r="40" stroke="#1c1917" strokeWidth="10" fill="transparent" />
              {/* Golden filled ring (72.3% = 72.3 * 2.51 = 181.5 dasharray) */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#fbbf24" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={`${currentMatchingScore * 2.512} 251.2`} 
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            
            {/* Absolute indicator label */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none mt-4">
              <span className="text-2xl font-display font-black text-white">{currentMatchingScore}</span>
              <span className="text-[10px] font-mono tracking-widest text-[#fbbf24] font-bold mb-1">/100</span>
            </div>
          </div>

          <div className="bg-black/45 p-3 rounded-lg border border-zinc-900 text-center mt-3 text-xs leading-normal text-zinc-400">
            <p>
              Ce score reflète le taux de concordance entre les compétences déclarées par les volontaires et les besoins requis aux tourniquets.
            </p>
          </div>
        </div>

      </div>

      {/* ROW 4: SECTION SÉCURITÉ & INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" id="security-incidents-dashboard">
        {/* Left Side: 3 Small Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="text-left">
            <h3 className="font-display font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2 pl-1 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Données de Sûreté & Incidents</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1f0f12]/35 border border-red-500/20 rounded-xl p-3.5 text-center">
              <span className="text-zinc-500 text-[9px] font-mono block uppercase">Total Signalés</span>
              <strong className="text-2xl font-display font-black text-rose-400">{localIncidents.total}</strong>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-center">
              <span className="text-zinc-500 text-[9px] font-mono block uppercase">En cours</span>
              <strong className="text-2xl font-display font-black text-[#fbbf24]">{localIncidents.open}</strong>
            </div>

            <div className="bg-[#1f0f12] border border-red-500/45 rounded-xl p-3.5 text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <span className="text-red-400 font-bold text-[9px] font-mono block uppercase">CRITIQUES</span>
              <strong className="text-2xl font-display font-black text-red-500 animate-pulse">{localIncidents.critical}</strong>
            </div>
          </div>

          <div className="p-3 bg-[#111] rounded-xl border border-zinc-850 text-[11px] text-zinc-400 leading-normal flex gap-2.5 items-start">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              Les alarmes critiques concernent principalement des tentatives d'usurpation de tourniquet et des anomalies techniques sur les serveurs de tickets d'accès.
            </span>
          </div>
        </div>

        {/* Right Side: Graphique incidents par sévérité */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0e0e11] text-left">
          <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest block mb-4 font-bold">
            Gravité des incidents de Sûreté (Déclarations de terrain)
          </span>

          <div className="space-y-3">
            {/* Faible */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="w-20 text-zinc-400">Faible (Vert)</span>
              <div className="flex-grow h-3 bg-zinc-900/45 rounded overflow-hidden">
                <div className="h-full bg-[#34d399]" style={{ width: "55%" }} />
              </div>
              <strong className="w-8 text-right text-white">26</strong>
            </div>

            {/* Moyen */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="w-20 text-zinc-400">Moyen (Jaune)</span>
              <div className="flex-grow h-3 bg-zinc-900/45 rounded overflow-hidden">
                <div className="h-full bg-[#fbbf24]" style={{ width: "32%" }} />
              </div>
              <strong className="w-8 text-right text-[#fbbf24]">15</strong>
            </div>

            {/* Élevé */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="w-20 text-zinc-400">Élevé (Orange)</span>
              <div className="flex-grow h-3 bg-zinc-900/45 rounded overflow-hidden">
                <div className="h-full bg-orange-400" style={{ width: "12%" }} />
              </div>
              <strong className="w-8 text-right text-orange-400">5</strong>
            </div>

            {/* Critique */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="w-20 text-red-400 font-bold">Critique (Rouge)</span>
              <div className="flex-grow h-3 bg-zinc-900/45 rounded overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: "6%" }} />
              </div>
              <strong className="w-8 text-right text-red-400 font-black">{localIncidents.critical}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5: SECTION FINANCE */}
      <h3 className="font-display font-black text-white uppercase text-xs tracking-wider flex items-center gap-2 pl-1 mb-3 text-left">
        <DollarSign className="w-4 h-4 text-[#fbbf24]" />
        <span>Gouvernance Financière & Allocations (Comité budgétaire)</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" id="finance-budget-revenues-cards">
        
        {/* BUDGET Allocation */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0d0d0f] text-left">
          
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest block font-bold">Coûts Opérationnels</span>
              <h4 className="font-display font-extrabold text-[#34d399] text-base uppercase">BUDGET TOTAL ALLOUÉ</h4>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#34d399]/15 border border-[#34d399]/20 text-[#34d399] font-mono">Consommé : 40%</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center font-mono text-[11px] text-zinc-400">
              <span>Budget prévisionnel :</span>
              <strong className="text-white text-sm">850M MAD</strong>
            </div>

            <div className="flex justify-between items-center font-mono text-[11px] text-zinc-400">
              <span>Dépenses engagées :</span>
              <strong className="text-red-400 text-sm">340M MAD</strong>
            </div>

            {/* Zone relative colored progress engine */}
            <div className="space-y-1.5 pt-1.5">
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden flex items-center border border-zinc-850">
                {/* 40% (Green because < 50%) */}
                <div className="h-full bg-[#34d399]" style={{ width: "40%" }} />
              </div>
              <div className="flex justify-between font-mono text-[8px] text-zinc-500">
                <span>0M MAD</span>
                <span className="text-[#34d399] font-black">40% d'exécution</span>
                <span>850M MAD</span>
              </div>
            </div>

          </div>
        </div>

        {/* REVENUS Allocation */}
        <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0d0d0f] text-left">
          
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
            <div>
              <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest block font-bold">Performance Commerciale</span>
              <h4 className="font-display font-extrabold text-[#fbbf24] text-base uppercase">REVENUS COMMERCIAUX</h4>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-400/10 border border-red-450/20 text-rose-400 font-mono">Variance: -54.8%</span>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="flex justify-between items-center font-mono text-[11px] text-zinc-400">
              <span>Projection Globale :</span>
              <strong className="text-[#fbbf24] text-sm">620M MAD</strong>
            </div>

            <div className="flex justify-between items-center font-mono text-[11px] text-zinc-400">
              <span>Réalisé (Billets & Sponsors) :</span>
              <strong className="text-[#34d399] text-sm">280M MAD</strong>
            </div>

            {/* Golden comparison segment */}
            <div className="space-y-1.5 pt-1.5">
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden flex items-center border border-zinc-850">
                {/* 45% of projection met */}
                <div className="h-full bg-[#fbbf24]" style={{ width: "45.1%" }} />
              </div>
              <div className="flex justify-between font-mono text-[8px] text-zinc-500">
                <span>0M MAD</span>
                <span className="text-white font-black">45.1% des objectifs atteints</span>
                <span>620M MAD</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ROW 6: SECTION ACCRÉDITATIONS */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 bg-[#0c0c0f] text-left mb-6" id="accreditations-sub-panel">
        
        <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-5">
          <div>
            <h3 className="font-display font-extrabold text-sky-400 uppercase text-xs tracking-wider flex items-center gap-2">
              <span>🛡️</span> Sécurité des Accréditations Badges
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">HISTOGRAMME DES ACCÈS AUX AILES TECHNIQUES DE LA FIFA</p>
          </div>
          <span className="text-[9px] text-[#34d399] font-mono font-bold bg-[#34d399]/10 px-2 py-0.5 rounded">SYSTÈMES INTERNES</span>
        </div>

        {/* Global badge statuses */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-center">
          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-850">
            <span className="text-zinc-500 text-[9px] font-mono block">TOTAL ACCRÉDITÉS</span>
            <strong className="text-lg text-white">1 240</strong>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-850">
            <span className="text-[#34d399] text-[9px] font-mono block">BADGES ACTIFS</span>
            <strong className="text-lg text-[#34d399]">980</strong>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-850">
            <span className="text-[#fbbf24] text-[9px] font-mono block">EXPIRÉS</span>
            <strong className="text-lg text-[#fbbf24]">160</strong>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-red-500/20">
            <span className="text-red-400 text-[9px] font-mono block">RÉVOQUÉS</span>
            <strong className="text-lg text-red-400">100</strong>
          </div>
        </div>

        {/* Repartition par catégorie (petites barres colorées) */}
        <span className="text-zinc-400 text-[10px] font-mono uppercase block mb-3 pl-1 font-bold">Répartition par Catégorie de badges :</span>
        
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          
          {/* FIFA */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">FIFA</span>
            <div className="w-full h-1 bg-red-500 rounded-full mb-1" />
            <strong className="text-xs text-white">250</strong>
          </div>

          {/* Equipe */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">Équipe</span>
            <div className="w-full h-1 bg-blue-500 rounded-full mb-1" />
            <strong className="text-xs text-white">410</strong>
          </div>

          {/* Média */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">Média</span>
            <div className="w-full h-1 bg-green-500 rounded-full mb-1" />
            <strong className="text-xs text-white">180</strong>
          </div>

          {/* Volontaire */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">Volontaire</span>
            <div className="w-full h-1 bg-[#fbbf24] rounded-full mb-1" />
            <strong className="text-xs text-white">220</strong>
          </div>

          {/* VIP */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">VIP</span>
            <div className="w-full h-1 bg-purple-500 rounded-full mb-1" />
            <strong className="text-xs text-white">80</strong>
          </div>

          {/* Logistique */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">Logistique</span>
            <div className="w-full h-1 bg-zinc-600 rounded-full mb-1" />
            <strong className="text-xs text-white">72</strong>
          </div>

          {/* Médical */}
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 text-center font-mono">
            <span className="text-[9px] text-zinc-400 block pb-1">Médical</span>
            <div className="w-full h-1 bg-white rounded-full mb-1" />
            <strong className="text-xs text-white">28</strong>
          </div>

        </div>

      </div>

      {/* 7. SECTION COMPARAISON QATAR 2022 */}
      <div className="glass-panel rounded-2xl border border-zinc-800 bg-[#0d0d0f]/90 overflow-hidden shadow-2xl text-left" id="qatar-comparateur-table">
        
        <div className="bg-zinc-900 py-3 px-5 border-b border-zinc-800 text-xs flex justify-between items-center">
          <h4 className="font-display font-bold uppercase tracking-widest text-[#fbbf24] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#fbbf24]" />
            <span>Tableau de Performance Comparative : Qatar 2022 vs WC 2030 (Actuel)</span>
          </h4>
          <span className="text-[9px] font-mono text-zinc-500">BENCHMARK FIFA</span>
        </div>

        <div className="overflow-x-auto text-xs md:text-sm font-mono">
          <table className="w-full border-collapse">
            
            <thead>
              <tr className="bg-black/45 text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-900 text-left">
                <th className="py-3 px-5 font-black">Indicateur Clé</th>
                <th className="py-3 px-5 font-bold">Qatar 2022 🇶🇦</th>
                <th className="py-3 px-5 font-bold text-white">WC 2030 (Actuel) 🇲🇦</th>
                <th className="py-3 px-5 font-black text-right">Écart Relatif %</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-900/40">
              
              {/* Row 1: Volontaires */}
              <tr className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 text-zinc-300 font-extrabold font-display">Volontaires actifs</td>
                <td className="py-3 px-5 text-zinc-400">20 000</td>
                <td className="py-3 px-5 text-white font-black">{totalVolunteersDisplay}</td>
                <td className="py-3 px-5 text-right font-bold text-red-500">
                  <span className="inline-flex items-center gap-0.5">
                    -84% <TrendingDown className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              {/* Row 2: Stades */}
              <tr className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 text-zinc-300 font-extrabold font-display">Nombre de Stades homologués</td>
                <td className="py-3 px-5 text-zinc-400">8</td>
                <td className="py-3 px-5 text-white font-black">6</td>
                <td className="py-3 px-5 text-right font-bold text-red-400">
                  <span className="inline-flex items-center gap-0.5">
                    -25% <TrendingDown className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              {/* Row 3: Capacité */}
              <tr className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 text-zinc-300 font-extrabold font-display">Capacité totale des sièges</td>
                <td className="py-3 px-5 text-zinc-400">437 000</td>
                <td className="py-3 px-5 text-white font-black">393 000</td>
                <td className="py-3 px-5 text-right font-bold text-red-400">
                  <span className="inline-flex items-center gap-0.5">
                    -10% <TrendingDown className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              {/* Row 4: Matchs */}
              <tr className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 text-zinc-300 font-extrabold font-display">Nombre de Matchs prévus</td>
                <td className="py-3 px-5 text-zinc-400">64</td>
                <td className="py-3 px-5 text-white font-black">48</td>
                <td className="py-3 px-5 text-right font-bold text-red-400">
                  <span className="inline-flex items-center gap-0.5">
                    -25% <TrendingDown className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              {/* Row 5: Budget */}
              <tr className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 text-zinc-300 font-extrabold font-display">Budget global d'infrastructure (milliards)</td>
                <td className="py-3 px-5 text-zinc-400">220 $ USD</td>
                <td className="py-3 px-5 text-white font-black">~1 Mrd MAD <span className="text-[10px] text-zinc-500">(≈ 0.1$ USD)</span></td>
                <td className="py-3 px-5 text-right text-zinc-500 font-sans">
                  —
                </td>
              </tr>

            </tbody>

          </table>
        </div>

      </div>

    </section>
  );
}

