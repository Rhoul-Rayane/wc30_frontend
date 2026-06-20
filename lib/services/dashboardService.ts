/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdoo } from '../odoo';
import { DashboardStats, OdooDashboard } from '../types';
import { MOCK_DASHBOARD_STATS } from '../mock';

export function mapOdooDashboard(raw: OdooDashboard): DashboardStats {
  return {
    voluntariesCount: raw.vol_total,
    voluntariesGoal: 5000, // Objectif cible
    stadiumsCount: raw.stadium_total,
    stadiumsReady: raw.stadium_ready,
    matchesScheduled: raw.match_total,
    activeBadges: raw.badge_active,
    estimatedBudgetMAD: raw.budget_total_planned || 850000000,
    ticketsSold: raw.ticket_total_sold,
    ticketsAvailable: raw.ticket_total_available,
    averageMatchingScore: raw.vol_avg_score || 72.3,
  };
}

export async function getDashboardKPIs(): Promise<DashboardStats> {
  if (USE_MOCK) {
    console.log('[dashboardService] Utilise les KPIs du mock.');
    return MOCK_DASHBOARD_STATS;
  }

  try {
    console.log('[dashboardService] Récupération du tableau de bord depuis Odoo (ID=1)...');
    // Le dashboard est généralement un singleton (ID 1) créé à l'initialisation du module wc_dashboard
    const dashboards = await callOdoo<OdooDashboard[]>('wc.dashboard', 'read', [[1]], {
      fields: [
        'id',
        'name',
        'date_refresh',
        'vol_total',
        'vol_candidates',
        'vol_preselected',
        'vol_trained',
        'vol_assigned',
        'vol_active',
        'vol_avg_score',
        'stadium_total',
        'stadium_ready',
        'stadium_total_capacity',
        'match_total',
        'match_planned',
        'match_done',
        'badge_total',
        'badge_active',
        'badge_expired',
        'badge_revoked',
        'badge_total_scans',
        'incident_total',
        'incident_open',
        'incident_critical',
        'resource_out_of_stock',
        'transport_planned',
        'request_pending',
        'budget_total_planned',
        'budget_total_spent',
        'budget_consumption_avg',
        'revenue_total_projected',
        'revenue_total_actual',
        'revenue_variance_pct',
        'ticket_total_available',
        'ticket_total_sold',
        'ticket_fill_rate'
      ]
    });

    if (!dashboards || dashboards.length === 0) {
      console.warn('[dashboardService] Aucun singleton dashboard trouvé sur ID 1, retour mock.');
      return MOCK_DASHBOARD_STATS;
    }

    return mapOdooDashboard(dashboards[0]);
  } catch (error) {
    console.error('[dashboardService] Erreur appel Odoo dashboard. Fallback mock.', error);
    return MOCK_DASHBOARD_STATS;
  }
}
