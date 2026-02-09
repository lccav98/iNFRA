import { Material, Equipment, MachineAllocation } from '../types/Logistics';

export const MOCK_MATERIALS: Material[] = [
    { id: '1', name: 'Cimento CP-II', quantity: 450, unit: 'sc', category: 'Alvenaria', status: 'OK', location: 'Depósito Central', lastUpdated: '2024-02-07' },
    { id: '2', name: 'Tijolo Cerâmico 8 furos', quantity: 12000, unit: 'un', category: 'Alvenaria', status: 'OK', location: 'Canteiro Setor 3', lastUpdated: '2024-02-06' },
    { id: '3', name: 'Areia Média', quantity: 12, unit: 'm³', category: 'Insumos', status: 'BAIXO', location: 'Depósito Central', lastUpdated: '2024-02-08' },
    { id: '4', name: 'Aço CA-50 10mm', quantity: 80, unit: 'barras', category: 'Ferragem', status: 'CRITICO', location: 'Depósito Central', lastUpdated: '2024-02-08' },
    { id: '5', name: 'Tinta Acrílica Branca', quantity: 18, unit: 'latas', category: 'Pintura', status: 'OK', location: 'Almoxarifado', lastUpdated: '2024-02-01' },
    { id: '6', name: 'Cabo Flexível 2.5mm', quantity: 400, unit: 'm', category: 'Elétrica', status: 'OK', location: 'Almoxarifado', lastUpdated: '2024-02-05' },
];

export const MOCK_EQUIPMENT: Equipment[] = [
    { id: '1', name: 'Retroescavadeira CAT 416', type: 'MAQUINA', status: 'EM_USO', condition: 85, location: 'Drenagem Base Sul', currentServiceId: 'S-101' },
    { id: '2', name: 'Caminhão Caçamba MB 2726', type: 'VEICULO', status: 'DISPONIVEL', condition: 92, location: 'Pátio Central' },
    { id: '3', name: 'Betoneira 400L', type: 'MAQUINA', status: 'MANUTENCAO', condition: 45, location: 'Oficina Mecânica' },
    { id: '4', name: 'Compactador de Solo (Sapo)', type: 'FERRAMENTA', status: 'EM_USO', condition: 70, location: 'Pavimentação Norte', currentServiceId: 'S-102' },
    { id: '5', name: 'Gerador Diesel 50kVA', type: 'MAQUINA', status: 'DISPONIVEL', condition: 98, location: 'Pátio Central' },
    { id: '6', name: 'Serra Circular de Bancada', type: 'FERRAMENTA', status: 'DISPONIVEL', condition: 80, location: 'Carpintaria' },
];

export const MOCK_ALLOCATIONS: MachineAllocation[] = [
    { id: 'a1', equipmentId: '1', serviceId: 'S-101', serviceName: 'Drenagem Base Sul', startDate: '2024-02-01', endDate: '2024-02-15', status: 'ACTIVE' },
    { id: 'a2', equipmentId: '4', serviceId: 'S-102', serviceName: 'Pavimentação Norte', startDate: '2024-02-05', endDate: '2024-02-10', status: 'ACTIVE' },
    { id: 'a3', equipmentId: '2', serviceId: 'S-103', serviceName: 'Transporte de Aterro', startDate: '2024-02-20', endDate: '2024-02-25', status: 'PENDING' },
];
