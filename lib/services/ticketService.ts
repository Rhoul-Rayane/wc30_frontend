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

/**
 * Résout l'ID de la zone du stade dans Odoo en fonction de la catégorie de billet
 */
async function resolveStadiumZone(stadiumId: number, category: string): Promise<number> {
  const zones = await callOdoo<{ id: number; name: string; zone_type: string }[]>('wc.stadium.zone', 'search_read', [
    [['stadium_id', '=', stadiumId]]
  ], {
    fields: ['id', 'name', 'zone_type']
  });

  if (!zones || zones.length === 0) {
    throw new Error(`Aucune zone trouvée pour le stade avec l'ID ${stadiumId}`);
  }

  let matchedZone = null;
  if (category === 'vip') {
    matchedZone = zones.find(z => z.zone_type === 'vip' || z.name.toLowerCase().includes('vip') || z.name.toLowerCase().includes('loge'));
  } else if (category === 'hospitality') {
    matchedZone = zones.find(z => z.name.toLowerCase().includes('a') || z.name.toLowerCase().includes('central') || z.zone_type === 'tribune');
  } else if (category === 'standard') {
    matchedZone = zones.find(z => z.name.toLowerCase().includes('b') || z.name.toLowerCase().includes('public') || z.name.toLowerCase().includes('virage') || z.zone_type === 'tribune');
  } else if (category === 'press') {
    matchedZone = zones.find(z => z.zone_type === 'press' || z.name.toLowerCase().includes('presse'));
  }

  return matchedZone ? matchedZone.id : zones[0].id;
}

/**
 * Crée un ou plusieurs billets dans la base de données Odoo
 */
export async function createTicket(ticketData: {
  matchId: string;
  category: 'standard' | 'vip' | 'press' | 'hospitality';
  holderName: string;
  quantity: number;
}): Promise<any[]> {
  if (USE_MOCK) {
    console.log('[ticketService] Simulation de création de billets (Mock) pour', ticketData.holderName);
    const mockTickets = [];
    const matchIdNum = parseInt(ticketData.matchId.replace('match-', ''), 10) || 1;
    for (let i = 0; i < ticketData.quantity; i++) {
      const ticketId = "WC30-MOCK-" + Math.floor(100000 + Math.random() * 900000);
      mockTickets.push({
        id: ticketId,
        name: ticketId,
        barcode: "BARCODE-" + Math.floor(100000 + Math.random() * 900000),
        holder_name: ticketData.holderName,
        category: ticketData.category,
        match_id: [matchIdNum, 'Match Simulée'],
        stadium_id: [1, 'Stade Simulé'],
        stadium_zone_id: [1, 'Zone Simulée'],
        state: 'purchased'
      });
    }
    return mockTickets;
  }

  try {
    const matchIdNum = parseInt(ticketData.matchId.replace('match-', ''), 10);
    if (isNaN(matchIdNum)) {
      throw new Error(`ID de match invalide: ${ticketData.matchId}`);
    }

    console.log(`[ticketService] Récupération du match ${matchIdNum} depuis Odoo pour résoudre le stade...`);
    const matchData = await callOdoo<any[]>('wc.match', 'read', [[matchIdNum]], {
      fields: ['stadium_id']
    });

    if (!matchData || matchData.length === 0) {
      throw new Error(`Match avec l'ID ${matchIdNum} introuvable dans Odoo.`);
    }

    const stadiumId = matchData[0].stadium_id[0];
    const zoneId = await resolveStadiumZone(stadiumId, ticketData.category);
    console.log(`[ticketService] Stade résolu ID: ${stadiumId}, Zone résolue ID: ${zoneId}`);

    const createdTickets = [];
    for (let i = 0; i < ticketData.quantity; i++) {
      const payload = {
        match_id: matchIdNum,
        stadium_zone_id: zoneId,
        category: ticketData.category,
        holder_name: ticketData.holderName,
        state: 'purchased'
      };

      console.log(`[ticketService] Création du billet ${i + 1}/${ticketData.quantity} dans Odoo...`);
      const recordId = await callOdoo<number>('wc.ticket', 'create', [payload]);
      
      const ticketRecords = await callOdoo<any[]>('wc.ticket', 'read', [[recordId]], {
        fields: ['id', 'name', 'barcode', 'holder_name', 'category', 'match_id', 'stadium_id', 'stadium_zone_id', 'state']
      });

      if (ticketRecords && ticketRecords.length > 0) {
        createdTickets.push(ticketRecords[0]);
      }
    }

    return createdTickets;
  } catch (error) {
    console.error('[ticketService] Erreur lors de la création du billet dans Odoo.', error);
    throw error;
  }
}

/**
 * Récupère tous les billets d'un utilisateur depuis Odoo (recherche par holder_name)
 */
export async function getUserTickets(holderName: string): Promise<any[]> {
  if (USE_MOCK) {
    console.log('[ticketService] Simulation de récupération des billets (Mock) pour', holderName);
    return [];
  }

  try {
    console.log(`[ticketService] Recherche des billets Odoo pour le porteur: "${holderName}"...`);
    return await callOdoo<any[]>('wc.ticket', 'search_read', [
      [['holder_name', '=', holderName]]
    ], {
      fields: ['id', 'name', 'barcode', 'holder_name', 'category', 'match_id', 'stadium_id', 'stadium_zone_id', 'state'],
      order: 'create_date desc'
    });
  } catch (error) {
    console.error(`[ticketService] Erreur lors de la récupération des billets Odoo pour ${holderName}.`, error);
    return [];
  }
}

