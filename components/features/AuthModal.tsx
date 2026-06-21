'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/AuthContext';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear states when modal closes/opens or tab changes
  useEffect(() => {
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  }, [isAuthModalOpen, activeTab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Erreur lors de la connexion');
        }
      } else {
        const res = await signup(name, email, password);
        if (!res.success) {
          setError(res.error || 'Erreur lors de l\'inscription');
        }
      }
    } catch (err) {
      setError('Une erreur réseau ou serveur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop Close Click */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => !loading && setAuthModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-neutral-950/90 border border-neutral-800/80 shadow-2xl backdrop-blur-md transition-all transform duration-300 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold tracking-tight text-white font-outfit">
              Coupe du Monde FIFA 2030
            </span>
            <p className="text-neutral-400 text-sm mt-1">
              Maroc — Portail Officiel
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-800/60 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              disabled={loading}
              className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 text-center ${
                activeTab === 'login'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('register')}
              disabled={loading}
              className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 cursor-pointer border-b-2 text-center ${
                activeTab === 'register'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-3.5 mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Nom Complet
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Youssef Rhoul"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <span>{activeTab === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
              )}
            </button>
          </form>

          {/* Subtext info */}
          <div className="mt-5 text-center">
            <p className="text-xs text-neutral-500 leading-normal">
              En continuant, vous accédez aux fonctionnalités réservées du portail Coupe du Monde 2030.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
