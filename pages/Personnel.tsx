
import React, { useState, useMemo } from 'react';
import { MOCK_PERSONNEL } from '../mocks/personnelData';
import { Personnel, PersonnelSpecialty } from '../types/Personnel';

const PersonnelPage: React.FC = () => {
    const [personnel, setPersonnel] = useState<Personnel[]>(MOCK_PERSONNEL);
    const [selectedSpecialty, setSelectedSpecialty] = useState<PersonnelSpecialty | 'Todos'>('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
        status: 'PRONTO',
        rank: 'Sd',
        productivity: 100,
        tasksCompleted: 0
    });

    const specialties = useMemo(() => {
        const specs = new Set(personnel.map((p) => p.specialty));
        return ['Todos', ...Array.from(specs)] as (PersonnelSpecialty | 'Todos')[];
    }, [personnel]);

    const filteredPersonnel = useMemo(() => {
        return selectedSpecialty === 'Todos'
            ? personnel
            : personnel.filter(p => p.specialty === selectedSpecialty);
    }, [selectedSpecialty, personnel]);

    const handleAddPerson = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setPersonnel(personnel.map(p => p.id === editingId ? { ...p, ...newPerson } as Personnel : p));
        } else {
            const person: Personnel = {
                ...newPerson as Personnel,
                id: Math.random().toString(36).substr(2, 9),
                currentProject: newPerson.currentProject || '-',
                location: newPerson.location || 'Base Principal',
                tasksCompleted: newPerson.tasksCompleted || 0,
                productivity: newPerson.productivity || 100
            };
            setPersonnel([...personnel, person]);
        }
        setIsModalOpen(false);
        setEditingId(null);
        setNewPerson({ status: 'PRONTO', rank: 'Sd', productivity: 100, tasksCompleted: 0 });
    };

    const handleEditPerson = (person: Personnel) => {
        setEditingId(person.id);
        setNewPerson({ ...person });
        setIsModalOpen(true);
    };

    const handleDeletePerson = (id: string) => {
        if (window.confirm('Tem certeza que deseja remover este militar?')) {
            setPersonnel(personnel.filter(p => p.id !== id));
        }
    };


    // Metrics
    const totalPersonnel = filteredPersonnel.length;
    const prontoCount = filteredPersonnel.filter(p => p.status === 'PRONTO').length;
    const baixadoCount = filteredPersonnel.filter(p => p.status === 'BAIXADO').length;
    const arejamentoCount = filteredPersonnel.filter(p => p.status === 'AREJAMENTO').length;

    const readinessRate = totalPersonnel > 0 ? Math.round((prontoCount / totalPersonnel) * 100) : 0;
    const avgProductivity = totalPersonnel > 0
        ? Math.round(filteredPersonnel.reduce((acc, p) => {
            if (p.status === 'BAIXADO') return acc;
            const efficiency = p.tasksCompleted > 0 ? Math.min(100, Math.round((p.tasksCompleted / 10) * 10 + 50)) : 50;
            return acc + efficiency;
        }, 0) / filteredPersonnel.filter(p => p.status !== 'BAIXADO').length)
        : 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRONTO': return 'bg-green-500 text-white';
            case 'BAIXADO': return 'bg-red-500 text-white';
            case 'AREJAMENTO': return 'bg-yellow-500 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    const calculateEfficiency = (person: Personnel) => {
        if (person.status === 'BAIXADO') return 0;
        return Math.min(100, Math.round((person.tasksCompleted / 10) * 10 + 50));
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Efetivo</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Controle de Especialidades e Produtividade</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setNewPerson({ status: 'PRONTO', rank: 'Sd', productivity: 100, tasksCompleted: 0 }); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-primary/25"
                >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Adicionar Militar
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-blue-500">groups</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Efetivo</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">{totalPersonnel}</p>
                    <div className="mt-4 flex gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Militares Registrados</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-green-500">verified</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Prontidão</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">{readinessRate}%</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${readinessRate}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-orange-500">engineering</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Produtividade Média</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">{avgProductivity}%</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${avgProductivity}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-green-600 dark:text-green-400">PRONTO</span>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">{prontoCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-red-600 dark:text-red-400">BAIXADO</span>
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">{baixadoCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-yellow-600 dark:text-yellow-400">AREJAMENTO</span>
                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">{arejamentoCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {specialties.map(spec => (
                    <button
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${selectedSpecialty === spec
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white dark:bg-card-dark text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark'
                            }`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* Personnel List */}
            <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Militar</th>
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Especialidade</th>
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Alocação Atual</th>
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Produtividade</th>
                                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredPersonnel.map(person => {
                                const efficiency = calculateEfficiency(person);
                                return (
                                <tr key={person.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                                                {person.avatar ? <img src={person.avatar} alt={person.name} className="h-full w-full object-cover" /> : person.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{person.name}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">{person.rank}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {person.specialty}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${getStatusColor(person.status)}`}>
                                            {person.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-sm text-slate-400">work</span>
                                            <span className="text-xs font-semibold">{person.currentProject}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5 ml-6">{person.location}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-32">
                                            <div className="flex justify-between text-[10px] font-bold mb-1">
                                                <span className="text-slate-600 dark:text-slate-400">Eficiência</span>
                                                <span className={`${efficiency > 90 ? 'text-green-500' : efficiency > 70 ? 'text-blue-500' : 'text-red-500'}`}>
                                                    {efficiency}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${efficiency > 90 ? 'bg-green-500' : efficiency > 70 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                    style={{ width: `${efficiency}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{person.tasksCompleted} Tarefas Concluídas</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditPerson(person)}
                                                className="text-slate-400 hover:text-primary transition-colors"
                                                title="Editar Militar"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeletePerson(person.id)}
                                                className="text-slate-400 hover:text-emergency-red transition-colors"
                                                title="Remover Militar"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
                        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{editingId ? 'Editar Militar' : 'Novo Militar'}</h3>
                            <button
                                onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleAddPerson} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome de Guerra</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Sd. Silva"
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={newPerson.name || ''}
                                    onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Posto/Graduação</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={newPerson.rank || 'Sd'}
                                        onChange={e => setNewPerson({ ...newPerson, rank: e.target.value })}
                                    >
                                        <option value="Sd">Soldado</option>
                                        <option value="Cb">Cabo</option>
                                        <option value="3º Sgt">3º Sargento</option>
                                        <option value="2º Sgt">2º Sargento</option>
                                        <option value="1º Sgt">1º Sargento</option>
                                        <option value="ST">Subtenente</option>
                                        <option value="Asp">Aspirante</option>
                                        <option value="2º Ten">2º Tenente</option>
                                        <option value="1º Ten">1º Tenente</option>
                                        <option value="Cap">Capitão</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Especialidade</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={newPerson.specialty || ''}
                                        onChange={e => setNewPerson({ ...newPerson, specialty: e.target.value as PersonnelSpecialty })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Engenheiro Civil">Engenheiro Civil</option>
                                        <option value="Eletricista">Eletricista</option>
                                        <option value="Pedreiro">Pedreiro</option>
                                        <option value="Mecânico">Mecânico</option>
                                        <option value="Carpinteiro">Carpinteiro</option>
                                        <option value="Auxiliar">Auxiliar</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                <select
                                    required
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={newPerson.status || 'PRONTO'}
                                    onChange={e => setNewPerson({ ...newPerson, status: e.target.value as any })}
                                >
                                    <option value="PRONTO">Pronto</option>
                                    <option value="BAIXADO">Baixado (Médico)</option>
                                    <option value="AREJAMENTO">Arejamento (Férias/Licença)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Localização</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Base Principal"
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={newPerson.location || ''}
                                        onChange={e => setNewPerson({ ...newPerson, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Alocação Atual</label>
                                    <input
                                        type="text"
                                        placeholder="Opcional"
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={newPerson.currentProject || ''}
                                        onChange={e => setNewPerson({ ...newPerson, currentProject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tarefas Concluídas</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={newPerson.tasksCompleted || 0}
                                    onChange={e => setNewPerson({ ...newPerson, tasksCompleted: parseInt(e.target.value) || 0 })}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Número de tarefas finalizadas pelo militar</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonnelPage;
