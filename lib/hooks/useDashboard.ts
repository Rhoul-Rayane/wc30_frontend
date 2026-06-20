/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useOdooData } from './useOdooData';
import { DashboardStats } from '../types';

export function useDashboard(initialData?: DashboardStats) {
  const { data: stats, loading, error, refetch } = useOdooData<DashboardStats>('/api/dashboard', {
    initialData,
    refreshInterval: 30000, // Rafraîchissement automatique toutes les 30s
  });

  return {
    stats: stats ?? initialData ?? null,
    loading,
    error,
    refetch,
  };
}
