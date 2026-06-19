"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  User, 
  Target, 
  Calendar, 
  Check, 
  Upload, 
  X, 
  MapPin,
  ArrowRight,
  ArrowLeft,
  Smile,
  Globe2,
  Bookmark,
  Award,
  ChevronDown
} from 'lucide-react';

interface VolunteerSectionProps {
  onAddVolunteer: (score: number) => void;
  currentCount: number;
  onNavigate?: (tab: string) => void;
}

export default function VolunteerSection({ onAddVolunteer, currentCount, onNavigate }: VolunteerSectionProps) {
  // Wizard steps: 1 (Identité), 2 (Compétences), 3 (Disponibilité), 4 (Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');

  // Step 1: Identity Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Homme' | 'Femme'>('Homme');
  const [nationality, setNationality] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Skills & Languages Data
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [hasLicense, setHasLicense] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [hasFirstAid, setHasFirstAid] = useState(false);
  const [educationLevel, setEducationLevel] = useState<string>('Licence (Bac+3)');
  const [pastExperience, setPastExperience] = useState('');

  // Step 3: Availability & Preference Data
  const [availability, setAvailability] = useState<string>('Temps plein');
  const [preferredStadium, setPreferredStadium] = useState<string>('Pas de préférence');

  // Computed matching score preserved for the final screen
  const [finalScore, setFinalScore] = useState<number>(75);

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
    "Grand Stade de Casablanca (Casablanca)",
    "Stade Prince Moulay Abdellah (Rabat)",
    "Stade de Tanger (Tanger)",
    "Stade de Fès (Fès)",
    "Stade de Marrakech (Marrakech)",
    "Stade Adrar (Agadir)"
  ];

  // Helper: Verify if date of birth is at least 18 years old
  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const birth = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Drag & drop interactive handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processPhotoFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processPhotoFile(files[0]);
    }
  };

  const processPhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError("Veuillez sélectionner uniquement un fichier image (JPG, PNG).");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setValidationError('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Switch skills selections
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Switch languages select
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Step validation helpers
  const handleNextStep = () => {
    setValidationError('');

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setValidationError("Le nom complet est requis.");
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setValidationError("Une adresse courriel valide est requise.");
        return;
      }
      if (!birthDate) {
        setValidationError("La date de naissance est requise.");
        return;
      }
      const age = calculateAge(birthDate);
      if (age < 18) {
        setValidationError(`Vous devez avoir au moins 18 ans pour vous inscrire (âge actuel : ${age} ans).`);
        return;
      }
      if (!nationality.trim()) {
        setValidationError("La nationalité est requise.");
        return;
      }
      if (!docNumber.trim()) {
        setValidationError("Le CIN ou numéro de passeport est requis pour l'accréditation securisée.");
        return;
      }
    } 
    
    else if (currentStep === 2) {
      if (selectedSkills.length === 0) {
        setValidationError("Veuillez sélectionner au moins une compétence.");
        return;
      }
      if (selectedLanguages.length === 0) {
        setValidationError("Veuillez sélectionner au moins une langue parlée.");
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setValidationError('');
    setCurrentStep(prev => prev - 1);
  };

  // Final Form Submit Action
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!availability) {
      setValidationError("Veuillez choisir un créneau de disponibilité.");
      return;
    }

    // Dynamic AI and human matching score calculation logic
    let score = 52; // Base score
    
    // Skill contribution (+4 per skill, capped at +16)
    score += Math.min(16, selectedSkills.length * 4);
    
    // Languages contribution (+5 per language, capped at +20)
    score += Math.min(20, selectedLanguages.length * 5);

    // Certifications / Extras and profiles evaluation bonus
    if (hasFirstAid || selectedSkills.includes("Premiers secours")) score += 6;
    if (hasLicense) score += 4;
    if (hasVehicle) score += 3;

    // High matching priorities
    if (availability === "Temps plein") score += 10;
    
    // Languages affinity bonus for 2030 (combining Arabic, Spanish, French, English, Portuguese)
    const matchesCoHosts = selectedLanguages.some(l => ["Espagnol", "Portugais", "Arabe", "Français"].includes(l));
    if (matchesCoHosts) score += 5;

    // Motivation and experience check
    if (pastExperience.trim().length > 40) score += 4;

    // Capping at a high premium profile (max 99)
    const finalCalculated = Math.min(99, Math.max(68, score));
    setFinalScore(finalCalculated);

    // Report back to App.tsx score summary tracker
    onAddVolunteer(finalCalculated);

    // Roll to Step 4: Success confirmation Screen
    setCurrentStep(4);
  };

  // Reset complete process wizard state
  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setBirthDate('');
    setGender('Homme');
    setNationality('');
    setDocNumber('');
    setAddress('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setHasLicense(false);
    setHasVehicle(false);
    setHasFirstAid(false);
    setEducationLevel('Licence (Bac+3)');
    setPastExperience('');
    setAvailability('Temps plein');
    setPreferredStadium('Pas de préférence');
    setCurrentStep(1);
    setValidationError('');
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto min-h-[750px] animate-slide-up" id="volunteer-page">
      
      {/* 1. EN-TÊTE */}
      <div className="text-center mb-10" id="volunteer-header">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-4 py-1.5 rounded-full mb-3 inline-block">
          🤝 Programme des Volontaires Coupe du Monde 2030
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">
          Deviens Volontaire 🤝
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Rejoins 5 000 bénévoles du monde entier pour vivre l'événement de l'intérieur au Maroc, Espagne et Portugal.
        </p>
      </div>

      {/* 2. BARRE DE PROGRESSION */}
      <div className="mb-12 max-w-4xl mx-auto px-2" id="volunteer-progressbar">
        <div className="relative flex items-center justify-between">
          
          {/* Background Connecting Lines */}
          <div className="absolute left-0 right-0 h-[2px] bg-zinc-800 -translate-y-1/2 top-1/2 -z-10" />
          
          {/* Golden/Emerald Progress Filled Line */}
          <div 
            className="absolute left-0 h-[2px] bg-[#34d399] -translate-y-1/2 top-1/2 transition-all duration-500 ease-out -z-10"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {/* Step 1: Identité */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-all border duration-300 ${
              currentStep === 1 
                ? 'bg-[#34d399] text-[#0a0a0a] border-white scale-110 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                : currentStep > 1 
                ? 'bg-[#34d399] text-[#0a0a0a] border-[#34d399]' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <User className="w-5 h-5" />}
            </div>
            <span className={`mt-2 text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              currentStep >= 1 ? 'text-[#34d399] font-bold' : 'text-zinc-500'
            }`}>
              Identité
            </span>
          </div>

          {/* Step 2: Compétences */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-all border duration-300 ${
              currentStep === 2 
                ? 'bg-[#34d399] text-[#0a0a0a] border-white scale-110 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                : currentStep > 2 
                ? 'bg-[#34d399] text-[#0a0a0a] border-[#34d399]' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}>
              {currentStep > 2 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Target className="w-5 h-5" />}
            </div>
            <span className={`mt-2 text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              currentStep >= 2 ? 'text-[#34d399] font-bold' : 'text-zinc-500'
            }`}>
              Compétences
            </span>
          </div>

          {/* Step 3: Disponibilité */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-all border duration-300 ${
              currentStep === 3 
                ? 'bg-[#34d399] text-[#0a0a0a] border-white scale-110 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                : currentStep > 3 
                ? 'bg-[#34d399] text-[#0a0a0a] border-[#34d399]' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}>
              {currentStep > 3 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Calendar className="w-5 h-5" />}
            </div>
            <span className={`mt-2 text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              currentStep >= 3 ? 'text-[#34d399] font-bold' : 'text-zinc-500'
            }`}>
              Disponibilité
            </span>
          </div>

          {/* Step 4: Confirmation */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-all border duration-300 ${
              currentStep === 4 
                ? 'bg-[#34d399] text-[#0a0a0a] border-white scale-110 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}>
              <Check className="w-5 h-5" />
            </div>
            <span className={`mt-2 text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              currentStep === 4 ? 'text-[#34d399] font-bold' : 'text-zinc-500'
            }`}>
              Confirmation
            </span>
          </div>

        </div>
      </div>

      {/* Validation alert box if an input fails */}
      {validationError && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-400/10 border border-red-500/40 text-red-200 rounded-2xl flex items-center gap-3 text-xs md:text-sm uppercase tracking-wider font-semibold animate-shake" id="error-validation-banner">
          <span>⚠️</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* 3. FORMULAIRE ÉTAPE 1 — IDENTITÉ */}
      {currentStep === 1 && (
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-2xl relative max-w-4xl mx-auto" id="step-1-identity">
          <h3 className="text-xl font-display font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
            <span className="text-lg">👤</span> Étape 1 : Renseignements Personnels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left side: Regular inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Nom Complet <span className="text-[#34d399]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Youssef Benjelloun"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Adresse Courriel <span className="text-[#34d399]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: youssef@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Téléphone Portable
                </label>
                <input
                  type="tel"
                  placeholder="Ex: +212 661-234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Date de Naissance (18 ans min) <span className="text-[#34d399]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer shadow-inner [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display col-span-2">
                    Genre <span className="text-[#34d399]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('Homme')}
                      className={`py-3 rounded-xl font-medium text-xs uppercase tracking-wider transition-all border ${
                        gender === 'Homme' 
                          ? 'border-[#34d399] bg-[#34d399]/10 text-white font-bold' 
                          : 'border-zinc-800 bg-black/30 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      Homme 👨
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Femme')}
                      className={`py-3 rounded-xl font-medium text-xs uppercase tracking-wider transition-all border ${
                        gender === 'Femme' 
                          ? 'border-[#34d399] bg-[#34d399]/10 text-white font-bold' 
                          : 'border-zinc-800 bg-black/30 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      Femme 👩
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Identifiers & Photo */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    Nationalité <span className="text-[#34d399]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Marocaine"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                    CIN / Passeport <span className="text-[#34d399]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: AB123456"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Adresse Résidentielle
                </label>
                <textarea
                  placeholder="Ex: Quartier Gauthier, Casablanca, Maroc..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm font-sans shadow-inner resize-none"
                />
              </div>

              {/* Photo Upload Area (drag & drop) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Photo d'Identité Officielle (Badge)
                </label>
                
                {photoPreview ? (
                  <div className="relative border border-[#34d399] bg-[#34d399]/5 rounded-xl p-3 flex items-center justify-between" id="photo-preview-element">
                    <div className="flex items-center gap-3">
                      <img 
                        src={photoPreview} 
                        alt="Aperçu photo" 
                        className="w-12 h-12 rounded-lg object-cover border border-[#34d399]/30"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white max-w-[150px] truncate">{photoFile?.name}</p>
                        <p className="text-[10px] font-mono text-[#34d399]">Format image OK</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      title="Supprimer la photo"
                      className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    id="dropzone-photo"
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col justify-center items-center ${
                      isDragging 
                        ? 'border-[#34d399] bg-[#34d399]/10 text-[#34d399]' 
                        : 'border-[#34d399]/40 hover:border-[#34d399] hover:bg-[#34d399]/5 text-zinc-400'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <Upload className="w-6 h-6 mb-2 text-[#34d399] animate-bounce" />
                    <p className="text-xs font-bold text-white">Faites glisser votre photo ici</p>
                    <p className="text-[10px] text-zinc-400 mt-1">ou cliquez pour parcourir les dossiers (reco : portrait, fond neutre)</p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('accueil') : handleResetForm()}
              className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-semibold uppercase tracking-wider text-xs cursor-pointer flex items-center gap-2"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center gap-2 active:scale-95 transition-all"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. FORMULAIRE ÉTAPE 2 — COMPÉTENCES */}
      {currentStep === 2 && (
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-2xl relative max-w-4xl mx-auto" id="step-2-skills">
          <h3 className="text-xl font-display font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
            <span className="text-lg">🎯</span> Étape 2 : Compétences & Profil de Bénévolat
          </h3>

          <div className="space-y-6">

            {/* Competency chips */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#34d399] mb-3 font-display">
                Sélectionnez vos Compétences clés <span className="text-[#34d399]">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                        isSelected 
                          ? 'bg-[#34d399] text-[#0a0a0a] border-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.25)]' 
                          : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {skill === 'Premiers secours' && '🩺 '}
                      {skill === 'Communication' && '🎙️ '}
                      {skill === 'Logistique' && '📦 '}
                      {skill === 'Conduite' && '🚗 '}
                      {skill === 'Accueil' && '👑 '}
                      {skill === 'Sécurité' && '🛡️ '}
                      {skill === 'Traduction' && '🗣️ '}
                      {skill === 'Informatique' && '💻 '}
                      {skill === 'Restauration' && '🍽️ '}
                      {skill === 'Événementiel' && '🎉 '}
                      {skill}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Plusieurs sélections possibles. Choisissez vos points forts pour un placement idéal.</p>
            </div>

            {/* Languages spoken */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#fbbf24] mb-3 font-display">
                Langues Parlées Couramment <span className="text-[#34d399]">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                        isSelected 
                          ? 'bg-[#fbbf24]/20 border-[#fbbf24]/70 text-[#fbbf24]' 
                          : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {lang === 'Arabe' && '🇲🇦 '}
                      {lang === 'Français' && '🇫🇷 '}
                      {lang === 'Anglais' && '🇬🇧 '}
                      {lang === 'Espagnol' && '🇪🇸 '}
                      {lang === 'Portugais' && '🇵🇹 '}
                      {lang === 'Allemand' && '🇩🇪 '}
                      {lang === 'Italien' && '🇮🇹 '}
                      {lang === 'Chinois' && '🇨🇳 '}
                      {lang === 'Japonais' && '🇯🇵 '}
                      {lang}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Le trilinguisme ou bilinguisme (Arabe / Français / Anglais / Espagnol) augmente considérablement votre score d'affection.</p>
            </div>

            {/* Checkboxes / Declarative credentials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/25 p-4 rounded-xl border border-zinc-800/80">
              
              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all py-1">
                <input
                  type="checkbox"
                  checked={hasLicense}
                  onChange={(e) => setHasLicense(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                />
                <div className="text-left">
                  <span className="font-bold">Permis de conduire 🚗</span>
                  <p className="text-[10px] text-zinc-500">Valide au Maroc / International</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all py-1">
                <input
                  type="checkbox"
                  checked={hasVehicle}
                  onChange={(e) => setHasVehicle(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                />
                <div className="text-left">
                  <span className="font-bold">Véhicule personnel 🚘</span>
                  <p className="text-[10px] text-zinc-500">Disponible lors du tournoi</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-300 hover:text-[#34d399] transition-all py-1">
                <input
                  type="checkbox"
                  checked={hasFirstAid}
                  onChange={(e) => setHasFirstAid(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 text-[#34d399] accent-[#34d399] cursor-pointer"
                />
                <div className="text-left">
                  <span className="font-bold">Formation premiers secours 🩺</span>
                  <p className="text-[10px] text-zinc-500">Certificat secouriste actif</p>
                </div>
              </label>

            </div>

            {/* Level of education: styled radio buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#34d399] mb-3 font-display">
                Niveau d'études académiques
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["Baccalauréat", "Bac+2", "Licence (Bac+3)", "Master (Bac+5)", "Doctorat"].map((level) => {
                  const isLevelSelected = educationLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setEducationLevel(level)}
                      className={`py-3 px-2.5 rounded-xl text-center text-[11px] font-bold uppercase transition-all border cursor-pointer select-none ${
                        isLevelSelected 
                          ? 'border-[#34d399] bg-[#34d399]/10 text-white' 
                          : 'border-zinc-800 bg-black/30 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience text area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 font-display">
                Expériences bénévoles antérieures ou motivation additionnelle
              </label>
              <textarea
                placeholder="Renseignez ici si vous avez déjà été bénévole pour la CAF, des événements sportifs ou culturels officiels..."
                value={pastExperience}
                onChange={(e) => setPastExperience(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm font-sans shadow-inner resize-none"
              />
            </div>

          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-semibold uppercase tracking-wider text-xs cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center gap-2 active:scale-95 transition-all"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. FORMULAIRE ÉTAPE 3 — DISPONIBILITÉ & AFFECTATION */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmitForm} className="glass-panel rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-2xl relative max-w-4xl mx-auto" id="step-3-availability">
          <h3 className="text-xl font-display font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
            <span className="text-lg">📅</span> Étape 3 : Disponibilité & Affectation des Stades
          </h3>

          <div className="space-y-6">
            
            {/* 4 Clickable cards for availability */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#34d399] mb-3 font-display">
                Créneau de Disponibilité Préféré <span className="text-[#34d399]">*</span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {[
                  { id: 'Temps plein', title: '☀️ Temps plein', desc: 'Disponibilité maximale' },
                  { id: 'Matin', title: '🌅 Matin', desc: '07h00 - 13h00' },
                  { id: 'Soir', title: '🌙 Soir', desc: '14h00 - 22h00' },
                  { id: 'Week-end', title: '📅 Week-end', desc: 'Matchs de samedi/dimanche' }
                ].map((slot) => {
                  const isSelected = availability === slot.id;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setAvailability(slot.id)}
                      className={`p-5 rounded-2xl border cursor-pointer select-none text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        isSelected 
                          ? 'border-[#34d399] bg-[#34d399]/10 text-white shadow-[0_0_20px_rgba(52,211,153,0.2)] scale-102' 
                          : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <h4 className="font-display font-bold text-sm md:text-base leading-tight uppercase">
                        {slot.title}
                      </h4>
                      <p className="text-[10.5px] text-zinc-500 font-mono mt-1">
                        {slot.desc}
                      </p>
                    </div>
                  );
                })}

              </div>
              <p className="text-[10px] text-zinc-500 mt-2">La sélection "Temps Plein" est un point clé pour augmenter vos chances d'accréditation majeure auprès du Comité FIFA.</p>
            </div>

            {/* Preferred Stadium Selector (Morocco Stadiums) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#fbbf24] mb-3 font-display">
                Stade d'Affectation Souhaité au Maroc <span className="text-[#34d399]">*</span>
              </label>
              
              <div className="relative w-full md:max-w-xl">
                <select
                  value={preferredStadium}
                  onChange={(e) => setPreferredStadium(e.target.value)}
                  className="w-full px-4 py-3.5 pr-10 rounded-xl bg-black/45 border border-zinc-800 text-white focus:outline-none focus:border-[#33d399] transition-all text-sm cursor-pointer shadow-inner appearance-none font-display font-bold"
                >
                  {stadiumOptions.map((stadium) => (
                    <option key={stadium} value={stadium} className="bg-[#0e0e11] font-sans">
                      {stadium}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Nous planifierons vos affectations sur le site le plus proche possible de votre adresse ou de votre préférence.</p>
            </div>

            {/* General conditions check */}
            <div className="p-4 bg-[#34d399]/5 border border-[#34d399]/25 rounded-2xl flex items-start gap-3.5 max-w-2xl">
              <span className="text-xl">🙌</span>
              <div className="text-left text-xs text-zinc-400 leading-normal">
                <p className="font-bold text-white uppercase tracking-wider text-[10.5px] mb-1">
                  Recommandations du Comité d'Organisation
                </p>
                En soumettant votre candidature, vous consentez à assister aux courtes sessions de formation obligatoire programmées en ligne et sur site au Maroc à l'approche de la compétition en Juin 2030.
              </div>
            </div>

          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-semibold uppercase tracking-wider text-xs cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.25)] flex items-center gap-2 active:scale-95 transition-all"
            >
              Soumettre ma candidature ✓
            </button>
          </div>
        </form>
      )}

      {/* 6. ÉTAPE 4 — CONFIRMATION */}
      {currentStep === 4 && (
        <div className="glass-panel rounded-2xl p-6 md:p-10 border border-[#34d399]/30 shadow-2xl relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-8 animate-fade-in" id="step-4-confirmation">
          
          {/* Success Checkmark Circle Animation */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            
            {/* Background pulsating pulse */}
            <div className="absolute inset-0 bg-[#34d399]/15 rounded-full scale-120 animate-ping opacity-60 pointer-events-none" />
            
            {/* Outer green ring */}
            <div className="absolute inset-0 rounded-full border-4 border-[#34d399] opacity-30" />
            
            {/* Inner dynamic drawing SVG checkmark */}
            <svg className="w-20 h-20 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path 
                className="animate-draw-checkmark" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7" 
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 0,
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white uppercase tracking-tight">
              Candidature envoyée avec succès ! 🎉
            </h3>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Vous recevrez un email de confirmation à <span className="text-[#34d399] font-bold">{email || "votre email"}</span>. Notre équipe examinera votre profil dans les prochains jours.
            </p>
          </div>

          {/* Grid Layout for Score + Summary panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-3xl items-stretch">
            
            {/* Left Col: Estimated matching score (Circular Gold indicator) */}
            <div className="md:col-span-5 bg-[#121214]/65 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
              
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#fbbf24] font-bold">
                ÉVALUATION DE MATCHING
              </span>

              {/* Progress Bar Circle */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                
                {/* Visual SVG circles for progress */}
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Outer background gray track */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="rgba(63,63,70,0.3)" 
                    strokeWidth="6" 
                    fill="transparent" 
                  />
                  {/* Dynamic glowing golden track */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#fbbf24" 
                    strokeWidth="6.5" 
                    fill="transparent" 
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * finalScore) / 100}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.35))'
                    }}
                  />
                </svg>

                {/* Score text */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-display font-black text-white leading-none">
                    {finalScore}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 mt-1">
                    SUR 100
                  </span>
                </div>
              </div>

              {/* Ranking Badge Level */}
              <div className="space-y-1">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                  finalScore >= 85 
                    ? 'bg-[#fbbf24]/10 border border-[#fbbf24]/40 text-[#fbbf24]' 
                    : 'bg-[#34d399]/10 border border-[#34d399]/40 text-[#34d399]'
                }`}>
                  🏆 PROFIL : {finalScore >= 85 ? 'AMBASSADEUR ÉLITE' : 'VOLONTAIRE QUALIFIÉ'}
                </span>
                <p className="text-[9.5px] text-zinc-500 max-w-[180px] leading-normal pt-1.5 mx-auto">
                  Calculé sur la base de vos compétences, langues parlées et créneau de temps plein.
                </p>
              </div>

            </div>

            {/* Right Col: Summary Récapitulatif Panel */}
            <div className="md:col-span-7 bg-[#121214]/65 border border-zinc-800/80 rounded-2xl p-6 text-left shadow-inner flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="border-b border-zinc-800/60 pb-2.5 flex justify-between items-center">
                  <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
                    Récapitulatif de votre dossier
                  </span>
                  <span className="text-[9.5px] font-mono text-zinc-500">
                    DOSSIER ID : WC30-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Nom Complet</span>
                    <span className="text-white font-bold">{fullName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Genre & Naissance</span>
                    <span className="text-white font-bold">
                      {gender === 'Homme' ? 'Homme' : 'Femme'} • {ageString(birthDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">CIN / Passeport</span>
                    <span className="text-white font-bold uppercase">{docNumber}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Affectation Stade</span>
                    <span className="text-[#34d399] font-bold truncate max-w-[160px] block" title={preferredStadium}>
                      {preferredStadium.replace(" (Casablanca)", "").replace(" (Rabat)", "").replace(" (Tanger)", "").replace(" (Fès)", "").replace(" (Marrakech)", "").replace(" (Agadir)", "")}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Langues & Compétences</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedLanguages.map(l => (
                        <span key={l} className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9.5px] font-semibold text-zinc-300">
                          {l}
                        </span>
                      ))}
                      {selectedSkills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9.5px] font-semibold text-[#34d399]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {availability && (
                    <div className="col-span-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Faisabilité Disponibilité</span>
                      <span className="text-white font-semibold">🕒 {availability}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subdued footer secure notice */}
              <div className="text-[9.5px] text-zinc-500 font-mono mt-4 pt-3 border-t border-zinc-800/40 flex items-center gap-1">
                <span>🔒</span> Accréditation sécurisée de Comité Général d'Organisation FIFA 2030.
              </div>

            </div>

          </div>

          {/* Return to Home / Reset Wizard Action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-semibold uppercase tracking-wider text-xs cursor-pointer"
            >
              Nouveau dossier
            </button>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('accueil') : handleResetForm()}
              className="px-6 py-3 rounded-xl bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all active:scale-95"
            >
              Retour à l’accueil ⚽
            </button>
          </div>

        </div>
      )}

    </section>
  );
}

// Utility mini helpers for display formatting
function ageString(dob: string) {
  if (!dob) return '';
  const parts = dob.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dob;
}

