import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicosService } from '../services/servicosService';
import { Servico } from '../types/Servico';
import ServiceForm from '../components/ServiceForm';

const ServiceFeed: React.FC = () => {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const BASE_URL = API_URL.replace('/api', '');

    useEffect(() => {
        loadServicos();
    }, []);

    const loadServicos = async () => {
        try {
            setLoading(true);
            const data = await servicosService.getAll();
            setServicos(data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData: FormData) => {
        try {
            await servicosService.create(formData);
            setViewMode('list');
            loadServicos();
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            alert('Erro ao criar serviço. Verifique console.');
        }
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 100) return 'bg-red-600';
        if (priority >= 60) return 'bg-orange-500';
        if (priority >= 30) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="p-4 max-w-2xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Serviços</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Registro de Ocorrências</p>
                </div>
                <button
                    onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                >
                    {viewMode === 'list' ? 'Novo Relatório' : 'Voltar ao Feed'}
                </button>
            </div>

            {viewMode === 'create' ? (
                <ServiceForm onSubmit={handleCreate} />
            ) : (
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                            <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Sincronizando feed...</span>
                        </div>
                    ) : servicos.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-card-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
                            <p className="text-slate-500 font-medium">Nenhum serviço registrado.</p>
                        </div>
                    ) : (
                        servicos.map((servico) => (
                            <div key={servico.id} className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                {servico.foto_url && (
                                    <Link to={`/servicos/${servico.id}`} className="block h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer">
                                        <img
                                            src={`${BASE_URL}${servico.foto_url}`}
                                            alt={servico.titulo}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-0 right-0 p-3 w-full bg-gradient-to-b from-black/50 to-transparent flex justify-end">
                                            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${getPriorityColor(servico.prioridade)}`}>
                                                Prioridade {servico.prioridade}
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                <div className="p-5 flex-1 flex flex-col relative">
                                    {!servico.foto_url && (
                                        <div className="absolute top-5 right-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-white ${getPriorityColor(servico.prioridade)}`}>
                                                Pri: {servico.prioridade}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-3 pr-16">
                                        <Link to={`/servicos/${servico.id}`} className="hover:text-primary transition-colors">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">{servico.titulo}</h3>
                                        </Link>
                                        <div className="flex items-center gap-1 text-slate-400 mt-1">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            <span className="text-xs font-semibold">{servico.localizacao || 'Local não informado'}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">{servico.descricao}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-border-dark flex justify-between items-center text-xs">
                                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${servico.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                            servico.status === 'Concluído' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            {servico.status}
                                        </span>

                                        <div className="flex gap-2 font-mono font-bold text-slate-300">
                                            <span title={`Gravidade: ${servico.gravidade}`} className={servico.gravidade > 3 ? 'text-red-400' : ''}>G{servico.gravidade}</span>
                                            <span title={`Urgência: ${servico.urgencia}`} className={servico.urgencia > 3 ? 'text-orange-400' : ''}>U{servico.urgencia}</span>
                                            <span title={`Tendência: ${servico.tendencia}`} className={servico.tendencia > 3 ? 'text-yellow-400' : ''}>T{servico.tendencia}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceFeed;
