/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client JSON-RPC pour la communication avec Odoo 19.
 * Ce module est SERVER-ONLY — il ne doit jamais être importé côté client.
 * Utilise un singleton de session avec authentification automatique.
 */
import 'server-only';
import { ODOO_CONFIG, CACHE_REVALIDATE_SECONDS } from './config';

// === Types ===

export interface OdooRpcError {
  code: number;
  message: string;
  data: {
    name: string;
    debug: string;
    message: string;
    arguments: string[];
  };
}

export interface OdooRpcResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: OdooRpcError;
}

interface OdooSession {
  uid: number;
  authenticatedAt: number;
}

// === Singleton de session ===

let sessionCache: OdooSession | null = null;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Vérifie si le serveur Odoo est joignable.
 */
export async function isOdooAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${ODOO_CONFIG.url}/web/webclient/version_info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: {}, id: 0 }),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Authentification auprès d'Odoo. Retourne le UID de l'utilisateur.
 * Utilise un cache de session (TTL 30 min) pour éviter les appels répétés.
 */
async function getSession(): Promise<OdooSession> {
  // Vérifier le cache de session
  if (sessionCache && (Date.now() - sessionCache.authenticatedAt) < SESSION_TTL_MS) {
    return sessionCache;
  }

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'authenticate',
      args: [ODOO_CONFIG.db, ODOO_CONFIG.user, ODOO_CONFIG.password, {}],
    },
    id: 1,
  };

  const response = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP lors de l'authentification Odoo : ${response.status}`);
  }

  const data: OdooRpcResponse<number | false> = await response.json();
  if (data.error) {
    throw new Error(`Erreur Odoo RPC : ${data.error.data?.message || data.error.message}`);
  }
  if (!data.result) {
    throw new Error('Authentification Odoo échouée : identifiants invalides.');
  }

  sessionCache = {
    uid: data.result as number,
    authenticatedAt: Date.now(),
  };

  console.log(`[Odoo] Session authentifiée — UID: ${sessionCache.uid}`);
  return sessionCache;
}

/**
 * Appelle execute_kw sur l'instance Odoo.
 * Gère automatiquement l'authentification et le retry sur erreur réseau.
 *
 * @param model - Nom du modèle Odoo (ex: 'wc.match')
 * @param method - Méthode à appeler (ex: 'search_read')
 * @param args - Arguments positionnels
 * @param kwargs - Arguments nommés (fields, domain, limit, etc.)
 * @param options - Options de cache Next.js ISR
 */
export async function callOdoo<T>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {},
  options: { revalidate?: number; cache?: RequestCache } = {}
): Promise<T> {
  const session = await getSession();

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        ODOO_CONFIG.db,
        session.uid,
        ODOO_CONFIG.password,
        model,
        method,
        args,
        kwargs,
      ],
    },
    id: Math.floor(Math.random() * 100000),
  };

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  // Configuration du cache ISR Next.js
  if (options.cache) {
    fetchOptions.cache = options.cache;
  } else {
    fetchOptions.next = { revalidate: options.revalidate ?? CACHE_REVALIDATE_SECONDS };
  }

  // Premier essai
  let response: Response;
  try {
    response = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, fetchOptions);
  } catch (error) {
    // Retry une fois sur erreur réseau
    console.warn(`[Odoo] Première tentative échouée pour ${model}.${method}, retry...`);
    try {
      response = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
        ...fetchOptions,
        cache: 'no-store',
      });
    } catch (retryError) {
      throw new Error(
        `[Odoo] Impossible de joindre le serveur après 2 tentatives : ${model}.${method}`
      );
    }
  }

  if (!response.ok) {
    throw new Error(`[Odoo] Erreur HTTP ${response.status} pour ${model}.${method}`);
  }

  const data: OdooRpcResponse<T> = await response.json();
  if (data.error) {
    // Invalider le cache de session si erreur d'accès
    if (data.error.data?.name?.includes('AccessError') || data.error.data?.name?.includes('SessionExpired')) {
      sessionCache = null;
    }
    throw new Error(
      `[Odoo] ${model}.${method} — ${data.error.data?.message || data.error.message}`
    );
  }

  return data.result as T;
}

/**
 * Appelle un controller HTTP Odoo (route web) directement.
 * Utilisé pour des endpoints spécifiques comme /ticket/scan/validate.
 */
export async function callOdooController<T>(
  route: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params,
    id: Math.floor(Math.random() * 100000),
  };

  const response = await fetch(`${ODOO_CONFIG.url}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`[Odoo Controller] Erreur HTTP ${response.status} pour ${route}`);
  }

  const data: OdooRpcResponse<T> = await response.json();
  if (data.error) {
    throw new Error(`[Odoo Controller] ${route} — ${data.error.data?.message || data.error.message}`);
  }

  return data.result as T;
}
