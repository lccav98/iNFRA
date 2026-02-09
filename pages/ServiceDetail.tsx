
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicosService } from '../services/servicosService';
import { Servico } from '../types/Servico';
import ServiceForm from '../components/ServiceForm';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [servico, setServico] = useState<Servico | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const BASE_URL = API_URL.replace('/api', '');

    useEffect(() => {
        if (id) {
            loadServico(id);
        }
    }, [id]);

    const loadServico = async (serviceId: string) => {
        try {
            setLoading(true);
            const data = await servicosService.getById(serviceId);
            setServico(data);
        } catch (error) {
            console.error('Erro ao carregar serviço:', error);
            alert('Erro ao carregar detalhes do serviço.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!servico || !confirm('Tem certeza que deseja excluir este serviço?')) return;
        try {
            await servicosService.delete(servico.id);
            navigate('/servicos');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            alert('Erro ao excluir serviço.');
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!servico) return;
        try {
            await servicosService.update(servico.id, Object.fromEntries(formData)); // Note: update expects object not FormData currently in backend?
            // Wait, servicosService.update in frontend uses JSON, but create uses FormData.
            // Let's check servicosService.ts again. It sends JSON.
            // But ServiceForm produces FormData (for file uploads).
            // We need to handle file uploads in update too if backend supports it.
            // Current backend update (PUT /api/servicos/:id) does NOT handle file upload (it uses bodyParser, not multer).
            // So for now, we will extract text fields from FormData.

            const entries = Object.fromEntries(formData.entries());
            const updateData = {
                titulo: entries.titulo,
                descricao: entries.descricao,
                localizacao: entries.localizacao,
                gravidade: Number(entries.gravidade),
                urgencia: Number(entries.urgencia),
                tendencia: Number(entries.tendencia),
                status: entries.status
            };

            await servicosService.update(servico.id, updateData);
            setIsEditing(false);
            loadServico(servico.id);
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            alert('Erro ao atualizar serviço.');
        }
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 100) return 'bg-red-600';
        if (priority >= 60) return 'bg-orange-500';
        if (priority >= 30) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 gap-3">
                <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
                <span className="text-xs font-bold uppercase tracking-widest">Carregando detalhes...</span>
            </div>
        );
    }

    if (!servico) {
        return (
            <div className="p-8 text-center text-slate-500">
                <p>Serviço não encontrado.</p>
                <button onClick={() => navigate('/servicos')} className="mt-4 text-primary font-bold hover:underline">
                    Voltar para Serviços
                </button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-6 text-slate-500 cursor-pointer hover:text-primary transition-colors" onClick={() => setIsEditing(false)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Cancelar Edição</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Editar Serviço</h2>
                <ServiceForm
                    initialData={{
                        titulo: servico.titulo,
                        descricao: servico.descricao,
                        localizacao: servico.localizacao,
                        gravidade: servico.gravidade,
                        urgencia: servico.urgencia,
                        tendencia: servico.tendencia,
                        status: servico.status
                    }}
                    initialPhotoPreview={servico.foto_url ? `${BASE_URL}${servico.foto_url}` : null}
                    onSubmit={handleUpdate}
                    submitLabel="Salvar Alterações"
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/servicos')}>
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        <span>Voltar para Serviços</span>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span>Detalhes</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{servico.titulo}</h2>
                    <div className="flex items-center gap-1 text-slate-400 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="text-xs font-semibold">{servico.localizacao || 'Local não informado'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Editar"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Excluir"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                    <div className={`ml-2 px-4 py-1.5 rounded-lg text-white font-black text-lg shadow-sm ${getPriorityColor(servico.prioridade)}`}>
                        Prioridade {servico.prioridade}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {servico.foto_url && (
                        <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-border-dark">
                            <img
                                src={`${BASE_URL}${servico.foto_url}`}
                                alt={servico.titulo}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Descrição</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {servico.descricao || 'Sem descrição.'}
                        </p>
                    </div>
                </div>

                {/* Sidebar Info */}
                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm space-y-3">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                            Ações
                        </h3>

                        {servico.status !== 'Concluído' ? (
                            <button
                                onClick={async () => {
                                    if (confirm('Deseja marcar este serviço como concluído?')) {
                                        try {
                                            await servicosService.update(servico.id, { ...servico, status: 'Concluído' });
                                            loadServico(servico.id);
                                        } catch (e) {
                                            console.error(e);
                                            alert('Erro ao concluir serviço');
                                        }
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-green-500/20"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                Concluir Serviço
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400">
                                    <span className="material-symbols-outlined">verified</span>
                                    <span className="text-sm font-bold">Serviço Concluído</span>
                                </div>
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold py-3 px-4 rounded-xl transition-colors border border-slate-200 hover:border-red-200"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                    Excluir Registro
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                            Classificação GUT
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Gravidade</span>
                                    <span className="font-black text-slate-800 dark:text-slate-200">{servico.gravidade}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${(servico.gravidade / 5) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Urgência</span>
                                    <span className="font-black text-slate-800 dark:text-slate-200">{servico.urgencia}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: `${(servico.urgencia / 5) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tendência</span>
                                    <span className="font-black text-slate-800 dark:text-slate-200">{servico.tendencia}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: `${(servico.tendencia / 5) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                            Detalhes do Registro
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${servico.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                    servico.status === 'Concluído' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {servico.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">ID</span>
                                <span className="font-mono text-xs text-slate-400">{servico.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Data</span>
                                <span className="text-slate-700 dark:text-slate-300">
                                    {new Date(servico.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
