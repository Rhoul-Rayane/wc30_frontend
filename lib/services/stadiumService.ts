/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdoo } from '../odoo';
import { Stadium, OdooStadium, mapOdooStadium } from '../types';
import { MOCK_STADIUMS } from '../mock';

export async function getStadiums(): Promise<Stadium[]> {
  if (USE_MOCK) {
    console.log('[stadiumService] Utilise les données mock de stades.');
    return MOCK_STADIUMS;
  }

  try {
    console.log('[stadiumService] Récupération des stades depuis Odoo...');
    const rawStadiums = await callOdoo<OdooStadium[]>('wc.stadium', 'search_read', [], {
      fields: [
        'id',
        'name',
        'city',
        'capacity',
        'gross_capacity',
        'net_capacity',
        'address',
        'stadium_type',
        'state',
        'country',
        'gps_lat',
        'gps_lng',
        'fifa_code',
        'zone_ids',
        'match_ids',
        'zone_count',
        'match_count',
        'image'
      ]
    });

    return rawStadiums.map(mapOdooStadium);
  } catch (error) {
    console.error('[stadiumService] Erreur lors de l\'appel Odoo. Fallback vers les mocks.', error);
    return MOCK_STADIUMS;
  }
}

export async function getStadiumById(id: string): Promise<Stadium | null> {
  const numericId = parseInt(id.replace('stadium-', ''), 10);
  if (isNaN(numericId)) {
    return MOCK_STADIUMS.find(s => s.id === id) || null;
  }

  if (USE_MOCK) {
    return MOCK_STADIUMS.find(s => s.id === id) || null;
  }

  try {
    console.log(`[stadiumService] Récupération du stade ${numericId} depuis Odoo...`);
    const rawStadiums = await callOdoo<OdooStadium[]>('wc.stadium', 'search_read', [
      [['id', '=', numericId]]
    ], {
      limit: 1
    });

    if (!rawStadiums || rawStadiums.length === 0) {
      return null;
    }

    return mapOdooStadium(rawStadiums[0]);
  } catch (error) {
    console.error('[stadiumService] Erreur lors de l\'appel Odoo pour getStadiumById. Fallback.', error);
    return MOCK_STADIUMS.find(s => s.id === id) || null;
  }
}
