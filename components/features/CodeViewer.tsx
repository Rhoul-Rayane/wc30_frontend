"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function CodeViewer() {
  const [copied, setCopied] = useState(false);

  const fullHTMLCode = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIFA World Cup 2030 | Maroc — Portail Officiel</title>
    <!-- Google Fonts: Outfit (Titres) & Inter (Corps de texte) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- Tailwind CSS modern CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        primaryEmerald: '#34d399',
                        accentAmber: '#fbbf24',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0a0a0a;
            color: #f4f4f5;
            overflow-x: hidden;
        }
        /* Glassmorphism rigoureux requis par la charte */
        .glass-panel {
            background: rgba(24, 24, 27, 0.60);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(63, 63, 70, 0.30);
        }
        /* Hover glow : les éléments cliquables émettent un halo vert émeraude au survol */
        .hover-glow {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-glow:hover {
            border-color: rgba(52, 211, 153, 0.45);
            box-shadow: 0 0 25px rgba(52, 211, 153, 0.15);
            transform: translateY(-2px);
        }
        /* Moroccan Tiling pattern */
        .moroccan-grid {
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.05) 1px, transparent 1px),
                radial-gradient(circle at 0 0, rgba(251, 191, 36, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
        }
        /* Gradient Hero vert sombre (#064e3b à 20% opacité) vers noir #0a0a0a */
        .hero-gradient {
            background: linear-gradient(to bottom, rgba(6, 78, 59, 0.22) 0%, rgba(10, 10, 10, 1) 100%);
        }
        /* Laser scanner line */
        @keyframes sweepLaser {
            0% { top: 0%; opacity: 0.1; }
            15% { opacity: 0.9; }
            85% { opacity: 0.9; }
            100% { top: 100%; opacity: 0.1; }
        }
        .laser-sweep {
            animation: sweepLaser 1.5s ease-in-out infinite;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
            background: #27272a;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #34d399;
        }
    </style>
</head>
<body class="font-sans antialiased text-zinc-100 flex flex-col min-h-screen justify-between relative">

    <!-- TOP NAVBAR (BARRE DE NAVIGATION FIXE) -->
    <nav class="fixed top-0 inset-x-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800/80 z-50 flex items-center justify-between px-6 md:px-12 select-none">
        <!-- Logo -->
        <a href="#" onclick="navigate('accueil')" class="font-display font-black text-lg text-white flex items-center gap-1">
            WC 2030 <span class="text-primaryEmerald">🏆</span>
        </a>
        <!-- Main Links -->
        <div class="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
            <button onclick="navigate('matchs')" class="hover:text-primaryEmerald cursor-pointer py-1 transition-all">Matchs</button>
            <button onclick="navigate('stades')" class="hover:text-primaryEmerald cursor-pointer py-1 transition-all">Stades</button>
            <button onclick="navigate('billets')" class="hover:text-primaryEmerald cursor-pointer py-1 transition-all">Billets</button>
            <button onclick="navigate('volontaires')" class="hover:text-primaryEmerald cursor-pointer py-1 transition-all">Volontaires</button>
            <button onclick="navigate('dashboard')" class="hover:text-primaryEmerald cursor-pointer py-1 transition-all">Dashboard</button>
        </div>
        <!-- Right Action Button / Scanner QR -->
        <button onclick="navigate('scanner')" title="Scanneur QR de Billets" class="hover:scale-110 cursor-pointer text-xl p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/60 transition-all flex items-center gap-1">
            <span class="text-sm font-semibold font-display text-white hidden sm:inline">Contrôle Accès</span> 🔲
        </button>
    </nav>

    <!-- MOBILE BOTTOM NAVIGATION (Responsive 375px helper) -->
    <div class="fixed bottom-0 inset-x-0 h-14 bg-black/95 backdrop-blur-md border-t border-zinc-800 z-50 flex md:hidden items-center justify-around text-xs text-zinc-500 font-semibold select-none px-4">
        <button onclick="navigate('matchs')" class="flex flex-col items-center gap-1 hover:text-primaryEmerald cursor-pointer"><span class="text-lg">⚽</span><span>Matchs</span></button>
        <button onclick="navigate('stades')" class="flex flex-col items-center gap-1 hover:text-primaryEmerald cursor-pointer"><span class="text-lg">Stadium</span><span>Stades</span></button>
        <button onclick="navigate('billets')" class="flex flex-col items-center gap-1 hover:text-primaryEmerald cursor-pointer"><span class="text-lg">🎫</span><span>Billets</span></button>
        <button onclick="navigate('volontaires')" class="flex flex-col items-center gap-1 hover:text-primaryEmerald cursor-pointer"><span class="text-lg">👥</span><span>Volon.</span></button>
        <button onclick="navigate('dashboard')" class="flex flex-col items-center gap-1 hover:text-primaryEmerald cursor-pointer"><span class="text-lg">📊</span><span>Stats</span></button>
    </div>

    <!-- MAIN VIEWS WRAPPER -->
    <main class="flex-grow pt-24 pb-20 md:pb-12 moroccan-grid bg-zinc-950">

        <!-- PAGE : ACCUEIL -->
        <section id="view-accueil" class="max-w-6xl mx-auto px-4 text-center py-6 flex flex-col justify-center items-center">
            <!-- Moroccan star icon background deco -->
            <div className="absolute top-28 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none select-none">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="none"><path d="M50 0 L64 36 L100 50 L64 64 L50 100 L36 64 L0 50 L36 36 Z" fill="#34d399"/></svg>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span class="px-4 py-1 rounded-full text-[10px] font-bold bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] tracking-wider uppercase">
                    🇲🇦 MAROC (Hôte Principal)
                </span>
                <span class="px-3 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-zinc-400 font-semibold">
                    🇵🇹 Portugal | 🇪🇸 Espagne (Co-hôtes)
                </span>
            </div>
            <h1 class="text-3xl sm:text-6xl font-display font-black tracking-tight text-white mb-6 uppercase">
                Coupe du Monde <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primaryEmerald to-accentAmber">
                    FIFA 2030 MAROC
                </span>
            </h1>
            <p class="text-zinc-400 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
                Vivez l'élégance et la grandeur du premier mondial multipartite d'élite reliant deux continents. Bienvenue au Royaume du Maroc pour une célébration sportive divine.
            </p>

            <!-- Countdown clocks -->
            <div class="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl w-full mb-12">
                <div class="glass-panel hover-glow rounded-xl p-3 flex flex-col">
                    <span id="days-display" class="text-2xl sm:text-4xl font-display font-black text-accentAmber">1450</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#a1a1aa] mt-0.5">Jours</span>
                </div>
                <div class="glass-panel hover-glow rounded-xl p-3 flex flex-col">
                    <span id="hours-display" class="text-2xl sm:text-4xl font-display font-black text-accentAmber">08</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#a1a1aa] mt-0.5">Heures</span>
                </div>
                <div class="glass-panel hover-glow rounded-xl p-3 flex flex-col">
                    <span id="minutes-display" class="text-2xl sm:text-4xl font-display font-black text-accentAmber">25</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#a1a1aa] mt-0.5">Min.</span>
                </div>
                <div class="glass-panel hover-glow rounded-xl p-3 flex flex-col">
                    <span id="seconds-display" class="text-2xl sm:text-4xl font-display font-black text-accentAmber">50</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#a1a1aa] mt-0.5">sec.</span>
                </div>
            </div>

            <!-- CTA -->
            <div class="flex flex-col sm:flex-row gap-4">
                <button onclick="navigate('billets')" class="px-8 py-3.5 rounded-xl font-display font-semibold bg-primaryEmerald text-[#0a0a0a] hover:bg-opacity-90 transition-all cursor-pointer">
                    Réserver mes Billets 🎫
                </button>
                <button onclick="navigate('matchs')" class="px-8 py-3.5 rounded-xl font-display font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer">
                    Consulter le calendrier ⚽
                </button>
            </div>
        </section>

        <!-- PAGE : MATCHS -->
        <section id="view-matchs" class="max-w-5xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-primaryEmerald bg-primaryEmerald/10 px-3 py-0.5 rounded-full inline-block">⚽ Calendrier 2030</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">RENCONTRES SÉLECTIONNÉES</h2>
            </div>
            <!-- Matches Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="vanilla-matches-root">
                <!-- Injected via JavaScript -->
            </div>
        </section>

        <!-- PAGE : STADES -->
        <section id="view-stades" class="max-w-5xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-accentAmber bg-accentAmber/10 px-3 py-0.5 rounded-full inline-block">🏟️ Temples d'Échelle Royale</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">LES 6 SITES STRATÉGIQUES</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="vanilla-stadiums-root">
                <!-- Injected via JavaScript -->
            </div>
        </section>

        <!-- PAGE : BILLETS -->
        <section id="view-billets" class="max-w-5xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-primaryEmerald bg-primaryEmerald/10 px-3 py-0.5 rounded-full inline-block">🎫 Tarifs Réglementaires</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">RÉSERVATION EN DIRECT</h2>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Form left -->
                <div class="lg:col-span-7">
                    <form onsubmit="calculateTicket(event)" class="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                        <h3 class="font-display font-black text-white text-base border-b border-zinc-800 pb-2 flex items-center gap-1.5"><span class="text-emerald-400">#</span> CALCULATEUR DE PRIX</h3>
                        
                        <!-- Select Match -->
                        <div>
                            <label class="block text-xs font-bold text-zinc-400 mb-1">1. SÉLECTIONNER UN MATCH</label>
                            <select id="vanilla-ticket-match" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-zinc-200">
                                <!-- Injected by JS -->
                            </select>
                        </div>

                        <!-- Choose Category -->
                        <div>
                            <label class="block text-xs font-bold text-zinc-400 mb-2">2. CATÉGORIE DE PLACE</label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="vanilla-cats-root">
                                <!-- Radio layout injected by JS -->
                            </div>
                        </div>

                        {/* Quantity & Discounts */}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-zinc-400 mb-1">3. NOMBRE DE PLACES (MAX 10)</label>
                                <input type="number" id="vanilla-ticket-qty" min="1" max="10" value="1" oninput="calculatePriceRealTime()" class="w-full bg-zinc-900 border border-zinc-700-60 rounded-xl px-3 py-2 text-sm text-zinc-200">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-400 mb-1">4. REMISE SPÉCIALE</label>
                                <select id="vanilla-ticket-discount" onchange="calculatePriceRealTime()" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-zinc-200">
                                    <option value="0">Plein Tarif</option>
                                    <option value="20">Résident Marocain (-20%)</option>
                                    <option value="40">Étudiant (-40%)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-400 mb-1 font-display">5. NOM COMPLET DÉTENTEUR</label>
                            <input type="text" id="vanilla-ticket-holder" required placeholder="Ex: Anass Alaoui" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-zinc-200">
                        </div>

                        {/* Breakdown */}
                        <div class="bg-black/55 border border-zinc-800 p-3 rounded-xl font-mono text-xs text-zinc-400">
                            <div class="flex justify-between mb-1"><span>Prix Unitaire :</span><span id="label-unit-price">1200 MAD</span></div>
                            <div class="flex justify-between mb-1"><span>Remise :</span><span class="text-rose-400" id="label-reduc">0 MAD</span></div>
                            <div class="flex justify-between font-bold text-white pt-2 border-t border-zinc-800/60 font-display"><span>TOTAL :</span><span class="text-accentAmber text-sm" id="label-total-price">1200 MAD</span></div>
                        </div>

                        <button type="submit" class="w-full py-3 bg-gradient-to-r from-primaryEmerald to-teal-500 text-black font-display font-extrabold rounded-xl uppercase tracking-wider text-xs">
                            Payer et Générer mon Billet 🔒
                        </button>
                    </form>
                </div>

                <!-- Ticket Card display right -->
                <div class="lg:col-span-5 flex flex-col justify-center">
                    <div id="vanilla-ticket-out-card" class="hidden">
                        <!-- Injected dynamic ticket design from JS -->
                    </div>
                    <div id="vanilla-ticket-out-placeholder" class="glass-panel border-zinc-800 border-dashed border-2 rounded-2xl p-12 text-center text-zinc-500 flex flex-col justify-center items-center h-full">
                        <span class="text-4xl mb-2">🎟️</span>
                        <p class="text-xs max-w-xs font-sans">Complétez la billetterie à gauche pour obtenir instantanément votre badge d'accréditation officiel.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE : VOLONTAIRES -->
        <section id="view-volontaires" class="max-w-5xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-0.5 rounded-full inline-block">👥 Programme National</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">DEVENEZ AMBASSADEUR 2030</h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div class="lg:col-span-7">
                    <form onsubmit="submitVolunteer(event)" class="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                        <h3 class="font-display font-bold text-white flex gap-1 items-center border-b border-zinc-800 pb-2 uppercase text-sm">💡 Inscription Volontaire</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-xs font-bold text-zinc-400 mb-1">PRENOM</label><input type="text" id="vol-first" required placeholder="Ex: Karim" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-200"></div>
                            <div><label class="block text-xs font-bold text-zinc-400 mb-1">NOM</label><input type="text" id="vol-last" required placeholder="Ex: Rachidi" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-200"></div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-xs font-bold text-zinc-400 mb-1 font-display">COURRIEL</label><input type="email" id="vol-mail" required placeholder="karim@gmail.com" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-200"></div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-400 mb-1">VILLE DE RÉSIDENCE</label>
                                <select id="vol-location" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-200">
                                    <option value="Casablanca">Casablanca</option>
                                    <option value="Rabat">Rabat</option>
                                    <option value="Tanger">Tanger</option>
                                    <option value="Fès">Fès</option>
                                    <option value="Marrakech">Marrakech</option>
                                    <option value="Agadir">Agadir</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-400 mb-1">RÔLE PRÉFÉRÉ</label>
                            <select id="vol-role" class="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-200">
                                <option value="languages">Traduction et langues parlées</option>
                                <option value="vip">Accueil VIP & Protocole</option>
                                <option value="medical">Assistance Médicale First-Aid</option>
                                <option value="logistics">Logistique, stades & flux</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-400 mb-1.5">LANGUES MATRISÉES</label>
                            <div class="flex flex-wrap gap-4 text-xs font-mono">
                                <label class="flex items-center gap-1.5"><input type="checkbox" id="lang-ar" checked class="accent-primaryEmerald"> Arabe</label>
                                <label class="flex items-center gap-1.5"><input type="checkbox" id="lang-fr" checked class="accent-primaryEmerald"> Français</label>
                                <label class="flex items-center gap-1.5"><input type="checkbox" id="lang-en" class="accent-primaryEmerald"> Anglais</label>
                                <label class="flex items-center gap-1.5"><input type="checkbox" id="lang-es" class="accent-primaryEmerald"> Espagnol</label>
                            </div>
                        </div>

                        <button type="submit" class="w-full py-3 bg-primaryEmerald text-black font-display font-bold uppercase rounded-xl tracking-wider text-xs">
                            Soumettre mon Dossier 🚀
                        </button>
                    </form>
                </div>
                <!-- Badge right -->
                <div class="lg:col-span-5 flex flex-col justify-center">
                    <div id="vanilla-vol-out-card" class="hidden">
                        <!-- Injected dynamic volunteer badge -->
                    </div>
                    <div id="vanilla-vol-out-placeholder" class="glass-panel border-dashed border-zinc-800 border-2 rounded-2xl p-12 text-center text-zinc-500">
                        <span class="text-4xl mb-2">👥</span>
                        <p class="text-xs font-sans">Calculez instantanément votre score de matching comité de la FIFA 2030 après avoir soumis votre dossier.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE : DASHBOARD -->
        <section id="view-dashboard" class="max-w-5xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-0.5 rounded-full inline-block">📊 Statistiques Officielles</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">SUIVI OPERATIONNEL ROYAL</h2>
            </div>

            <!-- Dashboard Widgets Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="glass-panel rounded-xl p-4">
                    <span class="text-zinc-500 text-[10px] uppercase font-bold">Volontaires</span>
                    <p class="text-xl font-display font-black text-primaryEmerald mt-1">3 240 / 5 000</p>
                    <div class="w-full h-1 bg-zinc-800 rounded mt-2 overflow-hidden"><div class="bg-primaryEmerald h-full" style="width: 64.8%;"></div></div>
                </div>
                <div class="glass-panel rounded-xl p-4">
                    <span class="text-zinc-500 text-[10px] uppercase font-bold">Stades Marocains</span>
                    <p class="text-xl font-display font-black text-white mt-1">4 Prêts / 2 Const.</p>
                    <div class="flex gap-1 mt-2"><span class="w-2.5 h-1.5 rounded-full bg-primaryEmerald"></span><span class="w-2.5 h-1.5 rounded-full bg-primaryEmerald"></span><span class="w-2.5 h-1.5 rounded-full bg-primaryEmerald"></span><span class="w-2.5 h-1.5 rounded-full bg-primaryEmerald"></span><span class="w-2.5 h-1.5 rounded-full bg-accentAmber"></span></div>
                </div>
                <div class="glass-panel rounded-xl p-4">
                    <span class="text-zinc-500 text-[10px] uppercase font-bold">Billets Vendus</span>
                    <p class="text-xl font-display font-black text-accentAmber mt-1">78 000 / 320 000</p>
                    <div class="w-full h-1 bg-zinc-800 rounded mt-2 overflow-hidden"><div class="bg-accentAmber h-full" style="width: 24.4%;"></div></div>
                </div>
                <div class="glass-panel rounded-xl p-4">
                    <span class="text-zinc-500 text-[10px] uppercase font-bold">Cartes Accréditations</span>
                    <p class="text-xl font-display font-black text-rose-400 mt-1">1 240 BADGES</p>
                    <div class="w-full h-1 bg-zinc-800 rounded mt-2 overflow-hidden"><div class="bg-rose-400 h-full" style="width: 50%;"></div></div>
                </div>
            </div>

            <div class="glass-panel rounded-xl p-6">
                <h4 class="font-display font-bold text-white text-sm uppercase mb-4">Allocation budgétaire émise (850M MAD)</h4>
                <!-- Svg chart simulated -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div class="flex justify-center flex-col items-center">
                        <svg width="120" height="120" viewBox="0 0 42 42" class="rotate-90">
                            <circle cx="21" cy="21" r="15.915" stroke="rgba(24,24,27,0.8)" stroke-width="6" fill="transparent"></circle>
                            <circle cx="21" cy="21" r="15.915" stroke="#34d399" stroke-width="6" fill="transparent" stroke-dasharray="45 55" stroke-dashoffset="100"></circle>
                            <circle cx="21" cy="21" r="15.915" stroke="#fbbf24" stroke-width="6" fill="transparent" stroke-dasharray="20 80" stroke-dashoffset="55"></circle>
                            <circle cx="21" cy="21" r="15.915" stroke="#3b82f6" stroke-width="6" fill="transparent" stroke-dasharray="35 65" stroke-dashoffset="35"></circle>
                        </svg>
                        <span class="text-[10px] text-zinc-400 mt-2 font-mono">Total : 850,000,000 MAD</span>
                    </div>
                    <ul class="text-xs space-y-2">
                        <li class="flex justify-between"><span>💚 Infrastructures et Stades :</span><strong>45% (382,5M)</strong></li>
                        <li class="flex justify-between"><span>💛 Sécurité & Protocoles :</span><strong>20% (170M)</strong></li>
                        <li class="flex justify-between"><span>💙 Transports Métros-RER :</span><strong>15% (127,5M)</strong></li>
                        <li class="flex justify-between"><span>💜 Opérations Événementielles :</span><strong>20% (170M)</strong></li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- PAGE : SCANNER -->
        <section id="view-scanner" class="max-w-4xl mx-auto px-4 py-4 hidden">
            <div class="text-center mb-8">
                <span class="text-xs font-semibold uppercase tracking-widest text-[#fbbf24] bg-[#fbbf24]/10 px-3 py-0.5 rounded-full inline-block">🔬 Scanner Numérique</span>
                <h2 class="text-2xl md:text-4xl font-display font-bold text-white mt-1">SÉCURITÉ & TOURNIQUETS</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass-panel p-6 rounded-2xl flex flex-col items-center">
                    <h4 class="font-display font-bold text-white mb-2 text-sm text-left w-full">Caméra simulation</h4>
                    
                    <div class="relative w-60 h-60 bg-black border-2 border-zinc-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                        <div id="vanilla-scanner-laser" class="absolute inset-x-0 h-0.5 bg-primaryEmerald shadow-lg shadow-emerald-400 z-10 hidden laser-sweep"></div>
                        <span class="text-6xl">🔳</span>
                    </div>

                    <div class="w-full text-xs">
                        <label class="block font-bold text-zinc-400 mb-1">Sélectionner un billet à tester :</label>
                        <select id="vanilla-scan-preset" class="w-full bg-zinc-900 border border-zinc-700/60 p-2 text-xs rounded-lg mb-3">
                            <option value="royal">👑 Badge Invitation Royale VIP (Valide)</option>
                            <option value="fraud">❌ Coupon contrefait répliqué (Rejeté)</option>
                        </select>
                        <button onclick="startVanillaScan()" class="w-full py-2.5 bg-primaryEmerald text-black font-display font-bold uppercase rounded-lg text-xs">Déclencher le bip 🔔</button>
                    </div>
                </div>

                <!-- Hasil Scanner -->
                <div class="glass-panel p-6 rounded-2xl flex flex-col justify-center">
                    <div id="vanilla-scan-result" class="hidden text-center">
                        <!-- Injected scan report -->
                    </div>
                    <div id="vanilla-scan-placeholder" class="text-center text-zinc-500">
                        <span class="text-4xl">📋</span>
                        <p class="text-xs font-mono mt-2">Bip sonore d'accréditation en attente.</p>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- CONSTANT FOOTER -->
    <footer class="bg-[#0a0a0a] border-t border-zinc-900 py-6 px-12 text-center text-zinc-500 text-xs mt-12 w-full">
        <p class="mb-2">© 2030 FIFA World Cup Morocco — Projet PFE MGSI | Liens rapides | Contact</p>
        <p class="font-mono text-[10px] text-zinc-650">Aesthetically crafted to ultra premium luxury specifications - PFE MGSI 2026</p>
    </footer>

    <!-- INTERACTIVITY CONTROLLER (PURE VANILLA JAVASCRIPT STATE ENGINE) -->
    <script>
        // Demonstration datasets
        const MATCHES_DATA = [
            { id: "m1", home: "Maroc", homeFl: "🇲🇦", away: "Portugal", awayFl: "🇵🇹", phase: "Match d'ouverture", stadium: "Grand Stade Hassan II", city: "Casablanca", date: "14 Juin 2030", time: "20:00", popular: true },
            { id: "m2", home: "Brésil", homeFl: "🇧🇷", away: "Allemagne", awayFl: "🇩🇪", phase: "Phase de groupes", stadium: "Grand Stade de Rabat", city: "Rabat", date: "15 Juin 2030", time: "18:00", popular: false },
            { id: "m3", home: "France", homeFl: "🇫🇷", away: "Argentine", awayFl: "🇦🇷", phase: "Phase de groupes", stadium: "Grand Stade de Tanger", city: "Tanger", date: "16 Juin 2030", time: "21:00", popular: true }
        ];

        const STADIUMS_DATA = [
            { name: "Grand Stade Hassan II", city: "Casablanca", cap: "115 000 places", highlight: "Ouverture & Finale", spec: "Tente en moussem d'acier", icon: "🏟️" },
            { name: "Grand Stade de Rabat", city: "Rabat", cap: "70 000 places", highlight: "Quart de finale", spec: "Bioclimatique écologique", icon: "🏛️" },
            { name: "Grand Stade de Tanger", city: "Tanger", cap: "68 000 places", highlight: "Demi-finale", spec: "Acoustique d'élite côtière", icon: "🌊" }
        ];

        const CATS_DATA = [
            { id: "v1", name: "Carré Royal VIP", price: 4500, desc: "Accès loge officielle, banquet, parking", label: "👑 VIP" },
            { id: "v2", name: "Tribune Centrale", price: 2500, desc: "Siège confort face à la ligne médiane", label: "✨ Premium" },
            { id: "v3", name: "Tribune Latérale", price: 1200, desc: "Vue diagonale d'angle, excellente acoustique", label: "👍 Standard" },
            { id: "v4", name: "Virage Populaire", price: 400, desc: "Tribune passionnée, tifos et chants", label: "🔥 Ambiance" }
        ];

        // Active State
        let selectedCategoryPrice = 1200;
        let selectedCategoryName = "Tribune Latérale";
        let lastCreatedTicket = null;

        // Initialize Countdown Clock to 2030
        function startCountdown() {
            const target = new Date("2030-06-14T20:00:00").getTime();
            setInterval(() => {
                const diff = target - new Date().getTime();
                if(diff > 0) {
                    document.getElementById("days-display").innerText = Math.floor(diff / (1000*60*60*24));
                    document.getElementById("hours-display").innerText = String(Math.floor((diff % (1000*60*60*24)) / (1000*60*60))).padStart(2, '0');
                    document.getElementById("minutes-display").innerText = String(Math.floor((diff % (1000*60*60)) / (1000*60))).padStart(2, '0');
                    document.getElementById("seconds-display").innerText = String(Math.floor((diff % (1000*60)) / 1000)).padStart(2, '0');
                }
            }, 1000);
        }

        // SPA Navigation simulation
        function navigate(tabName) {
            const views = ["accueil", "matchs", "stades", "billets", "volontaires", "dashboard", "scanner"];
            views.forEach(v => {
                const element = document.getElementById("view-" + v);
                if(element) element.classList.add("hidden");
            });
            document.getElementById("view-" + tabName).classList.remove("hidden");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Render Initial Database
        function renderDatabase() {
            // Render matches
            const mRoot = document.getElementById("vanilla-matches-root");
            mRoot.innerHTML = MATCHES_DATA.map(m => \`
                <div class="glass-panel rounded-2xl p-5 hover-glow border \${m.popular ? 'border-accentAmber/30':'border-zinc-800'} relative">
                    \${m.popular ? '<span class="absolute top-0 right-0 bg-accentAmber text-black text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl font-mono">🔥 CHOC</span>':''}
                    <div class="flex justify-between items-center text-xs text-zinc-500 mb-2 font-mono"><span>🏆 \${m.phase}</span><span>📅 \${m.date}</span></div>
                    <div class="flex items-center justify-around py-2 text-center">
                        <div class="flex flex-col items-center"><span class="text-3xl">\${m.homeFl}</span><span class="text-sm font-semibold mt-1">\${m.home}</span></div>
                        <div class="font-mono text-zinc-500 text-xs">VS</div>
                        <div class="flex flex-col items-center"><span class="text-3xl">\${m.awayFl}</span><span class="text-sm font-semibold mt-1">\${m.away}</span></div>
                    </div>
                    <div class="pt-3 border-t border-zinc-800 mt-4 flex justify-between items-center text-xs text-zinc-400">
                        <div><p class="font-semibold text-white">\${m.stadium}</p><p class="text-[10px]">\${m.city}, Maroc</p></div>
                        <button onclick="bookMatchDirect('\${m.id}')" class="px-3 py-1.5 bg-primaryEmerald/10 text-primaryEmerald border border-primaryEmerald/30 font-semibold rounded-lg text-xs cursor-pointer hover:bg-primaryEmerald hover:text-black transition-all">Réserver 🎫</button>
                    </div>
                </div>
            \`).join('');

            // Render stadiums
            const sRoot = document.getElementById("vanilla-stadiums-root");
            sRoot.innerHTML = STADIUMS_DATA.map(s => \`
                <div class="glass-panel rounded-2xl p-5 hover-glow flex flex-col justify-between">
                    <div>
                        <span class="text-3xl mb-2 block">\${s.icon}</span>
                        <h4 class="font-display font-bold text-white text-base mb-1">\${s.name}</h4>
                        <span class="text-accentAmber font-semibold text-xs font-mono">\${s.city}</span>
                        <p class="text-zinc-400 text-xs leading-normal mt-2">\${s.spec}</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-zinc-800 text-xs flex justify-between text-zinc-500 font-mono"><span>FIFA Accordée</span><strong>\${s.cap}</strong></div>
                </div>
            \`).join('');

            // Fill ticket select dropdown
            const tSel = document.getElementById("vanilla-ticket-match");
            tSel.innerHTML = MATCHES_DATA.map(m => \`
                <option value="\${m.id}">\${m.homeFl} \${m.home} vs \${m.away} \${m.awayFl} (\${m.city})</option>
            \`).join('');

            // Render categories
            const catRoot = document.getElementById("vanilla-cats-root");
            catRoot.innerHTML = CATS_DATA.map((c, i) => \`
                <div onclick="selectCategory('\${c.name}', \${c.price}, '\${c.id}')" id="v-cat-card-\${c.id}" class="glass-panel border rounded-xl p-3.5 cursor-pointer hover-glow transition-all \${i === 2 ? 'border-primaryEmerald bg-primaryEmerald/5':''}">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs font-bold text-white">\${c.name}</span>
                        <span class="text-[9px] px-1 bg-zinc-800 text-accentAmber font-mono rounded">\${c.label}</span>
                    </div>
                    <p class="text-[10px] text-zinc-500 leading-tight mb-2">\${c.desc}</p>
                    <span class="text-xs font-bold text-accentAmber">\${c.price} MAD</span>
                </div>
            \`).join('');
        }

        // Handle category click
        function selectCategory(name, price, id) {
            selectedCategoryPrice = price;
            selectedCategoryName = name;
            // Clean active classes
            CATS_DATA.forEach(c => {
                document.getElementById("v-cat-card-" + c.id).classList.remove("border-primaryEmerald", "bg-primaryEmerald/5");
            });
            document.getElementById("v-cat-card-" + id).classList.add("border-primaryEmerald", "bg-primaryEmerald/5");
            calculatePriceRealTime();
        }

        function calculatePriceRealTime() {
            const qty = parseInt(document.getElementById("vanilla-ticket-qty").value) || 1;
            const discountPercent = parseInt(document.getElementById("vanilla-ticket-discount").value) || 0;
            const subtotal = selectedCategoryPrice * qty;
            const reduction = (subtotal * discountPercent) / 100;
            const finalP = subtotal - reduction;

            document.getElementById("label-unit-price").innerText = selectedCategoryPrice + " MAD";
            document.getElementById("label-reduc").innerText = "-" + reduction + " MAD";
            document.getElementById("label-total-price").innerText = finalP + " MAD";
        }

        // Direct booking click from matches section
        function bookMatchDirect(id) {
            document.getElementById("vanilla-ticket-match").value = id;
            navigate("billets");
        }

        // Calculate and build ticket
        function calculateTicket(e) {
            e.preventDefault();
            const mId = document.getElementById("vanilla-ticket-match").value;
            const mObj = MATCHES_DATA.find(m => m.id === mId);
            const qty = parseInt(document.getElementById("vanilla-ticket-qty").value) || 1;
            const holder = document.getElementById("vanilla-ticket-holder").value;
            const discountPercent = parseInt(document.getElementById("vanilla-ticket-discount").value) || 0;
            const finalP = (selectedCategoryPrice * qty) - ((selectedCategoryPrice * qty * discountPercent) / 100);

            const ticketId = "WC30-" + Math.floor(100000 + Math.random()*900000);

            lastCreatedTicket = {
                id: ticketId,
                holder: holder,
                match: \`\${mObj.homeFl} \${mObj.home} vs \${mObj.away} \${mObj.awayFl}\`,
                stadium: mObj.stadium,
                city: mObj.city,
                cat: selectedCategoryName,
                qty: qty,
                price: finalP,
                gate: "Porte d'Or — A1"
            };

            // Inject ticket out card HTML
            document.getElementById("vanilla-ticket-out-placeholder").classList.add("hidden");
            const outCard = document.getElementById("vanilla-ticket-out-card");
            outCard.classList.remove("hidden");
            outCard.innerHTML = \`
                <div class="glass-panel border border-accentAmber/60 rounded-2xl overflow-hidden p-5 flex flex-col relative text-left">
                    <span class="text-[10px] font-bold text-accentAmber uppercase mb-2 block font-mono">🌟 BILLET OFFICIEL VALIDÉ</span>
                    <h3 class="font-display font-black text-white text-lg">\${lastCreatedTicket.match}</h3>
                    <div class="text-xs text-zinc-400 space-y-1 my-3 bg-black/45 p-3 rounded-lg font-mono">
                        <p class="flex justify-between"><span>ID :</span><strong>\${lastCreatedTicket.id}</strong></p>
                        <p class="flex justify-between"><span>Détenteur :</span><span>\${lastCreatedTicket.holder}</span></p>
                        <p class="flex justify-between"><span>Catégorie :</span><span>\${lastCreatedTicket.cat}</span></p>
                        <p class="flex justify-between flex-wrap"><span>Porte accès :</span><span class="text-primaryEmerald font-extrabold">\${lastCreatedTicket.gate}</span></p>
                        <p class="flex justify-between"><span>Total Réglé :</span><strong class="text-primaryEmerald">\${lastCreatedTicket.price} MAD</strong></p>
                    </div>
                    <!-- Micro QR Code preview simulation -->
                    <div class="flex justify-center p-2 bg-white rounded-xl w-24 h-24 mx-auto mb-2"><span class="text-[8px] text-zinc-900 leading-none select-none overflow-hidden text-center break-all font-bold">QR_FIFA_30_ID_\${lastCreatedTicket.id}</span></div>
                    <button onclick="sendToScannerDirect()" class="w-full py-2 rounded-xl bg-accentAmber text-black font-semibold text-xs">📲 Envoyer vers le scanneur QR</button>
                </div>
            \`;
        }

        // Preload simulation into the scanner
        function sendToScannerDirect() {
            if(!lastCreatedTicket) return;
            // Inject and activate custom preset option in dropdown
            const sel = document.getElementById("vanilla-scan-preset");
            sel.innerHTML = \`
                <option value="last-bought">🎫 Votre billet généré (ID: \${lastCreatedTicket.id})</option>
                <option value="royal">👑 Badge Invitation Royale VIP (Valide)</option>
                <option value="fraud">❌ Coupon contrefait répliqué (Rejeté)</option>
            \`;
            sel.value = "last-bought";
            navigate("scanner");
        }

        // Simulation form submission volunteers
        function submitVolunteer(e) {
            e.preventDefault();
            const first = document.getElementById("vol-first").value;
            const last = document.getElementById("vol-last").value;
            const loc = document.getElementById("vol-location").value;
            const roleSel = document.getElementById("vol-role").value;
            
            const score = Math.floor(65 + Math.random()*30); // Real-time simulated matching algorithm score
            const volId = "VOL-2030-" + Math.floor(1000 + Math.random()*9000);

            document.getElementById("vanilla-vol-out-placeholder").classList.add("hidden");
            const root = document.getElementById("vanilla-vol-out-card");
            root.classList.remove("hidden");
            root.innerHTML = \`
                <div class="glass-panel rounded-2xl p-6 border border-[#34d399]/40 text-center flex flex-col items-center">
                    <span class="text-emerald-400 font-bold block text-sm mb-1 uppercase tracking-wider">Analyse de Dossier Terminée !</span>
                    <div class="text-3xl font-display font-black text-white py-2">\${score}% MATCHING</div>
                    <div class="w-full bg-black/45 rounded-xl p-4 text-xs font-mono text-left my-3 space-y-1">
                        <p class="text-center text-sm text-accentAmber font-bold font-display uppercase pb-1.5 border-b border-zinc-800 mb-2">\${first} \${last}</p>
                        <p class="flex justify-between"><span>Identifiant :</span><strong>\${volId}</strong></p>
                        <p class="flex justify-between"><span>Ville Assig. :</span><span>\${loc}</span></p>
                        <p class="flex justify-between"><span>Grade assigné :</span><span class="text-primaryEmerald font-extrabold">\${score > 80 ? 'OR' : 'ÉMERAUDE'}</span></p>
                    </div>
                    <span class="text-[9px] text-zinc-500 font-mono">Dossier archivé comité FIFA 2030</span>
                </div>
            \`;
        }

        // Simulator QR Access code scan
        function startVanillaScan() {
            const btn = document.getElementById("vanilla-scanner-laser");
            btn.classList.remove("hidden");
            const resPlaceholder = document.getElementById("vanilla-scan-placeholder");
            const resCard = document.getElementById("vanilla-scan-result");
            resPlaceholder.classList.add("hidden");
            resCard.classList.add("hidden");

            setTimeout(() => {
                btn.classList.add("hidden");
                resCard.classList.remove("hidden");
                const pVal = document.getElementById("vanilla-scan-preset").value;

                let badgeHtml = "";
                if (pVal === "last-bought" && lastCreatedTicket) {
                    badgeHtml = \`
                        <span class="text-5xl">✅</span>
                        <h4 class="text-primaryEmerald font-bold tracking-widest uppercase mt-2">ACCÈS VALIDE ✔</h4>
                        <div class="bg-black/55 p-3 rounded-lg border border-zinc-800 text-xs font-mono text-left my-3 leading-normal">
                            <p><strong>GUID:</strong> \${lastCreatedTicket.id}</p>
                            <p><strong>Détenteur:</strong> \${lastCreatedTicket.holder}</p>
                            <p><strong>Match:</strong> \${lastCreatedTicket.match}</p>
                            <p><strong>Porte affectée:</strong> \${lastCreatedTicket.gate}</p>
                        </div>
                    \`;
                } else if (pVal === "royal") {
                    badgeHtml = \`
                        <span class="text-5xl">✅</span>
                        <h4 class="text-accentAmber font-bold tracking-widest uppercase mt-2">AUTORISATION SUPRÊME OK ✔</h4>
                        <div class="bg-black/55 p-3 rounded-lg border border-zinc-805 text-xs font-mono text-left my-3 leading-normal">
                            <p><strong>Badge:</strong> Carré Royal VIP - Box 01</p>
                            <p><strong>Détenteur:</strong> Ambassadeur & Étoile d’Espagne</p>
                            <p><strong>Accès Porte:</strong> Porte d'Or — Protocole Royal</p>
                        </div>
                    \`;
                } else {
                    badgeHtml = \`
                        <span class="text-5xl">❌</span>
                        <h4 class="text-red-400 font-bold tracking-widest uppercase mt-2">ACCÈS REJETÉ / DUPLICATA ✖</h4>
                        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-mono text-left my-3 text-red-400">
                             Alerte : Ce billet électronique a déjà été enregistré sur le tourniquet 04 du Grand Stade Hassan II à 19:42. Suspicion de contrefaçon !
                        </div>
                    \`;
                }
                resCard.innerHTML = badgeHtml;
            }, 1500);
        }

        // On Load Initial setup callbacks
        window.addEventListener('DOMContentLoaded', () => {
            renderDatabase();
            startCountdown();
            calculatePriceRealTime();
        });
    </script>
</body>
</html>`;

  // Standard string clipboard copy fallback
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fullHTMLCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto animate-slide-up bg-zinc-950/40 rounded-3xl border border-zinc-850 my-12" id="code-viewer-panel">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-1 rounded-full mb-1 inline-block">
            💻 Livrable PFE Récupérable
          </span>
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase flex items-center gap-1.5">
            📦 CODE SOURCE HTML EXPORTABLE (VANILLA)
          </h3>
          <p className="text-xs text-zinc-500 max-w-xl leading-relaxed mt-1">
            Conformément aux directives, voici le code source d'intégration complet, entièrement autonome (HTML + Tailwind + JS natif d'état). Vous pouvez l'archiver ou le migrer instantanément.
          </p>
        </div>

        {/* Action Copy button */}
        <button
          id="copy-code-btn"
          onClick={handleCopyToClipboard}
          className={`px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all w-full sm:w-auto text-center ${
            copied
              ? 'bg-[#34d399] text-[#0a0a0a] shadow-[0_0_15px_rgba(52,211,153,0.3)]'
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
        >
          {copied ? '✅ CODE COPIÉ !' : '📋 COPIER TOUT LE CODE'}
        </button>
      </div>

      {/* Structured Code block displaying details */}
      <div className="relative rounded-xl overflow-hidden border border-zinc-850">
        
        {/* Fake title frame */}
        <div className="bg-[#121214] border-b border-zinc-850 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>📁 index_vanilla.html</span>
          <span>Tailwind 4.x & Vanilla JS</span>
        </div>

        {/* Rich preview display of index_vanilla.html */}
        <div className="bg-[#050505] p-5 font-mono text-xs text-zinc-400 overflow-x-auto max-h-96 text-left selection:bg-zinc-800 select-all scrollbar-thin">
          <pre className="text-[11px] leading-relaxed">
            {fullHTMLCode}
          </pre>
        </div>

        {/* Sticky indicator overlay bottom */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>

      {/* Guidelines checklist */}
      <div className="mt-6 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-xs text-zinc-400 text-left">
        <strong className="text-white block mb-1">💡 Instructions d'Exécution :</strong>
        <ol className="list-decimal pl-4.5 space-y-1 text-[11px]">
          <li>Cliquez sur le bouton bouton <span className="text-[#fbbf24] font-semibold">"COPIER TOUT LE CODE"</span> ci-dessus.</li>
          <li>Créez un nouveau fichier nommé <span className="font-mono text-white bg-black/45 px-1 py-0.5 rounded">index.html</span> sur votre machine locale.</li>
          <li>Collez-y l'intégralité du code et ouvrez le fichier directement dans votre navigateur Web préféré !</li>
        </ol>
      </div>

    </section>
  );
}

