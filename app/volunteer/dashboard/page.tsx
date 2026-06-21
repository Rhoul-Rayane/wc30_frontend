/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  TrendingUp,
  Lock,
  ArrowRight,
  ShieldCheck,
  XCircle,
  Edit,
  Save
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/AuthContext';

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
  badge_count: number;
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
  const { user, loading: authLoading, setAuthModalOpen, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<'planning' | 'profile'>('planning');

  // Profile Edit Form State
  const [editPhone, setEditPhone] = useState('');
  const [editNationality, setEditNationality] = useState('');
  const [editIdNumber, setEditIdNumber] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editAvailability, setEditAvailability] = useState<'full' | 'morning' | 'evening' | 'weekend'>('full');
  const [editStadium, setEditStadium] = useState('');
  const [editLicense, setEditLicense] = useState(false);
  const [editVehicle, setEditVehicle] = useState(false);
  const [editFirstAid, setEditFirstAid] = useState(false);
  const [editEducationLevel, setEditEducationLevel] = useState<string>('bac3');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editLanguages, setEditLanguages] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Constants
  const availableSkills = [
    "Premiers secours", "Communication", "Logistique", "Conduite", 
    "Accueil", "Sécurité", "Traduction", "Informatique", 
    "Restauration", "Événementiel"
  ];

  const availableLanguages = [
    "Arabe", "Français", "Anglais", "Espagnol", 
    "Portugais", "Allemand", "Italien", "Chinois", "Japonais"
  ];

  const stadiumOptions = [
    "Pas de préférence",
    "Grand Stade Hassan II",
    "Stade Prince Moulay Abdellah",
    "Grand Stade de Tanger",
    "Stade de Fès",
    "Grand Stade de Marrakech",
    "Grand Stade d'Agadir"
  ];

  const educationOptions = [
    { value: 'bac', label: 'Baccalauréat' },
    { value: 'bac2', label: 'Bac+2 (BTS / DUT)' },
    { value: 'bac3', label: 'Bac+3 (Licence)' },
    { value: 'bac5', label: 'Bac+5 (Master / Ingénieur)' },
    { value: 'phd', label: 'Doctorat (PhD)' }
  ];

  const availabilityOptions = [
    { value: 'full', label: 'Temps plein' },
    { value: 'morning', label: 'Matinées' },
    { value: 'evening', label: 'Soirées' },
    { value: 'weekend', label: 'Week-ends' }
  ];

  const loadProfile = async (email: string) => {
    setLoading(true);
    setErrorMsg('');
    let redirecting = false;
    try {
      const res = await fetch(`/api/volunteers/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data: VolunteerProfile = await res.json();
        setProfile(data);
        generateShifts(data);
      } else if (res.status === 404) {
        // L'utilisateur n'a pas de profil volontaire dans Odoo -> Redirection directe vers le formulaire d'inscription
        redirecting = true;
        setProfile(null);
        router.push('/volunteer/register');
      } else {
        setProfile(null);
        setErrorMsg('Erreur lors de la récupération de votre profil.');
      }
    } catch (err) {
      console.error('[Volunteer Dashboard] Erreur de chargement du profil :', err);
      setErrorMsg('Erreur de connexion au serveur pour récupérer vos informations.');
    } finally {
      setLoading(false);
      if (!redirecting) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        if (user.role === 'admin') {
          setInitialLoading(false);
        } else {
          loadProfile(user.email);
        }
      } else {
        setProfile(null);
        setShifts([]);
        setInitialLoading(false);
      }
    }
  }, [user, authLoading]);

  // Synchroniser l'état du formulaire d'édition lorsque le profil est chargé ou mis à jour
  useEffect(() => {
    if (profile) {
      setEditPhone(profile.phone || '');
      setEditNationality(profile.nationality || '');
      setEditIdNumber(profile.id_number || '');
      setEditExperience(profile.experience || '');
      setEditAvailability(profile.availability);
      
      // Trouver le libellé du stade préféré
      setEditStadium(profile.preferred_stadium_id ? profile.preferred_stadium_id[1] : 'Pas de préférence');
      
      setEditLicense(profile.has_driving_license);
      setEditVehicle(profile.has_vehicle);
      setEditFirstAid(profile.has_first_aid);
      setEditEducationLevel(profile.education_level || 'bac3');
      setEditSkills(profile.skill_ids ? profile.skill_ids.map(s => s[1]) : []);
      setEditLanguages(profile.language_ids ? profile.language_ids.map(l => l[1]) : []);
    }
  }, [profile]);

  const toggleEditSkill = (skill: string) => {
    if (editSkills.includes(skill)) {
      setEditSkills(editSkills.filter(s => s !== skill));
    } else {
      setEditSkills([...editSkills, skill]);
    }
  };

  const toggleEditLanguage = (lang: string) => {
    if (editLanguages.includes(lang)) {
      setEditLanguages(editLanguages.filter(l => l !== lang));
    } else {
      setEditLanguages([...editLanguages, lang]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      // Calcul du matching score en direct
      let score = 0;
      score += Math.min(editLanguages.length * 6, 30);
      score += Math.min(editSkills.length * 5, 30);
      if (editLicense) score += 10;
      if (editVehicle) score += 5;
      if (editFirstAid || editSkills.includes("Premiers secours")) score += 10;
      
      if (editAvailability === "full") score += 10;
      else if (editAvailability === "morning" || editAvailability === "evening") score += 5;
      else if (editAvailability === "weekend") score += 3;

      if (editEducationLevel === "phd") score += 5;
      else if (editEducationLevel === "bac5") score += 4;
      else if (editEducationLevel === "bac3") score += 3;
      else if (editEducationLevel === "bac2") score += 2;
      else score += 1;

      const calculatedScore = Math.min(100, Math.max(0, score));

      const payload = {
        name: profile?.name,
        phone: editPhone,
        nationality: editNationality,
        id_number: editIdNumber,
        experience: editExperience,
        availability: editAvailability,
        preferred_stadium_id: editStadium,
        has_driving_license: editLicense,
        has_vehicle: editVehicle,
        has_first_aid: editFirstAid,
        education_level: editEducationLevel,
        skills: editSkills,
        languages: editLanguages,
        matching_score: calculatedScore
      };

      const res = await fetch(`/api/volunteers/profile?email=${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Recharger le profil pour mettre à jour l'en-tête (points, score, etc.)
        await loadProfile(user.email);
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        const errorData = await res.json();
        setSaveError(errorData.error || 'Erreur lors de l\'enregistrement du profil');
      }
    } catch (err) {
      console.error('[Volunteer Profile Edit] Erreur de sauvegarde :', err);
      setSaveError('Erreur de connexion lors de la sauvegarde.');
    } finally {
      setSaveLoading(false);
    }
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
        return (
          <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-display font-semibold text-xs border border-zinc-700/50 flex items-center gap-1.5 shrink-0 select-none">
            <FileText className="w-3.5 h-3.5" />
            <span>Candidat (En étude)</span>
          </span>
        );
      case 'preselected':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-display font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 shrink-0 select-none">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Présélectionné (Entretien)</span>
          </span>
        );
      case 'trained':
        return (
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-display font-semibold text-xs border border-sky-500/30 flex items-center gap-1.5 shrink-0 select-none">
            <Award className="w-3.5 h-3.5" />
            <span>Formé (Prêt)</span>
          </span>
        );
      case 'assigned':
        return (
          <span className="px-3 py-1 rounded-full bg-[#34d399]/10 text-[#34d399] font-display font-semibold text-xs border border-[#34d399]/30 flex items-center gap-1.5 shrink-0 select-none">
            <Calendar className="w-3.5 h-3.5" />
            <span>Assigné (Shifts programmés)</span>
          </span>
        );
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-neutral-950 font-display font-black text-xs flex items-center gap-1.5 shrink-0 select-none animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Actif sur le Terrain</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-500 font-display font-semibold text-xs shrink-0 flex items-center gap-1.5 border border-zinc-800/60 select-none">
            <XCircle className="w-3.5 h-3.5" />
            <span>Archivé</span>
          </span>
        );
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

  if (initialLoading || authLoading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#34d399]/20 border-t-[#34d399] animate-spin" />
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Chargement de l'Espace Volontaire...</p>
        </div>
      </div>
    );
  }

  // --- ÉCRAN A : VISITEUR NON CONNECTÉ (INVITE DE CONNEXION) ---
  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 pt-28 pb-20 min-h-[750px] flex items-center justify-center animate-in fade-in duration-300">
        <div className="w-full glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 relative shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#34d399]">
              <Lock className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
            Espace Volontaire
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Connectez-vous pour suivre votre dossier de candidature, voir votre score de matching IA Odoo et consulter votre planning de shifts.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Se connecter / S'inscrire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <Link
              href="/volunteer/register"
              className="block w-full py-3 rounded-xl border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800/30 font-display font-bold text-xs uppercase tracking-widest transition-all"
            >
              Postuler pour être volontaire
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- ÉCRAN B : UTILISATEUR CONNECTÉ EN TANT QU'ADMINISTRATEUR ---
  if (user.role === 'admin') {
    return (
      <main className="max-w-md mx-auto px-4 pt-28 pb-20 min-h-[750px] flex items-center justify-center animate-in fade-in duration-300">
        <div className="w-full glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 relative shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#34d399]">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
            Compte Organisateur
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Vous êtes connecté en tant qu'<strong>Organisateur</strong>. L'espace volontaire est réservé aux candidats et volontaires externes.
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Accéder au Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800/30 font-display font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- ÉCRAN C : CONNECTÉ MAIS PAS ENCORE VOLONTAIRE DANS ODOO (PUBLIC USER) ---
  if (!profile) {
    return (
      <main className="max-w-md mx-auto px-4 pt-28 pb-20 min-h-[750px] flex items-center justify-center animate-in fade-in duration-300">
        <div className="w-full glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 relative shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#34d399]">
              <UserCheck className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
            Rejoignez l'Équipe
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Bonjour <strong>{user.name}</strong>. Vous êtes connecté avec un compte supporter, mais vous n'avez pas encore postulé pour devenir volontaire de la Coupe du Monde 2030.
          </p>

          <div className="space-y-3">
            <Link
              href="/volunteer/register"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Devenir Volontaire 📝</span>
            </Link>
            
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800/30 font-display font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {getStatusBadge(profile.state)}
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20 flex items-center gap-1 shrink-0 select-none">
                  <Award className="w-3 h-3 text-amber-400" />
                  {profile.points} pts
                </span>
                {profile.badge_count > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#34d399] font-mono text-[10px] font-bold border border-[#34d399]/20 flex items-center gap-1 shrink-0 select-none">
                    <ShieldCheck className="w-3 h-3 text-[#34d399]" />
                    {profile.badge_count} badge{profile.badge_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Inscrit le {new Date(profile.application_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} — ID #{profile.id}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-zinc-700/50 text-zinc-300 font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399]"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </header>

      {/* 2. NAVIGATION PAR ONGLETS */}
      <div className="flex border-b border-zinc-800/80 mb-8 gap-2">
        <button
          onClick={() => setActiveTab('planning')}
          className={`pb-4 px-6 font-display font-black text-xs uppercase tracking-widest cursor-pointer transition-all relative ${
            activeTab === 'planning' ? 'text-[#34d399]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Planning & Missions
          </span>
          {activeTab === 'planning' && (
            <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#34d399] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 font-display font-black text-xs uppercase tracking-widest cursor-pointer transition-all relative ${
            activeTab === 'profile' ? 'text-[#34d399]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Modifier mon Profil
          </span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#34d399] rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'planning' ? (
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
                  <span className="text-zinc-300 font-bold">{getEducationLevelLabel(profile.education_level)}</span>
                </div>

                <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                  <span className="text-zinc-500 uppercase text-[10px]">Disponibilité</span>
                  <span className="text-zinc-300 font-bold">
                    {profile.availability === 'full' ? 'Temps plein' : (profile.availability === 'morning' ? 'Matinées' : (profile.availability === 'evening' ? 'Soirées' : 'Week-ends'))}
                  </span>
                </div>

                <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                  <span className="text-zinc-500 uppercase text-[10px]">Permis de Conduire</span>
                  <span className="text-zinc-300 font-bold">{profile.has_driving_license ? 'Oui' : 'Non'}</span>
                </div>

                <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                  <span className="text-zinc-500 uppercase text-[10px]">Premiers Secours</span>
                  <span className="text-[#34d399] font-bold">{profile.has_first_aid ? 'Certifié ⛑' : 'Non certifié'}</span>
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
      ) : (
        <form onSubmit={handleSaveProfile} className="glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <h3 className="text-xl font-display font-black text-white uppercase tracking-wider mb-6 pb-3 border-b border-zinc-800 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#34d399]" />
            <span>Mettre à jour mes informations</span>
          </h3>

          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-[#34d399] rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Votre profil a été mis à jour avec succès !</span>
            </div>
          )}

          {saveError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Colonne gauche : Renseignements */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Nom Complet (Lecture seule)
                </label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Email (Lecture seule)
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    value={editNationality}
                    onChange={(e) => setEditNationality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    CIN / Passeport
                  </label>
                  <input
                    type="text"
                    value={editIdNumber}
                    onChange={(e) => setEditIdNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Niveau d'études
                  </label>
                  <select
                    value={editEducationLevel}
                    onChange={(e) => setEditEducationLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer"
                  >
                    {educationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Disponibilité
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer"
                  >
                    {availabilityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Stade Préféré
                  </label>
                  <select
                    value={editStadium}
                    onChange={(e) => setEditStadium(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer"
                  >
                    {stadiumOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Expérience antérieure
                </label>
                <textarea
                  value={editExperience}
                  onChange={(e) => setEditExperience(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm font-sans resize-none"
                  placeholder="Décrivez brièvement vos expériences de bénévolat ou professionnelles..."
                />
              </div>
            </div>

            {/* Colonne droite : Compétences & Langues */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#34d399] mb-3 font-display">
                  Compétences (Cliquez pour sélectionner)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => {
                    const isSelected = editSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleEditSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                          isSelected
                            ? 'bg-[#34d399] text-[#0a0a0a] border-[#34d399] font-black shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                            : 'bg-black/30 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-sky-400 mb-3 font-display">
                  Langues Parlées (Cliquez pour sélectionner)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map(lang => {
                    const isSelected = editLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleEditLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                          isSelected
                            ? 'bg-[#0ea5e9]/20 text-sky-400 border-sky-500/50 font-black shadow-[0_0_8px_rgba(14,165,233,0.15)]'
                            : 'bg-black/30 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 bg-black/25 p-4 rounded-xl border border-zinc-800/80">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Déclarations Additionnelles
                </span>
                
                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all">
                  <input
                    type="checkbox"
                    checked={editLicense}
                    onChange={(e) => setEditLicense(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                  />
                  <span>Permis de conduire 🚗</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all">
                  <input
                    type="checkbox"
                    checked={editVehicle}
                    onChange={(e) => setEditVehicle(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                  />
                  <span>Véhicule personnel 🏍️</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all">
                  <input
                    type="checkbox"
                    checked={editFirstAid}
                    onChange={(e) => setEditFirstAid(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                  />
                  <span>Certifié premiers secours ⛑️</span>
                </label>
              </div>
            </div>

          </div>

          <div className="flex justify-end items-center mt-8 pt-4 border-t border-zinc-900">
            <button
              type="submit"
              disabled={saveLoading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder les modifications</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
