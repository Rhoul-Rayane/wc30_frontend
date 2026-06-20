/**
 * Configuration centralisée du projet.
 * Toutes les variables d'environnement sont validées et typées ici.
 */

// Configuration Odoo Backend
export const ODOO_CONFIG = {
  url: process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069',
  db: process.env.ODOO_DB || 'worldcup',
  user: process.env.ODOO_API_USER || 'api_frontend',
  password: process.env.ODOO_API_PASSWORD || '',
} as const;

// Mode mock : activé par variable d'env ou par défaut
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Configuration ISR / cache
export const CACHE_REVALIDATE_SECONDS = 60;

// Configuration Leapter
export const LEAPTER_CONFIG = {
  apiKey: process.env.LEAPTER_API_KEY || '',
  url: process.env.NEXT_PUBLIC_LEAPTER_URL || 'https://lab.leapter.com/runtime/api/v1/d94d8379-4a9a-4245-8baf-2a99139c77c3/c9338e87-caf6-42a2-8af5-a25c29cb05ce/mcp',
} as const;

