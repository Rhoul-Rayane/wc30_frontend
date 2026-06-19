/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client de communication JSON-RPC avec Odoo v19.
 * Conforme aux spécifications de la constitution du projet (gemini_v2.mmd).
 */

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";
const ODOO_DB = process.env.ODOO_DB || "worldcup";

export interface OdooRpcParams {
  model: string;
  method: string;
  args: any[];
  kwargs: Record<string, any>;
}

/**
 * Fonction générique pour appeler execute_kw sur l'instance Odoo.
 */
export async function callOdoo<T>(
  uid: number,
  password: string,
  params: OdooRpcParams
): Promise<T> {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        ODOO_DB,
        uid,
        password,
        params.model,
        params.method,
        params.args,
        params.kwargs
      ]
    },
    id: Math.floor(Math.random() * 1000)
  };

  try {
    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      next: { revalidate: 60 } // Cache ISR Next.js de 60s
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    return data.result as T;
  } catch (error) {
    console.error("Odoo JSON-RPC execution failed:", error);
    throw error;
  }
}

/**
 * Authentification auprès d'Odoo. Retourne le UID de l'utilisateur.
 */
export async function authenticateOdoo(username: string, password: string): Promise<number> {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "authenticate",
      args: [ODOO_DB, username, password, {}]
    },
    id: 1
  };

  try {
    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    if (!data.result) {
      throw new Error("Authentification échouée.");
    }

    return data.result as number;
  } catch (error) {
    console.error("Odoo authentication failed:", error);
    throw error;
  }
}
