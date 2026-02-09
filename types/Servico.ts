export interface Servico {
    id: string;
    titulo: string;
    descricao: string;
    localizacao: string;
    gravidade: number;
    urgencia: number;
    tendencia: number;
    prioridade: number;
    foto_url: string | null;
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
    created_at: string;
    updated_at: string;
}
