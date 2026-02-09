import { useState, useCallback } from 'react';

interface CRUDHook<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  addItem: (item: T) => void;
  updateItem: (id: string | number, updates: Partial<T>) => void;
  deleteItem: (id: string | number) => void;
  setItems: (items: T[]) => void;
}

export function useCRUD<T extends { id: string | number }>(
  initialItems: T[] = []
): CRUDHook<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  }, []);

  const deleteItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    setItems
  };
}
