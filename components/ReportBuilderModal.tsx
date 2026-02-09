
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { MOCK_SERVICES } from '../mocks/servicesData';
import { MOCK_PERSONNEL } from '../mocks/personnelData';
import { MOCK_MATERIALS, MOCK_EQUIPMENT } from '../mocks/logisticsData';

interface ReportBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6B6B'];

export const ReportBuilderModal: React.FC<ReportBuilderModalProps> = ({ isOpen, onClose }) => {
    const [source, setSource] = useState<'services' | 'personnel' | 'materials' | 'equipment'>('services');
    const [groupBy, setGroupBy] = useState<string>('status');
    const [metric, setMetric] = useState<'count' | 'sum' | 'avg'>('count');
    const [metricField, setMetricField] = useState<string>('');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'table'>('bar');

    // Configuration Options based on Source
    const configOptions = useMemo(() => {
        switch (source) {
            case 'services':
                return {
                    dimensions: [
                        { label: 'Status', value: 'status' },
                        { label: 'Localização', value: 'localizacao' },
                        { label: 'Gravidade', value: 'gravidade' },
                        { label: 'Urgência', value: 'urgencia' },
                        { label: 'Tendência', value: 'tendencia' },
                    ],
                    metrics: [
                        { label: 'Score GUT', value: 'prioridade' }, // using prioridade as proxy for GUT score sum/avg logic demonstration
                    ]
                };
            case 'personnel':
                return {
                    dimensions: [
                        { label: 'Especialidade', value: 'specialty' },
                        { label: 'Posto/Graduação', value: 'rank' },
                        { label: 'Status', value: 'status' },
                        { label: 'Localização', value: 'location' },
                    ],
                    metrics: [
                        { label: 'Produtividade', value: 'productivity' },
                        { label: 'Tarefas Concluídas', value: 'tasksCompleted' },
                    ]
                };
            case 'materials':
                return {
                    dimensions: [
                        { label: 'Categoria', value: 'category' },
                        { label: 'Status', value: 'status' },
                        { label: 'Localização', value: 'location' },
                    ],
                    metrics: [
                        { label: 'Quantidade', value: 'quantity' },
                    ]
                };
            case 'equipment':
                return {
                    dimensions: [
                        { label: 'Tipo', value: 'type' },
                        { label: 'Status', value: 'status' },
                        { label: 'Localização', value: 'location' },
                    ],
                    metrics: [
                        { label: 'Condição (%)', value: 'condition' },
                    ]
                };
            default:
                return { dimensions: [], metrics: [] };
        }
    }, [source]);

    // Data Processing Logic
    const processedData = useMemo(() => {
        let rawData: any[] = [];
        switch (source) {
            case 'services': rawData = MOCK_SERVICES; break;
            case 'personnel': rawData = MOCK_PERSONNEL; break;
            case 'materials': rawData = MOCK_MATERIALS; break;
            case 'equipment': rawData = MOCK_EQUIPMENT; break;
        }

        const groups: Record<string, any> = {};

        rawData.forEach(item => {
            const key = String(item[groupBy] || 'N/A');
            if (!groups[key]) {
                groups[key] = { name: key, count: 0, sum: 0, values: [] };
            }
            groups[key].count += 1;

            if (metric !== 'count' && metricField && item[metricField] !== undefined) {
                const value = Number(item[metricField]);
                if (!isNaN(value)) {
                    groups[key].values.push(value);
                    groups[key].sum += value;
                }
            }
        });

        return Object.values(groups).map(group => {
            let value = group.count;
            if (metric === 'sum') value = group.sum;
            if (metric === 'avg' && group.values.length > 0) value = group.sum / group.values.length;

            return {
                name: group.name,
                value: metric === 'avg' ? Number(value.toFixed(2)) : value,
                originalCount: group.count
            };
        }).sort((a, b) => b.value - a.value); // Sort descending

    }, [source, groupBy, metric, metricField]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E293B] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Construtor de Relatórios
                        </h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Crie indicadores personalizados em tempo real</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row h-full overflow-hidden">

                    {/* Sidebar Configuration */}
                    <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-800/30 p-6 border-r border-slate-100 dark:border-slate-700 overflow-y-auto space-y-6">

                        {/* 1. Fonte de Dados */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Fonte de Dados</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['services', 'personnel', 'materials', 'equipment'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSource(opt as any); setGroupBy(''); setMetricField(''); }}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${source === opt ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-primary/50'}`}
                                    >
                                        {opt === 'services' && 'Serviços'}
                                        {opt === 'personnel' && 'Pessoal'}
                                        {opt === 'materials' && 'Materiais'}
                                        {opt === 'equipment' && 'Equipamentos'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Agrupar Por (Eixo X) */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Agrupar Por (Dimensão)</label>
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value)}
                                className="w-full p-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            >
                                <option value="" disabled>Selecione...</option>
                                {configOptions.dimensions.map(dim => (
                                    <option key={dim.value} value={dim.value}>{dim.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Métrica (Eixo Y) */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">3. Métrica (Valor)</label>
                            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-600 mb-2">
                                {['count', 'sum', 'avg'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMetric(m as any)}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wide rounded ${metric === m ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {m === 'count' ? 'Contagem' : m === 'sum' ? 'Soma' : 'Média'}
                                    </button>
                                ))}
                            </div>

                            {metric !== 'count' && (
                                <select
                                    value={metricField}
                                    onChange={(e) => setMetricField(e.target.value)}
                                    className="w-full p-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold animate-in fade-in slide-in-from-top-1"
                                >
                                    <option value="" disabled>Selecione o campo numérico...</option>
                                    {configOptions.metrics.map(met => (
                                        <option key={met.value} value={met.value}>{met.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* 4. Visualização */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">4. Tipo de Gráfico</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['bar', 'pie', 'line', 'table'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setChartType(type as any)}
                                        className={`p-2 rounded-lg border flex items-center justify-center transition-all ${chartType === type ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-600 hover:border-primary/50'}`}
                                        title={type}
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {type === 'bar' && 'bar_chart'}
                                            {type === 'pie' && 'pie_chart'}
                                            {type === 'line' && 'show_chart'}
                                            {type === 'table' && 'table_chart'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 p-8 bg-slate-100/50 dark:bg-[#0F172A] flex flex-col relative">

                        {!groupBy ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">data_exploration</span>
                                <p className="text-sm font-bold">Configure os eixos para visualizar o relatório</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex justify-between items-end">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white">Pré-visualização</h3>
                                        <p className="text-sm text-slate-500">
                                            {source === 'services' && 'Serviços'}
                                            {source === 'personnel' && 'Pessoal'}
                                            {source === 'materials' && 'Materiais'}
                                            {source === 'equipment' && 'Equipamentos'}
                                            {' '}por{' '}
                                            <span className="text-primary font-bold">{configOptions.dimensions.find(d => d.value === groupBy)?.label}</span>
                                        </p>
                                    </div>
                                    <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Total de Registros</span>
                                        <span className="text-xl font-black text-slate-800 dark:text-white">{processedData.reduce((acc, curr) => acc + curr.originalCount, 0)}</span>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {chartType === 'bar' ? (
                                            <BarChart data={processedData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                                    {processedData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        ) : chartType === 'pie' ? (
                                            <PieChart>
                                                <Pie
                                                    data={processedData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={120}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {processedData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        ) : chartType === 'line' ? (
                                            <LineChart data={processedData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        ) : (
                                            // Table View
                                            <div className="overflow-auto h-full w-full">
                                                <table className="w-full text-left">
                                                    <thead className="sticky top-0 bg-white dark:bg-slate-800">
                                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                                            <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">{configOptions.dimensions.find(d => d.value === groupBy)?.label || 'Grupo'}</th>
                                                            <th className="pb-3 text-right text-xs font-black text-slate-400 uppercase tracking-widest">
                                                                {metric === 'count' ? 'Contagem' : metric === 'sum' ? `Soma (${metricField})` : `Média (${metricField})`}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                                        {processedData.map((item, idx) => (
                                                            <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                                <td className="py-3 text-sm font-bold text-slate-700 dark:text-slate-200">{item.name}</td>
                                                                <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">{item.value}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}

                        <div className="absolute bottom-6 right-6 flex gap-2">
                            <button className="bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-white text-xs font-black py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all uppercase tracking-widest">
                                Salvar Filtro
                            </button>
                            <button className="bg-primary hover:bg-primary-dark text-white text-xs font-black py-3 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">download</span>
                                Exportar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
