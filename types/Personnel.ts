
export type PersonnelStatus = 'PRONTO' | 'BAIXADO' | 'AREJAMENTO';

export type PersonnelSpecialty =
    | 'Engenheiro Civil'
    | 'Eletricista'
    | 'Pedreiro'
    | 'Mecânico'
    | 'Carpinteiro'
    | 'Auxiliar';

export interface Personnel {
    id: string;
    name: string;
    rank: string;
    specialty: PersonnelSpecialty;
    status: PersonnelStatus;
    currentProject: string;
    productivity: number; // 0-100
    tasksCompleted: number;
    avatar?: string;
    location: string;
}
