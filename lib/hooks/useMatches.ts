/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useOdooData } from './useOdooData';
import { Match } from '../types';

export function useMatches(initialMatches?: Match[]) {
  const { data: matches, loading, error, refetch } = useOdooData<Match[]>('/api/matches', {
    initialData: initialMatches,
  });

  return {
    matches: matches ?? [],
    loading,
    error,
    refetch,
  };
}
