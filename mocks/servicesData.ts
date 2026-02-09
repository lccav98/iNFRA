
import { Servico } from '../types/Servico';

export const MOCK_SERVICES: Servico[] = [
    {
        id: '1',
        titulo: 'Manutenção Hidráulica - Bloco A',
        descricao: 'Vazamento no banheiro masculino',
        localizacao: 'Bloco A',
        gravidade: 4,
        urgencia: 5,
        tendencia: 4,
        prioridade: 1, // calculated
        foto_url: null,
        status: 'Pendente',
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z'
    },
    {
        id: '2',
        titulo: 'Reparo Elétrico - Refeitório',
        descricao: 'Lâmpadas queimadas e disjuntor desarmando',
        localizacao: 'Refeitório',
        gravidade: 5,
        urgencia: 5,
        tendencia: 5,
        prioridade: 1,
        foto_url: null,
        status: 'Em Andamento',
        created_at: '2024-02-02T08:30:00Z',
        updated_at: '2024-02-03T14:20:00Z'
    },
    {
        id: '3',
        titulo: 'Pintura Externa - Fachada Norte',
        descricao: 'Revitalização da pintura da fachada',
        localizacao: 'Bloco B',
        gravidade: 2,
        urgencia: 2,
        tendencia: 2,
        prioridade: 3,
        foto_url: null,
        status: 'Concluído',
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-25T16:00:00Z'
    },
    {
        id: '4',
        titulo: 'Conserto de Ar Condicionado - Sala de Reunião',
        descricao: 'Equipamento não está refrigerando',
        localizacao: 'Administração',
        gravidade: 3,
        urgencia: 4,
        tendencia: 3,
        prioridade: 2,
        foto_url: null,
        status: 'Pendente',
        created_at: '2024-02-05T11:15:00Z',
        updated_at: '2024-02-05T11:15:00Z'
    },
    {
        id: '5',
        titulo: 'Troca de Fechadura - Porta Principal',
        descricao: 'Fechadura emperrada',
        localizacao: 'Bloco A',
        gravidade: 3,
        urgencia: 5,
        tendencia: 1,
        prioridade: 2,
        foto_url: null,
        status: 'Concluído',
        created_at: '2024-02-06T13:45:00Z',
        updated_at: '2024-02-06T15:30:00Z'
    },
    {
        id: '6',
        titulo: 'Instalação de Projetor',
        descricao: 'Sala de aula 3',
        localizacao: 'Bloco C',
        gravidade: 1,
        urgencia: 2,
        tendencia: 1,
        prioridade: 4,
        foto_url: null,
        status: 'Cancelado',
        created_at: '2024-02-07T09:30:00Z',
        updated_at: '2024-02-08T10:00:00Z'
    }
];
