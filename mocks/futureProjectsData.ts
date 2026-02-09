export interface FutureProject {
    id: string;
    name: string;
    location: string;
    budget: number;
    startDate: string;
    estimatedDuration: number; // in months
    status: 'PLANEJAMENTO' | 'LICITACAO' | 'APROVADO' | 'EM_ANALISE';
    priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    description?: string;
}

export const MOCK_FUTURE_PROJECTS: FutureProject[] = [
    {
        id: 'FP-001',
        name: 'Pavimentação da Via Principal - Setor 4',
        location: 'Pacaraima, RR',
        budget: 450000,
        startDate: '2026-06-15',
        estimatedDuration: 4,
        status: 'PLANEJAMENTO',
        priority: 'ALTA',
        description: 'Pavimentação asfáltica de 2km da via principal de acesso ao novo alojamento.'
    },
    {
        id: 'FP-002',
        name: 'Instalação de Rede Elétrica - Base Norte',
        location: 'Boa Vista, RR',
        budget: 120000,
        startDate: '2026-05-01',
        estimatedDuration: 2,
        status: 'APROVADO',
        priority: 'URGENTE',
        description: 'Expansão da rede elétrica para atender novos módulos habitacionais.'
    },
    {
        id: 'FP-003',
        name: 'Construção de Refeitório Comunitário',
        location: 'Pacaraima, RR',
        budget: 350000,
        startDate: '2026-08-10',
        estimatedDuration: 6,
        status: 'LICITACAO',
        priority: 'MEDIA',
        description: 'Construção de estrutura para refeitório com capacidade para 500 pessoas.'
    },
    {
        id: 'FP-004',
        name: 'Sistema de Drenagem Pluvial',
        location: 'Amajari, RR',
        budget: 85000,
        startDate: '2026-09-01',
        estimatedDuration: 3,
        status: 'EM_ANALISE',
        priority: 'BAIXA',
        description: 'Implementação de sistema de drenagem para prevenir alagamentos na época de chuvas.'
    }
];
