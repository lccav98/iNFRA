import { useState, useCallback } from 'react';

interface ModalState<T> {
  isOpen: boolean;
  data: Partial<T>;
  editingId: string | number | null;
}

export function useModal<T>(defaultData: Partial<T> = {}) {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: defaultData,
    editingId: null
  });

  const openModal = useCallback((item?: T, id?: string | number) => {
    setState({
      isOpen: true,
      data: item ? { ...item } : defaultData,
      editingId: id !== undefined ? id : null
    });
  }, [defaultData]);

  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      data: defaultData,
      editingId: null
    });
  }, [defaultData]);

  const updateData = useCallback((updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates }
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    editingId: state.editingId,
    openModal,
    closeModal,
    updateData,
    isEditing: state.editingId !== null
  };
}
