import React, { useState } from 'react';
import { MOCK_FUTURE_PROJECTS, FutureProject } from '../mocks/futureProjectsData';

const FutureProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<FutureProject[]>(MOCK_FUTURE_PROJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<FutureProject>>({});
    const [editingId, setEditingId] = useState<string | null>(null);

    // Stats
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const planningCount = projects.filter(p => p.status === 'PLANEJAMENTO').length;
    const approvedCount = projects.filter(p => p.status === 'APROVADO').length;

    const handleAddProject = () => {
        setEditingId(null);
        setFormData({
            status: 'PLANEJAMENTO',
            priority: 'MEDIA',
            startDate: new Date().toISOString().split('T')[0],
            estimatedDuration: 1
        });
        setIsModalOpen(true);
    };

    const handleEditProject = (project: FutureProject) => {
        setEditingId(project.id);
        setFormData({ ...project });
        setIsModalOpen(true);
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            setProjects(projects.map(p => p.id === editingId ? { ...formData, id: editingId } as FutureProject : p));
        } else {
            const newProject: FutureProject = {
                ...formData as FutureProject,
                id: `FP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            };
            setProjects([...projects, newProject]);
        }
        setIsModalOpen(false);
    };

    const getStatusColor = (status: FutureProject['status']) => {
        switch (status) {
            case 'PLANEJAMENTO': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'LICITACAO': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'APROVADO': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'EM_ANALISE': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getPriorityColor = (priority: FutureProject['priority']) => {
        switch (priority) {
            case 'URGENTE': return 'text-red-500 bg-red-500/10';
            case 'ALTA': return 'text-orange-500 bg-orange-500/10';
            case 'MEDIA': return 'text-blue-500 bg-blue-500/10';
            case 'BAIXA': return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">architecture</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total de Projetos</p>
                    <h3 className="text-3xl font-black mt-1">{projects.length}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Orçamento Estimado</p>
                    <h3 className="text-3xl font-black mt-1 text-emerald-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}
                    </h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Em Planejamento</p>
                    <h3 className="text-3xl font-black mt-1 text-purple-500">{planningCount}</h3>
                </div>
            </div>

            {/* List Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Projetos Futuros</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gestão e planejamento de novas obras</p>
                </div>
                <button
                    onClick={handleAddProject}
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Projeto
                </button>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-background-dark flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-3xl text-slate-400">domain_add</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${getStatusColor(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${getPriorityColor(project.priority)}`}>
                                    {project.priority} Prioridade
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{project.name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    {project.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">calendar_month</span>
                                    Início: {new Date(project.startDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    {project.estimatedDuration} meses
                                </span>
                            </div>
                            {project.description && (
                                <p className="mt-2 text-sm text-slate-500 italic truncate w-full max-w-2xl">{project.description}</p>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-1 min-w-[150px]">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Orçamento Estimado</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budget)}
                            </p>
                            <button className="text-xs font-bold text-primary hover:text-primary-dark mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver Detalhes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}
                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-border-dark">
                        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                    {editingId ? 'Editar Projeto Futuro' : 'Novo Projeto Futuro'}
                                </h3>
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome do Projeto</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Pavimentação Setor 5..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Localização</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.location || ''}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Orçamento (R$)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.budget || ''}
                                        onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Início Estimado</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.startDate || ''}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Duração (Meses)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.estimatedDuration || ''}
                                        onChange={e => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prioridade</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.priority || 'MEDIA'}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                    >
                                        <option value="BAIXA">Baixa</option>
                                        <option value="MEDIA">Média</option>
                                        <option value="ALTA">Alta</option>
                                        <option value="URGENTE">Urgente</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.status || 'PLANEJAMENTO'}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="PLANEJAMENTO">Planejamento</option>
                                        <option value="EM_ANALISE">Em Análise</option>
                                        <option value="LICITACAO">Licitação</option>
                                        <option value="APROVADO">Aprovado</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Descrição</label>
                                <textarea
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5 h-24 resize-none"
                                    placeholder="Breve descrição do projeto..."
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Criar Projeto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FutureProjectsPage;
