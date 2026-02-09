
import { Project, ProjectStatus, ServiceProgress, Material, GalleryImage } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-2023-084',
    name: 'Saneamento Abrigo Rondon 1',
    category: 'Engenharia Sanitária',
    g: 5,
    u: 5,
    t: 5,
    total: 125,
    status: ProjectStatus.IMEDIATO
  },
  {
    id: 'PRJ-2023-092',
    name: 'Muro de Contenção Posto 2',
    category: 'Obras Civis',
    g: 4,
    u: 4,
    t: 3,
    total: 48,
    status: ProjectStatus.ALTA
  }
];

export const MOCK_SERVICES: ServiceProgress[] = [
  { 
    label: 'Terraplanagem (Setor Norte)', 
    value: 88,
    contractor: 'Construtora Norte Ltda',
    lastUpdate: '2026-02-08',
    history: [
      { date: '2026-01-08', progress: 45 },
      { date: '2026-01-15', progress: 58 },
      { date: '2026-01-22', progress: 72 },
      { date: '2026-01-29', progress: 82 },
      { date: '2026-02-05', progress: 88 }
    ],
    phases: [
      { id: '1', name: 'Limpeza do Terreno', status: 'completed', progress: 100, startDate: '2026-01-05', endDate: '2026-01-10', photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'] },
      { id: '2', name: 'Escavação', status: 'completed', progress: 100, startDate: '2026-01-11', endDate: '2026-01-20', photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', 'https://images.unsplash.com/photo-1590409505737-5f342a2b1123?w=400'] },
      { id: '3', name: 'Compactação', status: 'in_progress', progress: 75, startDate: '2026-01-21', photos: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'] },
      { id: '4', name: 'Drenagem', status: 'pending', progress: 0 }
    ]
  },
  { 
    label: 'Instalações Hidrossanitárias (Paciara)', 
    value: 45,
    contractor: 'Hidrosul Engenharia',
    lastUpdate: '2026-02-07',
    history: [
      { date: '2026-01-08', progress: 12 },
      { date: '2026-01-15', progress: 22 },
      { date: '2026-01-22', progress: 30 },
      { date: '2026-01-29', progress: 38 },
      { date: '2026-02-05', progress: 45 }
    ],
    phases: [
      { id: '1', name: 'Projeto Hidráulico', status: 'completed', progress: 100, startDate: '2026-01-05', endDate: '2026-01-12', photos: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400'] },
      { id: '2', name: 'Tubulação de Esgoto', status: 'completed', progress: 100, startDate: '2026-01-13', endDate: '2026-01-25', photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'] },
      { id: '3', name: 'Tubulação de Água', status: 'in_progress', progress: 60, startDate: '2026-01-26', photos: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400', 'https://images.unsplash.com/photo-1590409505737-5f342a2b1123?w=400'] },
      { id: '4', name: 'Instalação de Louças', status: 'pending', progress: 0 },
      { id: '5', name: 'Testes e Vistoria', status: 'pending', progress: 0 }
    ]
  },
  { 
    label: 'Manutenção Emergencial de Vias', 
    value: 22, 
    isEmergency: true,
    contractor: 'Via Rápida Serviços',
    lastUpdate: '2026-02-08',
    history: [
      { date: '2026-01-22', progress: 5 },
      { date: '2026-01-29', progress: 12 },
      { date: '2026-02-05', progress: 22 }
    ],
    phases: [
      { id: '1', name: 'Sinalização Emergencial', status: 'completed', progress: 100, startDate: '2026-01-20', endDate: '2026-01-22', photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'] },
      { id: '2', name: 'Remoção de Asfalto Danificado', status: 'in_progress', progress: 50, startDate: '2026-01-23', photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'] },
      { id: '3', name: 'Aplicação de Nova Camada', status: 'pending', progress: 0 },
      { id: '4', name: 'Sinalização Definitiva', status: 'pending', progress: 0 }
    ]
  },
  { 
    label: 'Infraestrutura de Energia (Rondon 3)', 
    value: 74,
    contractor: 'Eletro Engenharia SA',
    lastUpdate: '2026-02-06',
    history: [
      { date: '2026-01-08', progress: 35 },
      { date: '2026-01-15', progress: 48 },
      { date: '2026-01-22', progress: 58 },
      { date: '2026-01-29', progress: 68 },
      { date: '2026-02-05', progress: 74 }
    ],
    phases: [
      { id: '1', name: 'Instalação de Postes', status: 'completed', progress: 100, startDate: '2026-01-05', endDate: '2026-01-15', photos: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400', 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'] },
      { id: '2', name: 'Cabeamento Aéreo', status: 'completed', progress: 100, startDate: '2026-01-16', endDate: '2026-01-28', photos: ['https://images.unsplash.com/photo-1590409505737-5f342a2b1123?w=400'] },
      { id: '3', name: 'Instalação de Transformadores', status: 'in_progress', progress: 80, startDate: '2026-01-29', photos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'] },
      { id: '4', name: 'Ligações Residenciais', status: 'pending', progress: 0 },
      { id: '5', name: 'Testes e Energização', status: 'pending', progress: 0 }
    ]
  }
];

export const MOCK_MATERIALS: Material[] = [
  { name: 'Cimento CP-II (Saco)', quantity: 450, status: 'OK' },
  { name: 'Aço CA-50 10mm', quantity: '1.2t', status: 'BAIXO' },
  { name: 'Tijolo Cerâmico', quantity: 8000, status: 'OK' },
  { name: 'Cabo Cobre 4mm', quantity: 0, status: 'CRÍTICO' }
];

export const MOCK_GALLERY: GalleryImage[] = [
  { date: '14/OUT/2023 09:45', label: 'Fundação Setor Norte', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlp1jcmSK8pJlaFYQMEbbVqv0dHaGq4u4E2BLz4v9FdcIUvefdcOc5u3nX4ia5gDMocVzMmlPi8gonAYTVnUxG2lurG70j8mUmblloLpLh8kODSYhuJp3tyJSDmsbaDxbcBy2U1JI1LyHd8y_EeuE5Bpl3irNX7Rsnzxcy0U0ecZx-PCcZxFSeXTCxzRTIdDvR-lMWHR1Amxc-hRdmGfwVzutI-prsiOnU4vy1s_rNazI42Mp4uaZnUSpIlpC-pjkhi4RxVIbXFUQ' },
  { date: '12/OUT/2023 15:20', label: 'Estrutura Principal', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbC3LU62kuogIzPis4V0A_R2OpQ6Ni7DXVZTR4fxzcWtyIur1rLaxgYTLL8xYPcF4DgfnSAgAfIb4T9Fow44GWTY7ELMupdtiXhwaRG3kOJwFKt8uxGpxPrVSE8yW-T4Fl7dC7dw_v3AhHl83_yLqcXNJCdeKfmNYuHOjbIrmwsh5uov1UUlIS_vejzQfx8ihse4mSjQ_Vh9TJq8hUrizpIkX7Duu2RsDTpalhCdawwQxy3OXdXWhp-j0ZYjFVEhuP44xFWSfoxpU' },
  { date: '10/OUT/2023 11:15', label: 'Chegada de Materiais', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuGpz1_bahZXYrUnqiKzSyyL9F36jYh1t7wTs_3488j_TWJlPkewtTyPJaYrVSTAiArXLEn-cH_f3G_wGcO9KXfNQZuVaYuni8w8V4Tz5iKAyUqgS1bVCLB-6OaQpxMvon3dGkpG2PpjmYzlVgnU8-Gkqw45lbzm9Ec-SJZk8u3PJpAggw2rueGdD-Hu2itKhYQUtXvvb5c5DOGzk6YbPITDkNS528YDGe-SOqV6UspeTOiPinq7Hl5iZGH2cMEWxRm3HiKZqYM_A' },
  { date: '08/OUT/2023 08:30', label: 'Medição Topográfica', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt1AIFfN6R5p3GBQfMliMvXSbV4rqAYgy2IGxTNf57_GdXVeSW2fg1n3dVWWGbPGzv_UTvTom8R2CIw-05TmkA0uIqVBCiEd-5el9ASinPgZXeKtNGsbr0A1uLylqEm_nLXLUnZ1MPz9CmXlTQW0prInMry0dcn_Y4ZFXf3lkkjOMOWwtJb2iMjHPuIHkyYJHlSa4wsGlJq5yBwfW-XfBzY8QLP6QiYAKa-OvWxEAUgCc0Tfk3Tw50bEMgCTr44kUsCbktskc1W3Q' }
];

export const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPNFTHZyu3C72OsScxaayQH46e3uagwidiLDcrac9Ye-NmT2lgiriH6SDucCoENmVTmlm8QXljEoANtK4zWmWvPwvLvYxr8ZBy-bwcLcqBClWP3ODM4u6jGX6y2b-a8JZrbej-u9UJemSeOZvyn8t7_Z8BCy6JhuFmNiS1c9QffLIY8W64zNCSYvQK-ZaVZs5oSFWRx2e5hO2u8dP9FQGrjFKqp3Kac8ZaadaxccViMJPnhQYEgttnBi2oM6-rb-v7vzMC3y_TEow';
