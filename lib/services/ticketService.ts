/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdoo } from '../odoo';
import { OdooTicketPricing } from '../types';
import { MOCK_TICKET_CATEGORIES, MOCK_DISCOUNT_OPTIONS, MOCK_STADIUM_TARIFS } from '../mock';

export async function getPricing(): Promise<OdooTicketPricing[]> {
  if (USE_MOCK) {
    console.log('[ticketService] Utilise les données mock de pricing.');
    return [];
  }

  try {
    console.log('[ticketService] Récupération des tarifs de billets depuis Odoo...');
    return await callOdoo<OdooTicketPricing[]>('wc.ticket.pricing', 'search_read', [], {
      fields: [
        'id',
        'name',
        'stadium_id',
        'phase',
        'ticket_category',
        'base_price',
        'early_bird_price',
        'last_minute_price',
        'resident_discount_pct',
        'student_discount_pct',
        'final_price_resident',
        'final_price_student',
        'total_available',
        'total_sold',
        'fill_rate'
      ]
    });
  } catch (error) {
    console.error('[ticketService] Erreur lors de l\'appel Odoo pour getPricing. Fallback vide.', error);
    return [];
  }
}

export function getCategories() {
  return MOCK_TICKET_CATEGORIES;
}

export function getDiscountOptions() {
  return MOCK_DISCOUNT_OPTIONS;
}

export function getMockStadiumTarifs() {
  return MOCK_STADIUM_TARIFS;
}
