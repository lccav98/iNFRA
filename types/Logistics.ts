export type MaterialStatus = 'OK' | 'BAIXO' | 'CRITICO';
export type EquipmentStatus = 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO';
export type EquipmentType = 'MAQUINA' | 'FERRAMENTA' | 'VEICULO';

export interface Material {
    id: string;
    name: string;
    quantity: number;
    unit: string; // e.g., 'sc', 'kg', 'un'
    category: string;
    status: MaterialStatus;
    location: string;
    lastUpdated: string;
}

export interface Equipment {
    id: string;
    name: string;
    type: EquipmentType;
    status: EquipmentStatus;
    condition: number; // 0-100%
    location: string; // Warehouse or Project Name
    currentServiceId?: string; // If in use
    imageUrl?: string;
}

export interface MachineAllocation {
    id: string;
    equipmentId: string;
    serviceId: string;
    serviceName: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}
