/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Languages, 
  Calendar, 
  LogOut, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  UserCheck,
  TrendingUp
} from 'lucide-react';

interface VolunteerProfile {
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
  application_date: string;
}

interface Shift {
  id: string;
  title: string;
  date: string;
  time: string;
  stadium: string;
  zone: string;
  role: string;
  description: string;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a déjà une session connectée dans localStorage
    const savedEmail = localStorage.getItem('volunteerEmail');
    if (savedEmail) {
      loadProfile(savedEmail);
    } else {
      setInitialLoading(false);
    }
  }, []);

  const loadProfile = async (email: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/volunteers/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data: VolunteerProfile = await res.json();
        setProfile(data);
        localStorage.setItem('volunteerEmail', email);
        generateShifts(data);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Erreur lors de la connexion.');
        localStorage.removeItem('volunteerEmail');
      }
    } catch (err) {
      console.error('[Volunteer Dashboard] Erreur login :', err);
      setErrorMsg('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Veuillez saisir votre adresse email.');
      return;
    }
    loadProfile(emailInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('volunteerEmail');
    setProfile(null);
    setShifts([]);
    setEmailInput('');
  };

  const generateShifts = (volunteer: VolunteerProfile) => {
    // Ne générer des shifts que si le volontaire est formé, assigné ou actif
    if (!['trained', 'assigned', 'active'].includes(volunteer.state)) {
      setShifts([]);
      return;
    }

    const stadiumName = volunteer.preferred_stadium_id 
      ? volunteer.preferred_stadium_id[1] 
      : 'Grand Stade Hassan II';

    const cleanStadium = stadiumName.toLowerCase();
    
    // Génération dynamique de shifts basés sur le stade d'affectation
    if (cleanStadium.includes('hassan ii') || cleanStadium.includes('casablanca')) {
      setShifts([
        {
          id: 'shift-casa-1',
          title: 'Contrôle Accès & Accueil - Match d\'ouverture',
          date: '14 Juin 2030',
          time: '16:00 - 22:00',
          stadium: 'Grand Stade Hassan II',
          zone: 'Tribune Ouest / Portes A-B',
          role: 'Agent de billetterie et orientation',
          description: 'Accueil des premiers supporters de la Coupe du Monde pour la rencontre d\'ouverture Maroc vs Portugal.'
        },
        {
          id: 'shift-casa-2',
          title: 'Assistance VIP & Hospitalité - Demi-finale',
          date: '10 Juillet 2030',
          time: '17:30 - 23:30',
          stadium: 'Grand Stade Hassan II',
          zone: 'Salon Royal & Carré d\'Or',
          role: 'Hôte d\'accueil multilingue',
          description: 'Orientation et accompagnement des délégations officielles de la FIFA et des invités VIP.'
        }
      ]);
    } else if (cleanStadium.includes('rabat')) {
      setShifts([
        {
          id: 'shift-rabat-1',
          title: 'Coordination Transport & Flot de Foule',
          date: '15 Juin 2030',
          time: '14:00 - 20:00',
          stadium: 'Grand Stade de Rabat',
          zone: 'Gare RER Dédiée & Esplanade Sud',
          role: 'Coordinateur de flux supporters',
          description: 'Guidage des supporters brésiliens et allemands depuis la gare RER vers leurs portes d\'accès attitrées.'
        },
        {
          id: 'shift-rabat-2',
          title: 'Support Logistique Match de Groupes',
          date: '25 Juin 2030',
          time: '16:00 - 22:00',
          stadium: 'Grand Stade de Rabat',
          zone: 'Zone Technique / Backstage',
          role: 'Agent logistique et approvisionnement',
          description: 'Aide à la distribution des équipements de terrain et des rafraîchissements pour le staff technique.'
        }
      ]);
    } else if (cleanStadium.includes('tanger')) {
      setShifts([
        {
          id: 'shift-tang-1',
          title: 'Assistance Presse & Traduction',
          date: '16 Juin 2030',
          time: '17:00 - 23:00',
          stadium: 'Grand Stade de Tanger',
          zone: 'Tribune de Presse & Zone Mixte',
          role: 'Médiateur de presse et traducteur',
          description: 'Aide aux traducteurs officiels et orientation des journalistes internationaux lors de France vs Argentine.'
        },
        {
          id: 'shift-tang-2',
          title: 'Sécurisation Terrain & Accréditations',
          date: '05 Juillet 2030',
          time: '15:00 - 21:00',
          stadium: 'Grand Stade de Tanger',
          zone: 'Tunnel Joueurs & Zone Médicale',
          role: 'Contrôleur d\'accréditation',
          description: 'Vérification des badges électroniques au niveau des accès vestiaires lors du quart de finale.'
        }
      ]);
    } else {
      // Shifts génériques pour Marrakech, Fès, Agadir
      setShifts([
        {
          id: 'shift-gen-1',
          title: 'Accueil & Orientation Public',
          date: '18 Juin 2030',
          time: '13:00 - 19:00',
          stadium: stadiumName,
          zone: 'Entrée Principale / Zone d\'Animation',
          role: 'Agent d\'accueil',
          description: 'Accueil et distribution du matériel d\'animation Coupe du Monde aux supporters.'
        }
      ]);
    }
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'candidate':
        return <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-display font-semibold text-xs border border-zinc-700/50 flex items-center gap-1.5 shrink-0">📝 Candidat (En étude)</span>;
      case 'preselected':
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-display font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 shrink-0">🗣️ Présélectionné (Entretien)</span>;
      case 'trained':
        return <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-display font-semibold text-xs border border-sky-500/30 flex items-center gap-1.5 shrink-0">🎓 Formé (Prêt)</span>;
      case 'assigned':
        return <span className="px-3 py-1 rounded-full bg-[#34d399]/10 text-[#34d399] font-display font-semibold text-xs border border-[#34d399]/30 flex items-center gap-1.5 shrink-0">📅 Assigné (Shifts programmés)</span>;
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-emerald-500 text-neutral-950 font-display font-black text-xs flex items-center gap-1.5 shrink-0 animate-pulse">🟢 Actif sur le Terrain</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 font-display font-semibold text-xs shrink-0">📁 Archivé</span>;
    }
  };

  const getEducationLevelLabel = (lvl: string | false) => {
    if (!lvl) return 'Non renseigné';
    const mapping = {
      bac: 'Baccalauréat',
      bac2: 'Bac+2 (BTS / DUT)',
      bac3: 'Bac+3 (Licence)',
      bac5: 'Bac+5 (Master / Ingénieur)',
      phd: 'Doctorat (PhD)'
    };
    return mapping[lvl as keyof typeof mapping] || lvl;
  };

  if (initialLoading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#34d399]/20 border-t-[#34d399] animate-spin" />
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Chargement de l'Espace Volontaire...</p>
        </div>
      </div>
    );
  }

  // --- ÉCRAN 1 : FORMULAIRE DE CONNEXION ---
  if (!profile) {
    return (
      <main className="max-w-md mx-auto px-4 pt-28 pb-20 min-h-[750px] flex items-center justify-center">
        <div className="w-full glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 relative shadow-2xl overflow-hidden">
          {/* Decorative neon gradient header line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
              👤 Portail Interne Sécurisé
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
              Espace Volontaire
            </h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto">
              Saisissez l'adresse email utilisée lors de votre inscription pour accéder à vos shifts de missions Coupe du Monde 2030.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-400/10 border border-red-500/40 text-[#f87171] rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="volunteer-email" className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                Adresse Email
              </label>
              <div className="relative">
                <input
                  id="volunteer-email"
                  type="email"
                  placeholder="exemple@leapter.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/45 border border-zinc-700/60 text-white focus:outline-none focus:border-[#33d399] focus-visible:ring-2 focus-visible:ring-[#34d399] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 transition-all text-sm"
                  required
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[9px] text-zinc-500 mt-1.5 font-mono">
                Astuces démo PFE : Utilisez l'adresse email <strong>rayane@leapter.com</strong> ou <strong>sofia@worldcup.ma</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                '🔑 Se connecter'
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- ÉCRAN 2 : TABLEAU DE BORD DU VOLONTAIRE ---
  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-12 min-h-[900px] animate-slide-up">
      
      {/* 1. EN-TÊTE DU PROFIL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#34d399]/10 border-2 border-[#34d399]/30 flex items-center justify-center text-[#34d399]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">{profile.name}</h2>
              {getStatusBadge(profile.state)}
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Inscrit le {new Date(profile.application_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} — ID #{profile.id}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-zinc-700/50 text-zinc-300 font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399]"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNE GAUCHE (5 cols) : Infos d'affectation et Score d'adéquation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BLOC A: Jauge de Matching Score de l'IA Odoo */}
          <div className="glass-panel border border-zinc-700/30 rounded-2xl p-6 relative overflow-hidden shadow-xl text-center">
            {/* Watermarked stars background */}
            <div className="absolute -bottom-8 -left-8 opacity-[0.03] w-36 h-36 select-none pointer-events-none text-white">
              <Award className="w-full h-full" />
            </div>

            <h3 className="text-xs font-display font-black text-white uppercase tracking-widest mb-6 text-left border-b border-zinc-800 pb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#34d399]" />
              <span>Score d'adéquation IA</span>
            </h3>

            {/* Circular progress SVG */}
            <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="stroke-zinc-800 fill-none" 
                  strokeWidth="8"
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="stroke-[#34d399] fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - profile.matching_score / 100)}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.3))' }}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-display font-black text-white tracking-tighter">{profile.matching_score}%</span>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">PROFIL APTE</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Ce score de matching est calculé par l'IA d'affectation d'Odoo en fonction de vos compétences, langues parlées, permis de conduire et secours.
            </p>
          </div>

          {/* BLOC B: Détails du profil et affectation */}
          <div className="glass-panel border border-zinc-700/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-display font-black text-[#34d399] uppercase tracking-widest border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#34d399]" />
              <span>Profil & Compétences</span>
            </h3>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Stade Affecté</span>
                <span className="text-white font-bold flex items-center gap-1.5 text-right max-w-[200px] truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {profile.preferred_stadium_id ? profile.preferred_stadium_id[1] : 'Non affecté'}
                </span>
              </div>

              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Niveau d'études</span>
                <span className="text-zinc-300">{getEducationLevelLabel(profile.education_level)}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Disponibilité</span>
                <span className="text-zinc-300 uppercase">
                  {profile.availability === 'full' ? 'Plein temps ⏱️' : (profile.availability === 'morning' ? 'Matinées ☀️' : (profile.availability === 'evening' ? 'Soirées 🌙' : 'Week-ends 📅'))}
                </span>
              </div>

              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Permis de Conduire</span>
                <span className="text-zinc-300">{profile.has_driving_license ? 'Oui 🚗' : 'Non'}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Premiers Secours</span>
                <span className="text-[#34d399] font-bold">{profile.has_first_aid ? 'Certifié ⛑️' : 'Non certifié'}</span>
              </div>
            </div>

            {/* Skills & languages badges lists */}
            <div className="pt-2 grid grid-cols-1 gap-4 text-xs">
              <div>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-amber-400" />
                  COMPÉTENCES VALIDÉES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skill_ids && profile.skill_ids.length > 0 ? (
                    profile.skill_ids.map(skill => (
                      <span key={skill[0]} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] font-semibold border border-zinc-700/40">
                        {skill[1]}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 italic font-mono text-[10px]">Aucune compétence</span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Languages className="w-3 h-3 text-sky-400" />
                  LANGUES PARLÉES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.language_ids && profile.language_ids.length > 0 ? (
                    profile.language_ids.map(lang => (
                      <span key={lang[0]} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[10px] font-semibold border border-sky-500/20">
                        {lang[1]}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 italic font-mono text-[10px]">Aucune langue</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLONNE DROITE (7 cols) : Shifts de travail et affectations */}
        <div className="lg:col-span-7">
          
          <div className="glass-panel border border-zinc-700/30 rounded-2xl p-6 shadow-xl min-h-[500px]">
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wider mb-6 border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#34d399]" />
              <span>Planning des Shifts & Missions</span>
            </h3>

            {shifts.length > 0 ? (
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="relative bg-[#121214]/60 border border-zinc-800/80 rounded-xl p-5 hover-glow transition-all">
                    {/* Time indicator badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{shift.time}</span>
                    </div>

                    <h4 className="text-sm md:text-base font-display font-black text-white max-w-[70%] leading-snug">
                      {shift.title}
                    </h4>

                    <div className="mt-3.5 space-y-1.5 text-xs text-zinc-400 font-mono">
                      <p className="flex items-center gap-2">
                        <span className="text-zinc-500">📍 Stade :</span>
                        <span className="text-zinc-200">{shift.stadium}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-zinc-500">🧱 Zone / Accès :</span>
                        <span className="text-zinc-200 font-bold">{shift.zone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-zinc-500">👔 Votre Rôle :</span>
                        <span className="text-[#34d399] font-extrabold">{shift.role}</span>
                      </p>
                    </div>

                    <p className="mt-4 text-xs text-zinc-400 leading-normal border-t border-zinc-800/50 pt-3">
                      {shift.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border border-zinc-800 border-dashed rounded-xl min-h-[350px]">
                <FileText className="w-12 h-12 text-zinc-600 mb-3 animate-pulse" />
                <h4 className="text-sm font-display font-extrabold text-white mb-2 uppercase">Aucun shift planifié</h4>
                <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                  Votre candidature est actuellement en statut <strong>{profile.state === 'candidate' ? "Candidat (En cours d'étude)" : (profile.state === 'preselected' ? "Présélectionné (Entretien)" : "Archivé")}</strong>.
                </p>
                <p className="text-xs text-zinc-400 max-w-xs mt-3 leading-relaxed">
                  {profile.state === 'candidate' && "Dès que le comité d'organisation aura validé et classé vos compétences par l'algorithme d'IA, votre statut passera à 'Formé' ou 'Assigné', et vos plannings de shifts apparaîtront ici."}
                  {profile.state === 'preselected' && "Votre candidature a été retenue pour la phase d'entretien. Surveillez votre messagerie, vous recevrez une convocation sous peu."}
                </p>
              </div>
            )}

            {/* Note additionnelle sur la gouvernance premier arrivé premier servi */}
            <div className="mt-6 p-4 rounded-xl bg-neutral-950/70 border border-zinc-800/80 text-[10px] text-zinc-500 leading-relaxed flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 text-[#34d399] shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-300 block mb-0.5 uppercase tracking-wide">Règle de gouvernance logistique (PFE) :</strong>
                L'attribution finale des volontaires aux stades respecte la règle du <strong>"Premier arrivé, premier servi"</strong>. En cas de dépassement de la capacité d'accueil du stade préféré, le système d'affectation déporte les volontaires surnuméraires vers le stade de secours le plus proche disposant de places libres.
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
