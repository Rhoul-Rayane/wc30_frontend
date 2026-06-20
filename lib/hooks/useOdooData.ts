/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

interface UseOdooDataOptions<T> {
  refreshInterval?: number;
  initialData?: T;
}

export function useOdooData<T>(endpoint: string, options?: UseOdooDataOptions<T>) {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState<boolean>(!options?.initialData);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des données : ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error(`[useOdooData] Erreur pour l'endpoint ${endpoint} :`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!options?.initialData) {
      fetchData();
    }

    if (options?.refreshInterval) {
      const interval = setInterval(fetchData, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options?.refreshInterval, options?.initialData]);

  return { data, loading, error, refetch: fetchData };
}
