/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { LEAPTER_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface PricingInputs {
  base_price: number;
  phase_category: string;
  stadium_distance_km: number;
  buyer_profile: string;
  booking_window: string;
  stadium_fill_rate: number;
}

export async function POST(request: Request) {
  try {
    const inputs: PricingInputs = await request.json();

    // Validation minimale des entrées
    if (
      typeof inputs.base_price !== 'number' ||
      !inputs.phase_category ||
      typeof inputs.stadium_distance_km !== 'number' ||
      !inputs.buyer_profile ||
      !inputs.booking_window ||
      typeof inputs.stadium_fill_rate !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Données d\'entrée incomplètes ou invalides' },
        { status: 400 }
      );
    }

    console.log('[API Calculate] Entrées reçues :', inputs);

    // 1. Tenter d'interroger l'API Leapter si la clé est présente
    if (LEAPTER_CONFIG.apiKey && LEAPTER_CONFIG.apiKey !== 'your_leapter_api_key_here') {
      try {
        console.log('[API Calculate] Appel de lab.leapter à l\'adresse :', LEAPTER_CONFIG.url);

        // Préparer l'appel MCP JSON-RPC
        const mcpBody = {
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'calculate_pricing', // Nom du composant logique ou de l'arbre
            arguments: inputs
          },
          id: Date.now()
        };

        const response = await fetch(LEAPTER_CONFIG.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': LEAPTER_CONFIG.apiKey,
            'Authorization': `Bearer ${LEAPTER_CONFIG.apiKey}`
          },
          body: JSON.stringify(mcpBody),
          signal: AbortSignal.timeout(4000) // Timeout de 4 secondes pour éviter de bloquer
        });

        if (response.ok) {
          const result = await response.json();
          console.log('[API Calculate] Réponse brute de Leapter :', result);
          
          // Extraire la valeur selon le format de retour JSON-RPC de Leapter
          let finalPrice = null;
          let calcStatus = 'success';

          if (result.result && result.result.content) {
            // MCP standard tool response format
            const content = result.result.content;
            if (Array.isArray(content) && content[0]?.text) {
              const parsed = JSON.parse(content[0].text);
              finalPrice = parsed.final_price ?? parsed.finalPrice;
              calcStatus = parsed.calculation_status ?? parsed.calculationStatus ?? 'success';
            }
          } else if (result.final_price !== undefined || result.finalPrice !== undefined) {
            // REST direct response format
            finalPrice = result.final_price ?? result.finalPrice;
            calcStatus = result.calculation_status ?? result.calculationStatus ?? 'success';
          }

          if (finalPrice !== null && !isNaN(Number(finalPrice))) {
            return NextResponse.json({
              final_price: Math.round(Number(finalPrice)),
              calculation_status: calcStatus,
              source: 'leapter_api'
            });
          }
        } else {
          console.warn(`[API Calculate] Erreur Leapter (Status ${response.status}). Activation du plan B.`);
        }
      } catch (leapterError) {
        console.error('[API Calculate] Échec lors de la requête vers Leapter. Utilisation du plan B local.', leapterError);
      }
    } else {
      console.log('[API Calculate] Pas de clé LEAPTER_API_KEY configurée. Exécution locale (mode déconnecté).');
    }

    // 2. Plan B : Algorithme de calcul local déterministe (fallback identique)
    const localResult = calculatePriceLocally(inputs);
    return NextResponse.json(localResult);

  } catch (error: any) {
    console.error('[API Calculate] Erreur générale :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur interne lors du calcul' },
      { status: 500 }
    );
  }
}

function calculatePriceLocally(inputs: PricingInputs) {
  const {
    base_price,
    phase_category,
    stadium_distance_km,
    buyer_profile,
    booking_window,
    stadium_fill_rate
  } = inputs;

  // Étape 0 : Court-circuit Delegation FIFA
  if (buyer_profile === 'delegation_fifa') {
    return {
      final_price: 0,
      calculation_status: 'free_fifa_delegation',
      source: 'local_fallback'
    };
  }

  // Étape 1 : Multiplicateur de Phase
  let phaseMultiplier = 1.0;
  switch (phase_category) {
    case 'groupes':
      phaseMultiplier = 1.0;
      break;
    case '8emes':
      phaseMultiplier = 1.2;
      break;
    case 'quarts':
      phaseMultiplier = 1.5;
      break;
    case 'demis':
      phaseMultiplier = 1.9;
      break;
    case 'finale':
      phaseMultiplier = 2.5;
      break;
    default:
      phaseMultiplier = 1.0;
  }
  const p1 = base_price * phaseMultiplier;

  // Étape 2 : Compensation Logistique Distance
  let distanceFactor = 1.0;
  if (stadium_distance_km > 15) {
    distanceFactor = 0.90; // -10%
  }
  const p2 = p1 * distanceFactor;

  // Étape 3 : Réduction Profil Acheteur
  let profileFactor = 1.0;
  if (buyer_profile === 'resident') {
    profileFactor = 0.80; // -20%
  } else if (buyer_profile === 'etudiant') {
    if (base_price <= 1200) {
      profileFactor = 0.60; // -40%
    }
  }
  const p3 = p2 * profileFactor;

  // Étape 4 : Ajustement Temporel (Offre & Demande)
  let temporalFactor = 1.0;
  if (booking_window === 'early_bird') {
    temporalFactor = 0.85; // -15%
  } else if (booking_window === 'last_minute' && stadium_fill_rate > 85) {
    temporalFactor = 1.30; // +30%
  }
  const p4 = p3 * temporalFactor;

  return {
    final_price: Math.round(p4),
    calculation_status: 'success',
    source: 'local_fallback'
  };
}
