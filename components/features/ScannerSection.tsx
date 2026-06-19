"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  User, 
  History, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Building, 
  MapPin, 
  Calendar, 
  Cpu,
  RefreshCw,
  AlertOctagon,
  ChevronDown
} from 'lucide-react';

interface ScannerSectionProps {
  lastGeneratedTicketToken?: string;
}

export interface HistoryScanItem {
  id: string;
  time: string;
  type: 'Billet' | 'Badge';
  name: string;
  result: 'SUCCESS' | 'DENIED';
  details: string;
}

export default function ScannerSection({ lastGeneratedTicketToken }: ScannerSectionProps) {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState<'billet' | 'badge' | 'refus' | null>(null);
  const [shakePanel, setShakePanel] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Scans history state initialized with realistic starter logs
  const [scanHistory, setScanHistory] = useState<HistoryScanItem[]>([
    { id: "BADGE-FIFA-011", time: "11:42:01", type: "Badge", name: "Jean-Pierre Blanc", result: "SUCCESS", details: "Staff FIFA — Accès VIP" },
    { id: "TK-2030-8114", time: "11:39:15", type: "Billet", name: "Sophia Martinez", result: "SUCCESS", details: "Maroc vs Espagne — Cat 1" },
    { id: "TK-2030-9902", time: "11:35:50", type: "Billet", name: "Marc Dupont", result: "DENIED", details: "Badge expiré" },
    { id: "BADGE-SEC-402", time: "11:30:12", type: "Badge", name: "Rachid Amrani", result: "SUCCESS", details: "Sécurité Terrain" },
  ]);

  // Parse if we have a ticket purchased in the ticketing tab
  let purchasedTicket: any = null;
  if (lastGeneratedTicketToken) {
    try {
      purchasedTicket = JSON.parse(lastGeneratedTicketToken);
    } catch (e) {
      purchasedTicket = null;
    }
  }

  // Audio Synthesizer beep feedback via Web Audio API 
  const playSynthesizedBeep = (isSuccess: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isSuccess) {
        // High frequency double beep for successful validation
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        
        // Second pitch
        setTimeout(() => {
          const ctx2 = new AudioCtx();
          const osc2 = ctx2.createOscillator();
          const gain2 = ctx2.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1109, ctx2.currentTime); // C#6 note
          gain2.gain.setValueAtTime(0.12, ctx2.currentTime);
          osc2.start();
          osc2.stop(ctx2.currentTime + 0.15);
        }, 130);
      } else {
        // Lower dramatic buzz sound for denied access
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime); // Lower buzzer tone
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (err) {
      console.warn("Audio Context beep initialization failed:", err);
    }
  };

  // Run simulation procedure
  const handleSimulateScan = (type: 'billet' | 'badge' | 'refus') => {
    if (scanning) return;
    setScanning(true);
    setScanType(null);
    setShakePanel(false);

    // Simulate viewfinder analysis & server handshaking
    setTimeout(() => {
      setScanning(false);
      setScanType(type);
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      if (type === 'billet') {
        playSynthesizedBeep(true);
        // Prep record
        const tName = purchasedTicket?.holder || "Ahmed El Fassi";
        const tMatch = purchasedTicket?.match || "🇲🇦 Maroc vs 🇧🇷 Brésil";
        const newLog: HistoryScanItem = {
          id: purchasedTicket?.id || "TK-2030-00042",
          time: timeStr,
          type: "Billet",
          name: tName,
          result: "SUCCESS",
          details: tMatch
        };
        setScanHistory(prev => [newLog, ...prev.slice(0, 4)]);
      } 
      
      else if (type === 'badge') {
        playSynthesizedBeep(true);
        const newLog: HistoryScanItem = {
          id: "BADGE-PRESS-782",
          time: timeStr,
          type: "Badge",
          name: "Maria Santos",
          result: "SUCCESS",
          details: "Média — FIFA Services"
        };
        setScanHistory(prev => [newLog, ...prev.slice(0, 4)]);
      } 
      
      else if (type === 'refus') {
        playSynthesizedBeep(false);
        setShakePanel(true);
        
        // Randomly select negative motif for richness
        const motifs = ["Badge expiré", "Badge révoqué", "Zone non autorisée"];
        const chosenMotif = motifs[Math.floor(Math.random() * motifs.length)];
        
        const newLog: HistoryScanItem = {
          id: "BADGE-ERR-990",
          time: timeStr,
          type: "Badge",
          name: "Utilisateur Suspect",
          result: "DENIED",
          details: chosenMotif
        };
        setScanHistory(prev => [newLog, ...prev.slice(0, 4)]);
      }
    }, 1200);
  };

  return (
    <section className="py-10 px-4 md:px-8 max-w-4xl mx-auto min-h-[750px] animate-slide-up" id="scanner-management-page">
      
      {/* 1. EN-TÊTE COMPACT */}
      <div className="text-center mb-8" id="scanner-compact-header">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-1 rounded-full font-bold">
            🔒 Dispositif de Sécurité Coupe du Monde 2030
          </span>
          <button 
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all text-[11px] font-mono flex items-center gap-1.5"
            title="Activer/Désactiver le bip sonore de numérisation"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="text-[#34d399]">BIP ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-zinc-600">MUET</span>
              </>
            )}
          </button>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-2 tracking-tight">
          Scanner d'Accès 🔒
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Outil officiel de contrôle biométrique et d'accréditation des tourniquets d'entrée pour les agents de terrain.
        </p>
      </div>

      {/* Main Container tailored for rugged security look & mobile-first scaling */}
      <div className="max-w-[430px] mx-auto bg-[#0d0d0f] rounded-3xl border border-zinc-800/90 shadow-2xl p-4 md:p-6 overflow-hidden relative">
        
        {/* Top Device Notch Header Aesthetic */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-4 bg-zinc-955 rounded-b-xl border border-t-0 border-zinc-800 flex justify-center items-[2px]">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        </div>

        {/* 2. ZONE DE SCAN (Center Viewport - 1:1 format) */}
        <div className="relative w-full aspect-square bg-[#070708] rounded-2xl border border-zinc-900 flex flex-col items-center justify-center overflow-hidden mb-6" id="viewfinder-scan-frame">
          
          {/* Neon emerald scanning border overlay tracking corners */}
          <div className="absolute inset-4 pointer-events-none">
            {/* Corner Bracket TL */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-[3.5px] border-l-[3.5px] border-[#34d399] rounded-tl-xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
            {/* Corner Bracket TR */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-[3.5px] border-r-[3.5px] border-[#34d399] rounded-tr-xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
            {/* Corner Bracket BL */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3.5px] border-l-[3.5px] border-[#34d399] rounded-bl-xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
            {/* Corner Bracket BR */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3.5px] border-r-[3.5px] border-[#34d399] rounded-br-xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
          </div>

          {/* Sweep Laser Beam line */}
          {scanning && (
            <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent shadow-[0_0_15px_rgba(52,211,153,0.9)] z-20 animate-sweep-laser" />
          )}

          {/* Matrix matrix overlay for grid styling */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Inner Content Display */}
          <div className="text-center p-4 z-10 space-y-3">
            <div className={`w-16 h-16 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center mx-auto transition-transform duration-300 ${
              scanning ? 'scale-110 border-[#34d399]/40 bg-[#34d399]/5' : ''
            }`}>
              {scanning ? (
                <RefreshCw className="w-8 h-8 text-[#34d399] animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-[#34d399] animate-pulse" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                {scanning ? "Lecture cryptologique..." : "Appareil photo actif"}
              </p>
              <p className="text-[10.5px] text-zinc-400 font-mono tracking-wide max-w-[200px] mx-auto">
                {scanning ? "Interrogation de la base FIFA..." : "Pointez la caméra vers le QR code"}
              </p>
            </div>
          </div>

          {/* Corner Watermark */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1 opacity-40 select-none">
            <Cpu className="w-3 h-3 text-[#34d399]" />
            <span className="text-[8px] font-mono tracking-widest text-zinc-500 font-bold uppercase">ACCÈS EN SERVICE</span>
          </div>

        </div>

        {/* CONTROLS AREA: Three quick interactive simulation triggers */}
        <div className="space-y-2.5 mb-6" id="simulation-scanners-controls">
          <span className="block text-[10px] uppercase font-mono tracking-widest text-[#fbbf24] font-bold text-left mb-1.5 pl-1 col-span-2">
            📊 Simuler un scan d'une cible :
          </span>

          <div className="grid grid-cols-1 gap-2">
            
            {/* 1. Ticket Valide button */}
            <button
              type="button"
              disabled={scanning}
              onClick={() => handleSimulateScan('billet')}
              className="py-3 px-4 rounded-xl border border-[#34d399]/30 bg-[#34d399]/5 hover:bg-[#34d399]/15 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 select-none active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🎫</span>
                <span>Simuler scan (Billet Valide)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#34d399]/25 text-[#34d399] font-black uppercase">
                OK
              </span>
            </button>

            {/* 2. Accreditation Accreditation Button */}
            <button
              type="button"
              disabled={scanning}
              onClick={() => handleSimulateScan('badge')}
              className="py-3 px-4 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 select-none active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🛡️</span>
                <span>Simuler scan (Accréditation)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-sky-500/20 text-sky-400 font-black uppercase">
                Badge
              </span>
            </button>

            {/* 3. Refusé Button */}
            <button
              type="button"
              disabled={scanning}
              onClick={() => handleSimulateScan('refus')}
              className="py-3 px-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-[red]/15 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 select-none active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">❌</span>
                <span>Simuler scan (Accès Refusé)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-400 font-black uppercase">
                Bloquer
              </span>
            </button>

          </div>
        </div>

        {/* RESULTS PANELS: Bottom glassmorphic sheet overlay */}
        <div className="relative mt-2" id="scan-results-panel">
          
          {/* Active outcome rendering */}
          {scanType === 'billet' && (
            <div className="glass-panel rounded-2xl border border-[#34d399]/40 bg-[#101915]/80 overflow-hidden shadow-2xl relative animate-slide-up-fast">
              
              {/* Green layout banner */}
              <div className="bg-[#34d399] text-[#0a0a0a] py-2.5 px-4 font-display font-black tracking-widest uppercase text-center text-xs flex justify-center items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 fill-[#0a0a0a] text-[#34d399]" />
                <span>✅ BILLET VALIDÉ</span>
              </div>

              {/* Data values content */}
              <div className="p-4 space-y-3 text-xs">
                
                <div className="flex justify-between items-center border-b border-[#34d399]/20 pb-2">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">N° BILLET</span>
                  <span className="font-mono font-black text-white bg-black/40 px-2.5 py-1 rounded text-[11px] border border-zinc-800">
                    {purchasedTicket?.id || "TK-2030-00042"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-0.5">Rencontre du tournoi</span>
                    <span className="text-white font-extrabold text-[11px]">
                      {purchasedTicket?.match || "🇲🇦 Maroc vs 🇧🇷 Brésil"}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-0.5">Stade d'accueil</span>
                    <span className="text-white font-bold leading-tight block">
                      {purchasedTicket?.stadium || "Grand Stade Hassan II, Casablanca"}
                    </span>
                  </div>

                  <div className="col-span-2 border-t border-zinc-800/60 pt-2 flex justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-0.5">Catégorie & Siège</span>
                      <span className="text-[#fbbf24] font-bold">
                        {purchasedTicket?.cat || "Tribune Centrale — Catégorie 2"}
                        {purchasedTicket?.seats ? ` (Siège ${purchasedTicket.seats})` : ""}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-0.5">Accès désigné</span>
                      <span className="text-[#34d399] font-mono font-bold uppercase">
                        {purchasedTicket?.gate || "Porte d'Or — A"}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-zinc-800/60 pt-2 flex justify-between items-center">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-0.5">Détenteur légal</span>
                      <span className="text-white font-bold block">{purchasedTicket?.holder || "Ahmed El Fassi"}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 text-[#34d399] font-mono font-bold text-[9px] uppercase animate-pulse flex items-center gap-1">
                      Scanné ✅
                    </span>
                  </div>

                </div>

                {/* Date-time stamp */}
                <div className="border-t border-[#34d399]/20 pt-2 text-[9px] font-mono text-zinc-500 text-center flex justify-between items-center">
                  <span>DISPOSITIF : SCANNER-MOBILE-A12</span>
                  <span>SCAN CLOTURÉ : IL Y A UN INSTANT</span>
                </div>

              </div>
            </div>
          )}

          {/* 4. RESULT SHOWN — BADGE ACCRÉDITATION */}
          {scanType === 'badge' && (
            <div className="glass-panel rounded-2xl border border-sky-500/40 bg-[#0e1724]/80 overflow-hidden shadow-2xl relative animate-slide-up-fast">
              
              {/* Blue layout banner */}
              <div className="bg-sky-500 text-[#0a0a0a] py-2.5 px-4 font-display font-black tracking-widest uppercase text-center text-xs flex justify-center items-center gap-1.5 shadow-md">
                <span className="text-sm">🔵</span>
                <span>BADGE ACCRÉDITATION</span>
              </div>

              {/* Data values content */}
              <div className="p-4 space-y-3.5 text-xs">
                
                {/* Visual user photo placeholder */}
                <div className="flex items-center gap-3.5 bg-black/40 p-3 rounded-xl border border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-sky-500 flex items-center justify-center text-zinc-500 font-bold overflow-hidden">
                    <User className="w-6 h-6 text-zinc-400" />
                  </div>
                  
                  <div className="text-left space-y-0.5">
                    <p className="text-sm font-black text-white">Maria Santos</p>
                    <p className="text-[10px] font-mono text-sky-400 flex items-center gap-1">
                      <Building className="w-3 h-3" /> FIFA Media Services
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase">Catégorie</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#34d399]/20 border border-[#34d399]/50 text-[#34d399] text-[9.5px] font-extrabold uppercase inline-block mt-0.5">
                      Média / Presse
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase">N° Accréditation</span>
                    <span className="font-mono font-bold text-white block mt-0.5">BADGE-PRESS-782</span>
                  </div>

                  <div className="col-span-2 border-t border-zinc-800/60 pt-2">
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase mb-1">Zones autorisées</span>
                    <div className="flex flex-wrap gap-1">
                      {["Tribune presse", "Zone mixte", "Salle conférence"].map(zone => (
                        <span key={zone} className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-mono text-[9px] font-bold">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-zinc-800/60 pt-2 flex justify-between text-[10px]">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-400 block uppercase">VALIDITÉ COMPÉTITION</span>
                      <span className="text-zinc-300 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-sky-400" /> 14 Juin 2030 — 13 Juillet 2030
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[9px] text-zinc-400 block">STATUT DE VALIDATION</span>
                      <span className="text-[#34d399] font-bold uppercase block mt-0.5">Activé ✔</span>
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-zinc-800/60 pt-2 bg-black/20 p-2 rounded-lg flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-500">Total Scans : <strong className="text-white">12</strong></span>
                    <span className="text-zinc-400">Dernier scan : <strong className="text-white">il y a 3 minutes</strong></span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* 5. RESULT SHOWN — ACCESS DENIED (Vibrate shake layout effect) */}
          {scanType === 'refus' && (
            <div className={`glass-panel rounded-2xl border border-red-500/40 bg-[#1f0f12]/80 overflow-hidden shadow-2xl relative ${
              shakePanel ? 'animate-vibrate-error' : ''
            }`}>
              
              {/* Red layout banner */}
              <div className="bg-red-500 text-white py-2.5 px-4 font-display font-black tracking-widest uppercase text-center text-xs flex justify-center items-center gap-1.5 shadow-md">
                <AlertOctagon className="w-4 h-4 text-white" />
                <span>❌ ACCÈS REFUSÉ</span>
              </div>

              {/* Data values content */}
              <div className="p-5 text-center space-y-4 text-xs">
                
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block tracking-widest">MOTIF DU REFUS SIGNALÉ</span>
                  <p className="text-red-400 text-base font-display font-black uppercase tracking-wider">
                    {scanHistory[0]?.details || "Badge expiré"}
                  </p>
                  <p className="text-[10.5px] text-zinc-400 max-w-[280px] mx-auto leading-normal font-sans pt-1">
                    Veuillez retenir le porteur et appeler l'officier de surveillance mobile du secteur.
                  </p>
                </div>

                <div className="border-t border-red-500/20 pt-2.5 text-[9.5px] font-mono text-zinc-500 flex justify-between items-center">
                  <span>DISPOSITIF : BLOCK-GATE-09</span>
                  <span className="text-red-400 font-bold">ALERTE TOURNIQUET</span>
                </div>

              </div>
            </div>
          )}

          {/* Fallback frame if no scan simulated yet */}
          {!scanType && !scanning && (
            <div className="p-8 text-center bg-black/25 rounded-2xl border border-dashed border-zinc-800 text-zinc-400">
              <span className="text-4xl mb-2.5 block animate-bounce">🔳</span>
              <h4 className="text-xs font-display font-extrabold text-white mb-1 uppercase tracking-wider">
                Aucun scan effectué
              </h4>
              <p className="text-[10.5px] text-zinc-500 font-mono leading-normal max-w-[240px] mx-auto">
                Appuyez sur un bouton de simulation ci-dessus pour lancer le decryptage instantané.
              </p>
            </div>
          )}

        </div>

        {/* 6. HISTORIQUE DES SCANS (Real-time tabular tracker history) */}
        <div className="mt-6 pt-5 border-t border-zinc-900 text-left" id="scanners-logs-ledger">
          
          <div className="flex items-center justify-between mb-3.5 pl-1">
            <h3 className="text-[11px] font-display font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Historique des Scans (5 derniers)</span>
            </h3>
            <span className="text-[9px] font-mono text-zinc-500">LEDGER LIVE</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black/45 overflow-hidden text-xs font-mono">
            
            {/* Header elements list */}
            <div className="grid grid-cols-12 gap-1.5 p-2 bg-zinc-900 text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              <span className="col-span-2">Heure</span>
              <span className="col-span-3">Type</span>
              <span className="col-span-5">Nom Porteur</span>
              <span className="col-span-2 text-right">Etat</span>
            </div>

            {/* List entries */}
            <div className="divide-y divide-zinc-900 max-h-[170px] overflow-y-auto">
              {scanHistory.map((log, index) => (
                <div key={index} className="grid grid-cols-12 gap-1.5 p-2 items-center hover:bg-zinc-850/40 transition-all text-[11px]">
                  
                  {/* Time */}
                  <span className="col-span-2 text-zinc-400">{log.time}</span>
                  
                  {/* Badge or Ticket */}
                  <span className={`col-span-3 font-bold truncate ${
                    log.type === 'Billet' ? 'text-[#fbbf24]' : 'text-sky-400'
                  }`}>
                    {log.type === 'Billet' ? '🎫 Billet' : '🛡️ Badge'}
                  </span>

                  {/* Name holding */}
                  <span className="col-span-5 text-white font-medium truncate" title={log.name}>
                    {log.name}
                  </span>

                  {/* Outcome status and label */}
                  <span className="col-span-2 text-right">
                    {log.result === 'SUCCESS' ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#34d399]/10 text-[#34d399] text-[9.5px] font-black">
                        OK
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9.5px] font-black">
                        KO
                      </span>
                    )}
                  </span>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Customized Keyframes animations injected directly for high fidelity */}
      <style>{`
        @keyframes sweepLaser {
          0% { top: 4%; opacity: 0.1; }
          15% { opacity: 0.95; }
          85% { opacity: 0.95; }
          100% { top: 96%; opacity: 0.1; }
        }
        
        @keyframes vibrateError {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        .animate-sweep-laser {
          animation: sweepLaser 1.8s ease-in-out infinite;
        }

        .animate-vibrate-error {
          animation: vibrateError 0.35s ease-in-out;
        }

        .animate-slide-up-fast {
          animation: slideUpFast 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUpFast {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

