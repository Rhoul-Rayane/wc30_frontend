"use client";

import React, { useState, useEffect } from "react";
import ScannerSection from "@/components/features/ScannerSection";
import { useAuth } from "@/lib/hooks/AuthContext";

export default function ScanPage() {
  const [ticketToken, setTicketToken] = useState<string>("");
  const { user, loading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("lastGeneratedTicketToken");
    if (token) {
      setTicketToken(token);
    }
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-zinc-400">Vérification des autorisations...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-24 pb-12 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-outfit text-white mb-2">Accès Refusé</h1>
        <p className="text-zinc-400 max-w-md">
          Cette page de contrôle d'accès et de numérisation de badges est strictement réservée aux organisateurs Coupe du Monde 2030 munis d'un compte d'administration.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-12">
      <ScannerSection lastGeneratedTicketToken={ticketToken} />
    </div>
  );
}
