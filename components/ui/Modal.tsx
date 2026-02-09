import React, { memo } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
};

export const Modal = memo<ModalProps>(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} overflow-hidden border border-slate-200 dark:border-border-dark`}>
        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
