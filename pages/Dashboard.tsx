
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { MOCK_SERVICES } from '../constants';
import { servicosService } from '../services/servicosService';
import { Servico } from '../types/Servico';
import { logisticsService } from '../services/logisticsService';
import { Material, Equipment } from '../types/Logistics';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PERSONNEL } from '../mocks/personnelData';
import { ServicePhase, ServiceProgress } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard: React.FC = () => {
  const [realProjects, setRealProjects] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ photos: string[]; index: number } | null>(null);
  const [services, setServices] = useState<ServiceProgress[]>(MOCK_SERVICES);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceProgress>>({});
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<{ serviceIndex: number; phaseId?: string } | null>(null);
  const [phaseFormData, setPhaseFormData] = useState<Partial<ServicePhase>>({});
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedPhaseForWhatsApp, setSelectedPhaseForWhatsApp] = useState<{ serviceIndex: number; phaseId: string } | null>(null);
  const [whatsAppNumber] = useState('+55 95 98765-4321');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Inventory State
  const [inventoryCount, setInventoryCount] = useState(0);
  const [stockAlertCount, setStockAlertCount] = useState(0);
  const [machinesInUse, setMachinesInUse] = useState(0);
  const [totalEquipment, setTotalEquipment] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard loaded - Version: PRIORIDADE DE SERVIÇOS');
    const fetchServices = async () => {
      try {
        const data = await servicosService.getAll();
        setRealProjects(data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLogistics = async () => {
      try {
        const [materials, equipment] = await Promise.all([
          logisticsService.getMaterials(),
          logisticsService.getEquipment()
        ]);

        setInventoryCount(materials.length);
        setStockAlertCount(materials.filter(m => m.status === 'BAIXO' || m.status === 'CRITICO').length);

        setTotalEquipment(equipment.length);
        setMachinesInUse(equipment.filter(e => e.status === 'EM_USO').length);

      } catch (error) {
        console.error('Failed to fetch logistics data', error);
      }
    };

    fetchServices();
    fetchLogistics();
  }, []);
  // Calculate Personnel Stats
  const totalPersonnel = MOCK_PERSONNEL.length;

  // "Efetivo Pronto" sums personnel at Operations Center and Works Teams who are 'PRONTO'
  const readyCount = MOCK_PERSONNEL.filter(p => p.status === 'PRONTO').length;
  const missionCount = MOCK_PERSONNEL.filter(p => p.status === 'BAIXADO' || p.currentProject !== '-').length;
  const leaveCount = MOCK_PERSONNEL.filter(p => p.status === 'AREJAMENTO').length;

  const pieData = [
    { name: 'Prontos', value: readyCount, color: '#22c55e' },
    { name: 'Em Missão', value: missionCount, color: '#3b82f6' },
    { name: 'Arejamento', value: leaveCount, color: '#eab308' },
    { name: 'Baixados', value: MOCK_PERSONNEL.filter(p => p.status === 'BAIXADO').length, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Jan', value: 22 },
    { name: 'Fev', value: 31 },
    { name: 'Mar', value: 45 },
    { name: 'Abr', value: 68 },
    { name: 'Mai', value: 52 },
    { name: 'Jun', value: 18 },
  ];

  const getPhaseStatusIcon = (status: ServicePhase['status']) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in_progress': return '⟳';
      case 'pending': return '○';
    }
  };

  const getPhaseStatusColor = (status: ServicePhase['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'pending': return 'text-slate-400 bg-slate-500/5 border-slate-300/30';
    }
  };

  const [isExportOpen, setIsExportOpen] = useState(false);

  // --- Export Functions ---
  const handleExportCSV = () => {
    const headers = ['Obra', 'Contratada', 'Progresso (%)', 'Emergencial', 'Status'];
    const csvContent = [
      headers.join(','),
      ...services.map(s => [
        `"${s.label}"`,
        `"${s.contractor || ''}"`,
        s.value,
        s.isEmergency ? 'Sim' : 'Não',
        s.isEmergency ? 'Crítico' : 'Normal'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `obras_infra_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    link.click();
  };

  const handleExportXLSX = () => {
    const data = services.map(s => ({
      'Obra': s.label,
      'Contratada': s.contractor || '-',
      'Progresso (%)': s.value,
      'Emergencial': s.isEmergency ? 'Sim' : 'Não',
      'Fases': s.phases?.length || 0,
      'Última Atualização': s.lastUpdate || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Obras");
    XLSX.writeFile(wb, `obras_infra_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Relatório de Obras - iNFRA", 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);

    const tableData = services.map(s => [
      s.label,
      s.contractor || '-',
      `${s.value}%`,
      s.isEmergency ? 'Sim' : 'Não',
      s.phases?.length.toString() || '0'
    ]);

    autoTable(doc, {
      head: [['Obra', 'Contratada', 'Progresso', 'Emergencial', 'Fases']],
      body: tableData,
      startY: 30,
    });

    doc.save(`obras_infra_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
  };

  const handleAddService = () => {
    setEditingServiceIndex(null);
    setServiceFormData({ value: 0, isEmergency: false, phases: [] });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (index: number) => {
    setEditingServiceIndex(index);
    setServiceFormData({ ...services[index] });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceIndex !== null) {
      setServices(services.map((s, i) => i === editingServiceIndex ? serviceFormData as ServiceProgress : s));
    } else {
      setServices([...services, { ...serviceFormData, history: [] } as ServiceProgress]);
    }
    setIsServiceModalOpen(false);
    setServiceFormData({});
  };

  const handleAddPhase = (serviceIndex: number) => {
    setEditingPhase({ serviceIndex });
    setPhaseFormData({ status: 'pending', progress: 0, photos: [] });
    setIsPhaseModalOpen(true);
  };

  const handleEditPhase = (serviceIndex: number, phase: ServicePhase) => {
    setEditingPhase({ serviceIndex, phaseId: phase.id });
    setPhaseFormData({ ...phase });
    setIsPhaseModalOpen(true);
  };

  const handleDeletePhase = (serviceIndex: number, phaseId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fase?')) {
      const updatedServices = [...services];
      updatedServices[serviceIndex].phases = updatedServices[serviceIndex].phases?.filter(p => p.id !== phaseId);
      setServices(updatedServices);
    }
  };

  const handleSavePhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhase) return;

    const updatedServices = [...services];
    const service = updatedServices[editingPhase.serviceIndex];

    if (!service.phases) service.phases = [];

    if (editingPhase.phaseId) {
      service.phases = service.phases.map(p =>
        p.id === editingPhase.phaseId ? phaseFormData as ServicePhase : p
      );
    } else {
      const newPhase: ServicePhase = {
        ...phaseFormData as ServicePhase,
        id: Math.random().toString(36).substr(2, 9)
      };
      service.phases.push(newPhase);
    }

    const completedPhases = service.phases.filter(p => p.status === 'completed').length;
    const totalPhases = service.phases.length;
    service.value = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

    setServices(updatedServices);
    setIsPhaseModalOpen(false);
    setPhaseFormData({});
    setEditingPhase(null);
  };

  const handleOpenWhatsAppUpload = (serviceIndex: number, phaseId: string) => {
    setSelectedPhaseForWhatsApp({ serviceIndex, phaseId });
    setIsWhatsAppModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedPhaseForWhatsApp) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileUrls: string[] = [];
    const totalFiles = files.length;
    let processedFiles = 0;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          fileUrls.push(e.target.result as string);
          processedFiles++;
          setUploadProgress(Math.round((processedFiles / totalFiles) * 100));

          if (fileUrls.length === files.length) {
            addPhotosToPhase(fileUrls);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 500);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPhotosToPhase = (photoUrls: string[]) => {
    if (!selectedPhaseForWhatsApp) return;

    const updatedServices = [...services];
    const service = updatedServices[selectedPhaseForWhatsApp.serviceIndex];
    const phase = service.phases?.find(p => p.id === selectedPhaseForWhatsApp.phaseId);

    if (phase) {
      if (!phase.photos) phase.photos = [];
      phase.photos.push(...photoUrls);
      setServices(updatedServices);

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsWhatsAppModalOpen(false);
      }, 2000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file: File) => file.type.startsWith('image/'));

    if (imageFiles.length > 0 && selectedPhaseForWhatsApp) {
      setIsUploading(true);
      setUploadProgress(0);

      const fileUrls: string[] = [];
      const totalFiles = imageFiles.length;
      let processedFiles = 0;

      imageFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            fileUrls.push(event.target.result as string);
            processedFiles++;
            setUploadProgress(Math.round((processedFiles / totalFiles) * 100));

            if (fileUrls.length === imageFiles.length) {
              addPhotosToPhase(fileUrls);
              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                setIsWhatsAppModalOpen(false);
              }, 500);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm cursor-pointer hover:border-green-500/50 transition-all group relative" onClick={() => navigate('/logistica', { state: { tab: 'equipment' } })}>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-green-500">open_in_new</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Máquinas em Uso</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black">{machinesInUse}</h3>
            <span className="text-slate-400 text-sm font-medium">/ {totalEquipment}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm cursor-pointer hover:border-blue-500/50 transition-all group relative" onClick={() => navigate('/logistica', { state: { tab: 'inventory' } })}>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-blue-500">open_in_new</span>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Itens em Estoque</p>
          <h3 className="text-3xl font-black mt-1">{inventoryCount}</h3>
        </div>

        <div className="bg-[#1A1F2B] dark:bg-card-dark p-6 rounded-xl border border-red-900/30 dark:border-red-900/20 shadow-lg shadow-red-900/5 relative overflow-hidden group cursor-pointer hover:border-red-500/50 transition-all" onClick={() => navigate('/logistica', { state: { tab: 'inventory', filter: 'CRITICAL' } })}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl text-red-500">warning</span>
          </div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-500 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20 animate-pulse">
              Ação Necessária
            </span>
          </div>

          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Estoque Baixo/Crítico</p>
            <h3 className="text-4xl font-black text-red-500 drop-shadow-sm">{stockAlertCount}</h3>
            <p className="text-red-400/60 text-[10px] font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              Ver detalhes do inventário
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-emergency-red/30 dark:border-emergency-red/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-emergency-red">warning</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-lg bg-emergency-red/10 text-emergency-red flex items-center justify-center">
              <span className="material-symbols-outlined">report_problem</span>
            </div>
            <span className="px-2 py-1 bg-emergency-red text-white text-[10px] font-bold rounded uppercase">Crítico</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Obras em Emergência</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-emergency-red">12</h3>
            <span className="text-slate-400 text-sm font-medium">Intervenções</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bars */}
        <div className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-base uppercase tracking-tight">Andamento das Obras Contratadas</h4>
              <p className="text-xs text-slate-500 font-medium">Progresso físico por categoria de obra</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  EXPORTAR
                </button>
                {isExportOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-slate-200 dark:border-border-dark overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => { handleExportXLSX(); setIsExportOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-sm text-green-600">table_view</span>
                      Exportar XLSX
                    </button>
                    <button
                      onClick={() => { handleExportCSV(); setIsExportOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-sm text-blue-600">csv</span>
                      Exportar CSV
                    </button>
                    <button
                      onClick={() => { handleExportPDF(); setIsExportOpen(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-600 dark:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-sm text-red-600">picture_as_pdf</span>
                      Exportar PDF
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleAddService}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Nova Obra
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {services.map((service, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-border-dark rounded-lg overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors"
                  onClick={() => setExpandedService(expandedService === idx ? null : idx)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`flex justify-between text-xs font-bold uppercase tracking-tight ${service.isEmergency ? 'text-emergency-red' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            {expandedService === idx ? 'expand_less' : 'expand_more'}
                          </span>
                          <span>{service.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{service.value}%</span>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEditService(idx)}
                              className="text-slate-400 hover:text-primary transition-colors"
                              title="Editar obra"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(idx)}
                              className="text-slate-400 hover:text-emergency-red transition-colors"
                              title="Excluir obra"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      {service.contractor && (
                        <p className="text-[10px] text-slate-400 mt-0.5 ml-6">
                          Contratada: {service.contractor} | Atualizado em {service.lastUpdate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 h-3 w-full bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${service.isEmergency ? 'bg-emergency-red shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-primary'}`}
                      style={{ width: `${service.value}%` }}
                    ></div>
                  </div>
                </div>

                {expandedService === idx && service.phases && (
                  <div className="border-t border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark/30 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fases da Obra</h5>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddPhase(idx);
                        }}
                        className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 bg-white dark:bg-card-dark px-3 py-1.5 rounded-lg border border-primary/30 hover:border-primary transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Adicionar Fase
                      </button>
                    </div>
                    <div className="space-y-3">
                      {service.phases.map((phase) => (
                        <div key={phase.id} className={`border rounded-lg p-3 ${getPhaseStatusColor(phase.status)} relative group`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-lg font-bold">{getPhaseStatusIcon(phase.status)}</span>
                              <div className="flex-1">
                                <p className="text-xs font-bold">{phase.name}</p>
                                {phase.startDate && (
                                  <p className="text-[9px] text-slate-500 mt-0.5">
                                    Início: {phase.startDate}
                                    {phase.endDate && ` | Fim: ${phase.endDate}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{phase.progress}%</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPhase(idx, phase);
                                  }}
                                  className="p-1 text-slate-400 hover:text-primary transition-colors bg-white dark:bg-card-dark rounded shadow-sm"
                                  title="Editar fase"
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePhase(idx, phase.id);
                                  }}
                                  className="p-1 text-slate-400 hover:text-emergency-red transition-colors bg-white dark:bg-card-dark rounded shadow-sm"
                                  title="Excluir fase"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {phase.status !== 'pending' && (
                            <div className="w-full bg-white/50 dark:bg-black/20 h-1.5 rounded-full overflow-hidden mb-2">
                              <div
                                className={`h-full rounded-full transition-all ${phase.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${phase.progress}%` }}
                              ></div>
                            </div>
                          )}

                          {phase.photos && phase.photos.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                              {phase.photos.map((photo, photoIdx) => (
                                <div
                                  key={photoIdx}
                                  className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group/photo border-2 border-white dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoModal({ photos: phase.photos!, index: photoIdx });
                                  }}
                                >
                                  <img
                                    src={photo}
                                    alt={`${phase.name} - Foto ${photoIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/40 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                      zoom_in
                                    </span>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenWhatsAppUpload(idx, phase.id);
                                }}
                                className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-green-300 dark:border-green-600 flex flex-col items-center justify-center text-green-500 hover:text-green-600 hover:border-green-400 transition-colors group"
                                title="Enviar foto via WhatsApp"
                              >
                                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                                <span className="text-[8px] font-bold mt-0.5">WhatsApp</span>
                              </button>
                            </div>
                          )}

                          {(!phase.photos || phase.photos.length === 0) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWhatsAppUpload(idx, phase.id);
                              }}
                              className="mt-3 w-full py-2 rounded-lg border-2 border-dashed border-green-300 dark:border-green-600 flex items-center justify-center gap-2 text-green-500 hover:text-green-600 hover:border-green-400 transition-colors text-xs font-bold"
                            >
                              <span className="material-symbols-outlined text-sm">photo_camera</span>
                              Adicionar Fotos via WhatsApp
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>



        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col relative group overflow-hidden">
          <Link to="/personnel" className="absolute inset-0 z-10" aria-label="Ver detalhes de pessoal"></Link>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-base uppercase tracking-tight group-hover:text-primary transition-colors">Status do Pessoal</h4>
              <p className="text-xs text-slate-500 font-medium">Distribuição e Alocação</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">open_in_new</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Left Side: Pie Chart */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="relative w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-700 dark:text-slate-200">{readyCount}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Prontos</span>
                </div>
              </div>
              <div className="w-full mt-2 space-y-2 px-2">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-slate-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Deployment List */}
            <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
              <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-4">Efetivo por Obra</h5>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(MOCK_PERSONNEL.reduce((acc, curr) => {
                  if (curr.currentProject !== '-' && curr.status === 'PRONTO') {
                    acc[curr.currentProject] = (acc[curr.currentProject] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>))
                  .sort(([, a], [, b]) => b - a)
                  .map(([project, count], idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[70%]" title={project}>{project}</span>
                        <span className="font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px]">{count}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${(count / MOCK_PERSONNEL.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                {Object.keys(MOCK_PERSONNEL.reduce((acc, curr) => {
                  if (curr.currentProject !== '-' && curr.status === 'PRONTO') {
                    acc[curr.currentProject] = (acc[curr.currentProject] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>)).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <span className="material-symbols-outlined text-2xl mb-2 opacity-50">engineering</span>
                      <p className="text-[10px] text-center">Nenhum pessoal locado em obras no momento.</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GUT Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base uppercase tracking-tight">PRIORIDADE DE SERVIÇOS</h4>
              <p className="text-xs text-slate-500 font-medium">Gravidade, Urgência e Tendência</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-background-dark/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">Projeto / Obra</th>
                  <th className="px-6 py-3 text-center">G</th>
                  <th className="px-6 py-3 text-center">U</th>
                  <th className="px-6 py-3 text-center">T</th>
                  <th className="px-6 py-3 text-center">Soma</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Carregando dados do sistema...</td>
                  </tr>
                ) : realProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Nenhuma obra/serviço lançado.</td>
                  </tr>
                ) : (
                  realProjects.map((project) => {
                    // Determine status based on priority (GUT)
                    let statusLabel = 'BAIXA';
                    let statusColor = 'text-green-500';
                    let bgBadge = 'bg-green-500/20 text-green-500';
                    let dotColor = 'bg-green-500';

                    if (project.prioridade >= 100) {
                      statusLabel = 'IMEDIATO';
                      statusColor = 'text-emergency-red';
                      bgBadge = 'bg-emergency-red text-white';
                      dotColor = 'bg-emergency-red';
                    } else if (project.prioridade >= 60) {
                      statusLabel = 'ALTA';
                      statusColor = 'text-orange-500';
                      bgBadge = 'bg-orange-500/20 text-orange-500';
                      dotColor = 'bg-orange-500';
                    } else if (project.prioridade >= 30) {
                      statusLabel = 'MÉDIA';
                      statusColor = 'text-yellow-500';
                      bgBadge = 'bg-yellow-500/20 text-yellow-500';
                      dotColor = 'bg-yellow-500';
                    }

                    return (
                      <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{project.titulo}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{project.localizacao || 'Sem Localização'}</p>
                        </td>
                        <td className="px-6 py-4 text-center font-bold">{project.gravidade}</td>
                        <td className="px-6 py-4 text-center font-bold">{project.urgencia}</td>
                        <td className="px-6 py-4 text-center font-bold">{project.tendencia}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-black ${bgBadge}`}>
                            {project.prioridade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Costs Bar Chart */}
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-base uppercase tracking-tight">Gastos CPGF</h4>
              <p className="text-xs text-slate-500 font-medium">Cartão Corporativo Mensal</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">credit_card</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" hide />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#161e27', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#137fec' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#137fec' : 'rgba(19, 127, 236, 0.2)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase px-2">
            {barData.map(d => <span key={d.name}>{d.name}</span>)}
          </div>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
              <span className="text-slate-500">Saldo Atual do Cartão</span>
              <span className="text-slate-900 dark:text-slate-100">R$ 14.820,00</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-card-dark h-1.5 rounded-full mt-2">
              <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {
        selectedPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>

              <div className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={selectedPhotoModal.photos[selectedPhotoModal.index]}
                  alt="Visualização da foto"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />

                {selectedPhotoModal.photos.length > 1 && (
                  <div className="flex gap-2 p-4 bg-slate-50 dark:bg-background-dark overflow-x-auto">
                    {selectedPhotoModal.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoModal({ ...selectedPhotoModal, index: idx })}
                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${idx === selectedPhotoModal.index
                          ? 'border-primary scale-105'
                          : 'border-slate-300 dark:border-slate-600 opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={photo} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {
        isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
              <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingServiceIndex !== null ? 'Editar Obra' : 'Nova Obra'}
                </h3>
                <button
                  onClick={() => { setIsServiceModalOpen(false); setServiceFormData({}); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveService} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome da Obra</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Terraplanagem Setor Norte"
                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                    value={serviceFormData.label || ''}
                    onChange={e => setServiceFormData({ ...serviceFormData, label: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Empresa Contratada</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Construtora Norte Ltda"
                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                    value={serviceFormData.contractor || ''}
                    onChange={e => setServiceFormData({ ...serviceFormData, contractor: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Progresso (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={serviceFormData.value || 0}
                      onChange={e => setServiceFormData({ ...serviceFormData, value: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Emergencial?</label>
                    <select
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={serviceFormData.isEmergency ? 'true' : 'false'}
                      onChange={e => setServiceFormData({ ...serviceFormData, isEmergency: e.target.value === 'true' })}
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsServiceModalOpen(false); setServiceFormData({}); }}
                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {editingServiceIndex !== null ? 'Salvar Alterações' : 'Adicionar Obra'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {
        isPhaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-border-dark">
              <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingPhase?.phaseId ? 'Editar Fase' : 'Nova Fase'}
                </h3>
                <button
                  onClick={() => { setIsPhaseModalOpen(false); setPhaseFormData({}); setEditingPhase(null); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSavePhase} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome da Fase</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fundação, Alvenaria, Pintura..."
                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                    value={phaseFormData.name || ''}
                    onChange={e => setPhaseFormData({ ...phaseFormData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                    <select
                      required
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={phaseFormData.status || 'pending'}
                      onChange={e => setPhaseFormData({ ...phaseFormData, status: e.target.value as ServicePhase['status'] })}
                    >
                      <option value="pending">Pendente</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="completed">Concluída</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Progresso (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={phaseFormData.progress || 0}
                      onChange={e => setPhaseFormData({ ...phaseFormData, progress: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Data Início</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={phaseFormData.startDate || ''}
                      onChange={e => setPhaseFormData({ ...phaseFormData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Data Fim</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                      value={phaseFormData.endDate || ''}
                      onChange={e => setPhaseFormData({ ...phaseFormData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">URLs das Fotos</label>
                  <textarea
                    placeholder="Cole URLs de fotos, uma por linha"
                    rows={3}
                    className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-sm font-medium focus:ring-primary focus:border-primary p-2.5"
                    value={phaseFormData.photos?.join('\n') || ''}
                    onChange={e => setPhaseFormData({ ...phaseFormData, photos: e.target.value.split('\n').filter(url => url.trim()) })}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Uma URL por linha</p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsPhaseModalOpen(false); setPhaseFormData({}); setEditingPhase(null); }}
                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {editingPhase?.phaseId ? 'Salvar Alterações' : 'Adicionar Fase'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {
        isWhatsAppModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-border-dark">
              <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center bg-gradient-to-r from-green-500 to-green-600">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Enviar Fotos via WhatsApp</h3>
                    <p className="text-xs text-green-100">Compartilhe fotos da obra pelo WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsWhatsAppModalOpen(false); setSelectedPhaseForWhatsApp(null); }}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    Como enviar fotos
                  </h4>
                  <ol className="space-y-2 text-xs text-green-800 dark:text-green-200">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Abra o WhatsApp no seu celular</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Envie as fotos para o número abaixo</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>As fotos serão automaticamente adicionadas à fase da obra</span>
                    </li>
                  </ol>
                </div>

                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-xl">
                    <span className="material-symbols-outlined text-green-500 text-3xl">whatsapp</span>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Número do Sistema</p>
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{whatsAppNumber}</p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${whatsAppNumber.replace(/\D/g, '')}?text=Olá! Gostaria de enviar fotos da obra.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-500/30"
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                    Abrir WhatsApp
                  </a>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-card-dark px-2 text-slate-500 font-bold uppercase">Ou</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Upload Direto</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging
                      ? 'border-primary bg-primary/5 scale-105'
                      : uploadSuccess
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {uploadSuccess ? (
                      <div className="py-4">
                        <span className="material-symbols-outlined text-6xl text-green-500 block mb-3 animate-bounce">
                          check_circle
                        </span>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          Fotos enviadas com sucesso!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          As fotos foram adicionadas à fase da obra
                        </p>
                      </div>
                    ) : isUploading ? (
                      <div className="py-4">
                        <div className="inline-flex items-center gap-3 mb-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            Enviando fotos...
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{uploadProgress}% concluído</p>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            handleFileUpload(e);
                          }}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                          <span className={`material-symbols-outlined text-4xl block mb-2 transition-colors ${isDragging ? 'text-primary' : 'text-slate-400'
                            }`}>
                            {isDragging ? 'download' : 'upload_file'}
                          </span>
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            {isDragging ? 'Solte as fotos aqui' : 'Clique para selecionar fotos'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {isDragging ? 'Pode soltar agora!' : 'Ou arraste e solte aqui'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            Aceita: JPG, PNG, HEIC • Múltiplas fotos
                          </p>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-xl">lightbulb</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-1">Dica</p>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        Configure o número {whatsAppNumber} como contato favorito para envio rápido de fotos das obras.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Dashboard;
