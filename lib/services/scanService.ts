/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { USE_MOCK } from '../config';
import { callOdooController } from '../odoo';
import { ScanValidationResult } from '../types';
import { getMockScanResult } from '../mock';

export async function validateToken(token: string): Promise<ScanValidationResult> {
  if (USE_MOCK) {
    console.log('[scanService] Mode MOCK - Validation locale du token :', token);
    return getMockScanResult(token);
  }

  try {
    console.log('[scanService] Envoi du scan au contrôleur HTTP Odoo...', token);
    
    // Appel du contrôleur HTTP Odoo
    const result = await callOdooController<ScanValidationResult>('/ticket/scan/validate', {
      token,
    });
    
    return result;
  } catch (error: any) {
    console.error('[scanService] Erreur lors de l\'appel Odoo scan. Fallback mock.', error);
    return {
      valid: false,
      message: `Erreur de connexion Odoo : ${error?.message || error}. Fallback validation locale.`,
    };
  }
}
