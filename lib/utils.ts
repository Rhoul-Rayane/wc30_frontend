/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return dateStr;
}
