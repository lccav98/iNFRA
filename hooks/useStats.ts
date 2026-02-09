import { useMemo } from 'react';

export function useStats<T>(
  items: T[],
  filters: Record<string, (item: T) => boolean>
) {
  return useMemo(() => {
    const stats: Record<string, number> = {};
    
    Object.entries(filters).forEach(([key, filterFn]) => {
      stats[key] = items.filter(filterFn).length;
    });
    
    stats.total = items.length;
    
    return stats;
  }, [items, filters]);
}

export function useFilteredItems<T>(
  items: T[],
  filterFn: (item: T) => boolean
) {
  return useMemo(() => items.filter(filterFn), [items, filterFn]);
}

export function usePercentage(value: number, total: number): number {
  return useMemo(() => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }, [value, total]);
}
