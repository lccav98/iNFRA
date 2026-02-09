
export const MOCK_REPORTS_DATA = {
    maintenanceStats: {
        preventive: 65,
        corrective: 35,
        trend: -12, // 12% decrease in corrective actions
        total: 142
    },
    gutAnalysis: [
        { id: '1', name: 'Reforma do Telhado - Bloco A', g: 5, u: 5, t: 5, score: 125, status: 'CRITICO' },
        { id: '2', name: 'Infiltração Parede Leste', g: 4, u: 5, t: 4, score: 80, status: 'ALTO' },
        { id: '3', name: 'Troca de Disjuntores', g: 3, u: 3, t: 2, score: 18, status: 'MEDIO' },
        { id: '4', name: 'Pintura Externa', g: 2, u: 1, t: 1, score: 2, status: 'BAIXO' },
    ],
    materialConsumption: [
        { material: 'Cimento CP-II', quantity: 450, unit: 'Sacos', cost: 13500 },
        { material: 'Tijolo 8 furos', quantity: 2500, unit: 'Unid', cost: 3200 },
        { material: 'Cabo 6mm', quantity: 800, unit: 'Metros', cost: 4800 },
        { material: 'Tinta Acrílica', quantity: 45, unit: 'Latas', cost: 12500 },
    ],
    financialSummary: {
        totalBudget: 450000,
        spent: 320000,
        remaining: 130000,
        efficiency: 92 // % of budget adherence
    }
};
