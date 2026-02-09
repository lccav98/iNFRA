import React, { memo } from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  'OK': 'text-green-500 bg-green-500/10 border-green-500/30',
  'BAIXO': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  'CRITICO': 'text-emergency-red bg-emergency-red/10 border-emergency-red/30',
  'PRONTO': 'bg-green-500 text-white',
  'BAIXADO': 'bg-red-500 text-white',
  'AREJAMENTO': 'bg-yellow-500 text-white',
  'DISPONIVEL': 'text-green-500 bg-green-500/10',
  'EM_USO': 'text-blue-500 bg-blue-500/10',
  'MANUTENCAO': 'text-orange-500 bg-orange-500/10',
  'Pendente': 'text-slate-500 bg-slate-500/10',
  'Em Andamento': 'text-blue-500 bg-blue-500/10',
  'Concluído': 'text-green-500 bg-green-500/10',
  'Cancelado': 'text-red-500 bg-red-500/10',
};

export const StatusBadge = memo<StatusBadgeProps>(({ status, className = '' }) => {
  const colorClass = statusColors[status] || 'text-slate-500 bg-slate-500/10';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colorClass} ${className}`}>
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
