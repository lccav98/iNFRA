
export enum ProjectStatus {
  IMEDIATO = 'IMEDIATO',
  ALTA = 'ALTA',
  MEDIA = 'MÉDIA',
  ESTAVEL = 'ESTÁVEL'
}

export interface Project {
  id: string;
  name: string;
  category: string;
  g: number;
  u: number;
  t: number;
  total: number;
  status: ProjectStatus;
}

export interface ServicePhase {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  photos?: string[];
  startDate?: string;
  endDate?: string;
}

export interface ServiceProgress {
  label: string;
  value: number;
  isEmergency?: boolean;
  history?: { date: string; progress: number }[];
  contractor?: string;
  lastUpdate?: string;
  phases?: ServicePhase[];
}

export interface Material {
  name: string;
  quantity: string | number;
  status: 'OK' | 'BAIXO' | 'CRÍTICO';
}

export interface GalleryImage {
  date: string;
  label: string;
  url: string;
}
