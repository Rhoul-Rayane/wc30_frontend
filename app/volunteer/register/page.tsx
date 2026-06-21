"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VolunteerSection from "@/components/features/VolunteerSection";
import { useAuth } from "@/lib/hooks/AuthContext";
import { Lock, ArrowRight, Check } from "lucide-react";

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading, setAuthModalOpen } = useAuth();
  const [count, setCount] = useState<number>(3200);

  useEffect(() => {
    const savedCount = localStorage.getItem("volunteerCount");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleAddVolunteer = async (data: any) => {
    // Persist to Odoo or local mock fallback
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("[volunteer] Résultat enregistrement Odoo/Mock:", result);

      // Force a session refresh to update the user role from 'public' to 'volunteer' in background
      const sessionRes = await fetch('/api/auth/session');
      if (sessionRes.ok) {
        // Just triggers role re-evaluation in background
        window.location.reload();
      }
    } catch (error) {
      console.error("[volunteer] Échec envoi API:", error);
    }

    // Sync with local storage
    const score = data.matching_score || 75;
    const currentCount = parseInt(localStorage.getItem("volunteerCount") || "3200", 10);
    const currentAvg = parseFloat(localStorage.getItem("volunteerAverageScore") || "72.3");
    
    const newCount = currentCount + 1;
    const currentSum = currentAvg * currentCount;
    const newSum = currentSum + score;
    const newAvg = parseFloat((newSum / newCount).toFixed(1));

    localStorage.setItem("volunteerCount", newCount.toString());
    localStorage.setItem("volunteerAverageScore", newAvg.toString());
    
    setCount(newCount);
  };

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case "matchs":
        router.push("/matches");
        break;
      case "stades":
        router.push("/stadiums");
        break;
      case "dashboard":
        router.push("/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  if (authLoading) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-[#34d399]/20 border-t-[#34d399] animate-spin" />
        <p className="mt-4 text-zinc-400 font-mono text-xs uppercase tracking-wider">Vérification de la session...</p>
      </div>
    );
  }

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
            Devenir Volontaire
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Pour soumettre votre candidature et participer à l'organisation de la Coupe du Monde 2030, veuillez d'abord créer un compte ou vous connecter.
          </p>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Se connecter / S'inscrire</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    );
  }

  if (user.role === 'volunteer') {
    return (
      <main className="max-w-md mx-auto px-4 pt-28 pb-20 min-h-[750px] flex items-center justify-center animate-in fade-in duration-300">
        <div className="w-full glass-panel border border-zinc-700/30 rounded-2xl p-6 md:p-8 relative shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-[#34d399]" />
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#34d399]">
              <Check className="w-10 h-10" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
            Candidature Validée
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Vous êtes déjà enregistré en tant que volontaire Coupe du Monde 2030. Votre candidature est en cours d'analyse.
          </p>

          <Link
            href="/volunteer/dashboard"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#34d399] to-[#10b981] font-display font-bold text-[#0a0a0a] hover:opacity-95 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(52,211,153,0.15)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Accéder à mon espace membre</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="pt-16 pb-12">
      <VolunteerSection
        onAddVolunteer={handleAddVolunteer}
        currentCount={count}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
