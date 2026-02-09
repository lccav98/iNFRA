
import React, { useState } from 'react';
import { MOCK_REPORTS_DATA } from '../mocks/reportsData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportBuilderModal } from '../components/ReportBuilderModal';

const ReportsPage: React.FC = () => {
    const { maintenanceStats, gutAnalysis, materialConsumption, financialSummary } = MOCK_REPORTS_DATA;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório Geral de Manutenção - iNFRA", 14, 15);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} `, 14, 22);

        const tableData = gutAnalysis.map((item: any) => [item.name, item.g, item.u, item.t, item.score, item.status]);

        autoTable(doc, {
            head: [['Projeto', 'G', 'U', 'T', 'Score', 'Status']],
            body: tableData,
            startY: 30,
        });
        doc.save('relatorio_infra.pdf');
    };

    const [dateRange, setDateRange] = React.useState({ start: '2024-01-01', end: '2024-12-31' });

    // Mock Usage Data for Charts
    const servicesByStatus = [
        { name: 'Concluído', value: 45, color: '#10B981' },
        { name: 'Em Andamento', value: 20, color: '#3B82F6' },
        { name: 'Pendente', value: 15, color: '#F59E0B' },
        { name: 'Cancelado', value: 5, color: '#EF4444' },
    ];

    const servicesTrend = [
        { name: 'Jan', requests: 12 },
        { name: 'Fev', requests: 19 },
        { name: 'Mar', requests: 15 },
        { name: 'Abr', requests: 22 },
        { name: 'Mai', requests: 25 },
        { name: 'Jun', requests: 30 },
    ];

    const efficiencyData = [
        { name: 'Engenheiros', productivity: 95 },
        { name: 'Pedreiros', productivity: 88 },
        { name: 'Eletricistas', productivity: 92 },
        { name: 'Mecânicos', productivity: 98 },
        { name: 'Carpinteiros', productivity: 85 },
    ];

    const locationData = [
        { name: 'Depósito Central', value: 35 },
        { name: 'Canteiro Setor 3', value: 28 },
        { name: 'Base Principal', value: 22 },
        { name: 'Hospital', value: 15 },
    ];


    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">

            <ReportBuilderModal isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />

            {/* Header with Date Picker */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Relatórios Gerenciais</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Análise de Performance e Manutenção</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-2 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="text-xs bg-transparent border-none focus:ring-0 text-slate-600 dark:text-slate-200 font-bold outline-none"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="text-xs bg-transparent border-none focus:ring-0 text-slate-600 dark:text-slate-200 font-bold outline-none"
                        />
                    </div>
                    <button onClick={handleExportPDF} className="bg-primary hover:bg-primary-dark text-white text-xs font-black py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* 10 Proposed Metrics Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Taxa de Conclusão */}
                <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Conclusão</h4>
                        <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded text-[10px] font-bold">+5.2%</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">78.4%</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div style={{ width: '78.4%' }} className="h-full bg-emerald-500 rounded-full"></div>
                    </div>
                </div>

                {/* 2. Tempo Médio de Atendimento */}
                <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Médio (TMA)</h4>
                        <span className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded text-[10px] font-bold">-2h</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">4.2 <span className="text-xs text-slate-400 font-medium">dias</span></p>
                    <p className="text-xs text-slate-500 mt-2">Média histórica: 5.5 dias</p>
                </div>

                {/* 5. Disponibilidade Equipamentos */}
                <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disp. Equipamentos</h4>
                        <span className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Crítico</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">62%</p>
                    <div className="flex gap-1 mt-3">
                        <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                        <div className="h-1.5 w-[20%] bg-orange-500 rounded-full"></div>
                        <div className="h-1.5 w-[18%] bg-red-500 rounded-full"></div>
                    </div>
                </div>

                {/* 9. Status Alocações */}
                <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alocações Ativas</h4>
                    </div>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">12 <span className="text-xs text-slate-400 font-medium">máquinas</span></p>
                    <p className="text-xs text-slate-500 mt-2">8 pendentes de aprovação</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 10. Tendência de Solicitações */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-4">Tendência de Solicitações (Semestral)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={servicesTrend}>
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="requests" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 7. Produtividade da Equipe */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-4">Produtividade por Especialidade</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={efficiencyData} layout="vertical">
                                <XAxis type="number" fontSize={10} hide />
                                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="productivity" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#F1F5F9' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3. Serviços por Gravidade (GUT) & 4. Serviços por Localização */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest mb-4">Distribuição por Local</h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={locationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {locationData.map((entry, index) => (
                                        <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {locationData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Consumo de Materiais Críticos - Already implemented via financialSummary/materialConsumption mock but enhancing it */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maior Consumo</p>
                            <p className="text-sm font-bold">{materialConsumption[0].material}</p>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{materialConsumption[0].quantity} <span className="text-xs font-medium text-slate-400">{materialConsumption[0].unit}</span></p>
                    <div className="mt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Top 3 Materiais</p>
                        <div className="space-y-3">
                            {materialConsumption.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600 dark:text-slate-400">{item.material}</span>
                                    <span className="font-mono font-bold">{item.quantity} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 8. Efetivo por Especialidade */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                        <span className="material-symbols-outlined text-4xl text-slate-400">group_work</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-1">42</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Militares Disponíveis</p>
                    <div className="w-full grid grid-cols-2 gap-2 text-left">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex justify-between">
                            <span className="text-[10px] font-bold">Engenheiros</span>
                            <span className="text-[10px]">4</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex justify-between">
                            <span className="text-[10px] font-bold">Pedreiros</span>
                            <span className="text-[10px]">18</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex justify-between">
                            <span className="text-[10px] font-bold">Eletricistas</span>
                            <span className="text-[10px]">8</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex justify-between">
                            <span className="text-[10px] font-bold">Serventes</span>
                            <span className="text-[10px]">12</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Original GUT Matrix - Preserved */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-border-dark pb-3">
                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Matriz GUT - Prioridades Críticas</h3>
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-500/20">Ação Imediata Necessária</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-3 pl-2">Projeto / Ação</th>
                                <th className="pb-3 text-center">Gravidade</th>
                                <th className="pb-3 text-center">Urgência</th>
                                <th className="pb-3 text-center">Tendência</th>
                                <th className="pb-3 text-center">Score GUT</th>
                                <th className="pb-3 text-right pr-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {gutAnalysis.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 pl-2 text-xs font-bold text-slate-700 dark:text-slate-200">{item.name}</td>
                                    <td className="py-3 text-center">
                                        <span className={`px - 2 py - 1 rounded text - [10px] font - black ${item.g >= 4 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'} `}>{item.g}</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`px - 2 py - 1 rounded text - [10px] font - black ${item.u >= 4 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'} `}>{item.u}</span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`px - 2 py - 1 rounded text - [10px] font - black ${item.t >= 4 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'} `}>{item.t}</span>
                                    </td>
                                    <td className="py-3 text-center font-mono font-black text-slate-900 dark:text-white">{item.score}</td>
                                    <td className="py-3 text-right pr-2">
                                        <span className={`text - [10px] font - black uppercase tracking - widest ${item.status === 'CRITICO' ? 'text-red-500' : item.status === 'ALTO' ? 'text-orange-500' : 'text-blue-500'} `}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial & Material Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1A1F2B] dark:bg-card-dark p-6 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <span className="material-symbols-outlined text-6xl text-white">account_balance_wallet</span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Orçamento Executado</p>
                    <h3 className="text-2xl font-black text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financialSummary.spent)}
                    </h3>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div style={{ width: `${(financialSummary.spent / financialSummary.totalBudget) * 100}% ` }} className="h-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold text-right">{((financialSummary.spent / financialSummary.totalBudget) * 100).toFixed(1)}% do total</p>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maior Consumo</p>
                            <p className="text-sm font-bold">{materialConsumption[0].material}</p>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{materialConsumption[0].quantity} <span className="text-xs font-medium text-slate-400">{materialConsumption[0].unit}</span></p>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                            <span className="material-symbols-outlined">engineering</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eficiência Geral</p>
                            <p className="text-sm font-bold">Performance</p>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-purple-600">{financialSummary.efficiency}% <span className="text-xs font-medium text-slate-400">Score</span></p>
                </div>

                <div onClick={() => setIsBuilderOpen(true)} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm cursor-pointer hover:border-primary/50 transition-colors group">
                    <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-primary transition-colors">add_chart</span>
                        <p className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors uppercase tracking-wide">Gerar Novo Indicador</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;

