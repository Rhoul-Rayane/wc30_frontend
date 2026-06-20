/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdoo } from '../odoo';
import { Match, OdooMatch, mapOdooMatch } from '../types';
import { MOCK_FIXTURES } from '../mock';

export async function getMatches(): Promise<Match[]> {
  if (USE_MOCK) {
    console.log('[matchService] Utilise les données mock de matchs.');
    return MOCK_FIXTURES;
  }

  try {
    console.log('[matchService] Récupération des matchs depuis Odoo...');
    const rawMatches = await callOdoo<OdooMatch[]>('wc.match', 'search_read', [], {
      fields: [
        'id',
        'name',
        'team_a',
        'team_b',
        'team_a_id',
        'team_b_id',
        'stadium_id',
        'date_time',
        'phase',
        'group',
        'state',
        'score_a',
        'score_b',
        'referee',
        'attendance',
        'is_historical'
      ],
      order: 'date_time asc',
    });

    return rawMatches.map(mapOdooMatch);
  } catch (error) {
    console.error('[matchService] Erreur lors de l\'appel Odoo. Fallback vers les mocks.', error);
    return MOCK_FIXTURES;
  }
}
