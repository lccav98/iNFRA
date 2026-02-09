import React, { useState, useEffect } from 'react';
import { Material, Equipment, MachineAllocation } from '../types/Logistics';
import { logisticsService } from '../services/logisticsService';

import { useLocation } from 'react-router-dom';

const LogisticsPage: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'inventory' | 'equipment' | 'schedule'>('inventory');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'CRITICO'>('ALL');

    const [allocations, setAllocations] = useState<MachineAllocation[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.filter === 'CRITICAL') {
            setFilterStatus('CRITICO');
        }
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [materialsData, equipmentData, allocationsData] = await Promise.all([
                logisticsService.getMaterials(),
                logisticsService.getEquipment(),
                logisticsService.getAllocations()
            ]);
            setMaterials(materialsData);
            setEquipment(equipmentData);
            setAllocations(allocationsData);
        } catch (error) {
            console.error('Error fetching logistics data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Material Modal State
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [materialFormData, setMaterialFormData] = useState<Partial<Material>>({});
    const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

    // --- Material Handlers ---
    const handleAddMaterial = () => {
        setEditingMaterialId(null);
        setMaterialFormData({
            status: 'OK',
            quantity: 0,
            unit: 'un'
        });
        setIsMaterialModalOpen(true);
    };

    const handleEditMaterial = (item: Material) => {
        setEditingMaterialId(item.id);
        setMaterialFormData({ ...item });
        setIsMaterialModalOpen(true);
    };

    const handleDeleteMaterial = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este material?')) {
            try {
                await logisticsService.deleteMaterial(id);
                setMaterials(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error('Failed to delete material', error);
                alert('Erro ao excluir material');
            }
        }
    };

    const handleSaveMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMaterialId) {
                const updated = await logisticsService.updateMaterial(editingMaterialId, materialFormData);
                setMaterials(prev => prev.map(m => m.id === editingMaterialId ? updated : m));
            } else {
                const created = await logisticsService.createMaterial(materialFormData as Omit<Material, 'id'>);
                setMaterials(prev => [created, ...prev]);
            }
            setIsMaterialModalOpen(false);
        } catch (error) {
            console.error('Failed to save material', error);
            alert('Erro ao salvar material');
        }
    };

    // Allocation Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<MachineAllocation>>({});

    // Equipment Modal State
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [equipmentFormData, setEquipmentFormData] = useState<Partial<Equipment>>({});
    const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);

    // --- Allocation Handlers ---

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            status: 'PENDING',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleEdit = (allocation: MachineAllocation) => {
        setEditingId(allocation.id);
        setFormData({ ...allocation });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
            try {
                await logisticsService.deleteAllocation(id);
                setAllocations(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error('Failed to delete allocation', error);
                alert('Erro ao excluir agendamento');
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update
                const updated = await logisticsService.updateAllocation(editingId, formData);
                setAllocations(prev => prev.map(a => a.id === editingId ? updated : a));
            } else {
                // Create
                const created = await logisticsService.createAllocation(formData as Omit<MachineAllocation, 'id'>);
                setAllocations(prev => [created, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save allocation', error);
            alert('Erro ao salvar agendamento');
        }
    };


    // --- Equipment Handlers ---

    const handleAddEquipment = () => {
        setEditingEquipmentId(null);
        setEquipmentFormData({
            status: 'DISPONIVEL',
            condition: 100,
            type: 'MAQUINA'
        });
        setIsEquipmentModalOpen(true);
    };

    const handleEditEquipment = (item: Equipment) => {
        setEditingEquipmentId(item.id);
        setEquipmentFormData({ ...item });
        setIsEquipmentModalOpen(true);
    };

    const handleDeleteEquipment = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
            try {
                await logisticsService.deleteEquipment(id);
                setEquipment(prev => prev.filter(e => e.id !== id));
            } catch (error) {
                console.error('Failed to delete equipment', error);
                alert('Erro ao excluir equipamento');
            }
        }
    };

    const handleSaveEquipment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEquipmentId) {
                // Update
                const updated = await logisticsService.updateEquipment(editingEquipmentId, equipmentFormData);
                setEquipment(prev => prev.map(item => item.id === editingEquipmentId ? updated : item));
            } else {
                // Create
                const created = await logisticsService.createEquipment(equipmentFormData as Omit<Equipment, 'id'>);
                setEquipment(prev => [created, ...prev]);
            }
            setIsEquipmentModalOpen(false);
        } catch (error) {
            console.error('Failed to save equipment', error);
            alert('Erro ao salvar equipamento');
        }
    };

    const lowStockCount = materials.filter(m => m.status === 'BAIXO' || m.status === 'CRITICO').length;
    const criticalStockCount = materials.filter(m => m.status === 'CRITICO').length;
    const machinesInUse = equipment.filter(e => e.status === 'EM_USO').length;
    const maintenanceCount = equipment.filter(e => e.status === 'MANUTENCAO').length;


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OK': return 'text-green-500 bg-green-500/10';
            case 'BAIXO': return 'text-yellow-500 bg-yellow-500/10';
            case 'CRITICO': return 'text-emergency-red bg-emergency-red/10';
            case 'DISPONIVEL': return 'text-green-500 bg-green-500/10';
            case 'EM_USO': return 'text-blue-500 bg-blue-500/10';
            case 'MANUTENCAO': return 'text-orange-500 bg-orange-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Itens em Estoque</p>
                    <h3 className="text-3xl font-black mt-1">{materials.length}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-emergency-red/10 text-emergency-red flex items-center justify-center">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        {criticalStockCount > 0 && <span className="bg-emergency-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Ação Necessária</span>}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Estoque Baixo/Crítico</p>
                    <h3 className="text-3xl font-black mt-1 text-emergency-red">{lowStockCount}</h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">agriculture</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Máquinas em Uso</p>
                    <h3 className="text-3xl font-black mt-1">{machinesInUse} <span className="text-sm text-slate-400 font-medium">/ {equipment.length}</span></h3>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">build</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Em Manutenção</p>
                    <h3 className="text-3xl font-black mt-1 text-orange-500">{maintenanceCount}</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-border-dark">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'inventory', label: 'Estoque de Materiais', icon: 'inventory' },
                        { id: 'equipment', label: 'Maquinário e Ferramentas', icon: 'handyman' },
                        { id: 'schedule', label: 'Escalonamento', icon: 'calendar_month' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-bold uppercase tracking-wide transition-colors
                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'}
              `}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden min-h-[400px]">
                {activeTab === 'inventory' && (
                    <div className="overflow-x-auto">
                        <div className="p-4 flex justify-end">
                            <button
                                onClick={handleAddMaterial}
                                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Material
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-background-dark/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-border-dark">
                                <tr>
                                    <th className="px-6 py-4" colSpan={6}>
                                        <div className="flex justify-between items-center">
                                            <span>Inventário</span>
                                            {filterStatus === 'CRITICO' && (
                                                <button
                                                    onClick={() => setFilterStatus('ALL')}
                                                    className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                    Filtrando Críticos
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4 text-center">Quantidade</th>
                                    <th className="px-6 py-4">Localização</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                                {materials
                                    .filter(item => filterStatus === 'ALL' || (filterStatus === 'CRITICO' && (item.status === 'BAIXO' || item.status === 'CRITICO')))
                                    .map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs uppercase font-bold tracking-tight">{item.category}</td>
                                            <td className="px-6 py-4 text-center font-mono font-medium">
                                                {item.quantity} <span className="text-slate-400 text-xs">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">{item.location}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditMaterial(item)}
                                                        className="text-slate-400 hover:text-primary transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMaterial(item.id)}
                                                        className="text-slate-400 hover:text-emergency-red transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'equipment' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold uppercase text-sm tracking-wide">Frota e Ferramentas</h4>
                            <button
                                onClick={handleAddEquipment}
                                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Item
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {equipment.map((item) => (
                                <div key={item.id} className="border border-slate-200 dark:border-border-dark rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-50/50 dark:bg-background-dark/50 relative group">
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditEquipment(item)}
                                            className="p-1 text-slate-400 hover:text-primary bg-white dark:bg-card-dark rounded shadow-sm"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEquipment(item.id)}
                                            className="p-1 text-slate-400 hover:text-emergency-red bg-white dark:bg-card-dark rounded shadow-sm"
                                            title="Excluir"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${item.type === 'MAQUINA' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            <span className="material-symbols-outlined">{item.type === 'MAQUINA' ? 'front_loader' : 'handyman'}</span>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{item.name}</h4>
                                    <div className="space-y-2 mt-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Condição:</span>
                                            <span className={`font-bold ${item.condition < 50 ? 'text-emergency-red' : 'text-green-500'}`}>{item.condition}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-background-dark h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${item.condition < 50 ? 'bg-emergency-red' : 'bg-green-500'}`} style={{ width: `${item.condition}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs pt-2 border-t border-slate-200 dark:border-border-dark mt-2">
                                            <span className="text-slate-500 font-medium">Localização:</span>
                                            <span className="text-slate-900 dark:text-slate-100 font-bold">{item.location}</span>
                                        </div>
                                        {item.currentServiceId && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Serviço:</span>
                                                <span className="text-blue-500 font-bold">{item.currentServiceId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold uppercase text-sm tracking-wide">Cronograma de Utilização</h4>
                            <button
                                onClick={handleAddNew}
                                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Escalar Máquina
                            </button>
                        </div>

                        <div className="space-y-4">
                            {allocations.map((alloc) => {
                                const allocEquipment = equipment.find(e => e.id === alloc.equipmentId);
                                return (
                                    <div key={alloc.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors">
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined">calendar_today</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{allocEquipment?.name || 'Equipamento Desconhecido'}</p>
                                                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${alloc.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-slate-200 text-slate-500'}`}>
                                                    {alloc.status === 'ACTIVE' ? 'Em Andamento' : 'Agendado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">Serviço Destino</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{alloc.serviceName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">Período</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{alloc.startDate} - {alloc.endDate}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(alloc)}
                                                className="text-slate-400 hover:text-primary transition-colors"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(alloc.id)}
                                                className="text-slate-400 hover:text-emergency-red transition-colors"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
                        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                {editingId ? 'Editar Escalonamento' : 'Escalar Nova Máquina'}
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
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Equipamento</label>
                                <select
                                    required
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={formData.equipmentId || ''}
                                    onChange={e => setFormData({ ...formData, equipmentId: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {equipment.map(eq => (
                                        <option key={eq.id} value={eq.id}>{eq.name} ({eq.status})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Serviço / Obra</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nome do serviço destino..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={formData.serviceName || ''}
                                    onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Data Início</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.startDate || ''}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Data Fim</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={formData.endDate || ''}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                <select
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={formData.status || 'PENDING'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="PENDING">Agendado</option>
                                    <option value="ACTIVE">Em Andamento</option>
                                    <option value="COMPLETED">Concluído</option>
                                </select>
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
                                    {editingId ? 'Salvar Alterações' : 'Confirmar Escala'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEquipmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
                        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                {editingEquipmentId ? 'Editar Equipamento' : 'Novo Equipamento'}
                            </h3>
                            <button
                                onClick={() => setIsEquipmentModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEquipment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome do Item</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Betoneira, Furadeira..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={equipmentFormData.name || ''}
                                    onChange={e => setEquipmentFormData({ ...equipmentFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={equipmentFormData.type || 'MAQUINA'}
                                        onChange={e => setEquipmentFormData({ ...equipmentFormData, type: e.target.value as any })}
                                    >
                                        <option value="MAQUINA">Máquina</option>
                                        <option value="VEICULO">Veículo</option>
                                        <option value="FERRAMENTA">Ferramenta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={equipmentFormData.status || 'DISPONIVEL'}
                                        onChange={e => setEquipmentFormData({ ...equipmentFormData, status: e.target.value as any })}
                                    >
                                        <option value="DISPONIVEL">Disponível</option>
                                        <option value="EM_USO">Em Uso</option>
                                        <option value="MANUTENCAO">Manutenção</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Condição ({equipmentFormData.condition || 100}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                                    value={equipmentFormData.condition ?? 100}
                                    onChange={e => setEquipmentFormData({ ...equipmentFormData, condition: parseInt(e.target.value) })}
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1">
                                    <span>Crítico (0%)</span>
                                    <span>Novo (100%)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Localização Atual</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Almoxarifado, Canteiro A..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={equipmentFormData.location || ''}
                                    onChange={e => setEquipmentFormData({ ...equipmentFormData, location: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEquipmentModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingEquipmentId ? 'Salvar Item' : 'Adicionar Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isMaterialModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
                        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                {editingMaterialId ? 'Editar Material' : 'Novo Material'}
                            </h3>
                            <button
                                onClick={() => setIsMaterialModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveMaterial} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome do Item</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Cimento, Tijolo..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={materialFormData.name || ''}
                                    onChange={e => setMaterialFormData({ ...materialFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Categoria</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={materialFormData.category || ''}
                                        onChange={e => setMaterialFormData({ ...materialFormData, category: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="ALVENARIA">Alvenaria</option>
                                        <option value="INSUMOS">Insumos</option>
                                        <option value="FERRAGEM">Ferragem</option>
                                        <option value="ELÉTRICA">Elétrica</option>
                                        <option value="HIDRÁULICA">Hidráulica</option>
                                        <option value="PINTURA">Pintura</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={materialFormData.status || 'OK'}
                                        onChange={e => setMaterialFormData({ ...materialFormData, status: e.target.value as any })}
                                    >
                                        <option value="OK">OK</option>
                                        <option value="BAIXO">Baixo</option>
                                        <option value="CRITICO">Crítico</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={materialFormData.quantity || 0}
                                        onChange={e => setMaterialFormData({ ...materialFormData, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Unidade</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="un, kg, m..."
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                        value={materialFormData.unit || ''}
                                        onChange={e => setMaterialFormData({ ...materialFormData, unit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Localização</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Depósito A..."
                                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                                    value={materialFormData.location || ''}
                                    onChange={e => setMaterialFormData({ ...materialFormData, location: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsMaterialModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {editingMaterialId ? 'Salvar Item' : 'Adicionar Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogisticsPage;
