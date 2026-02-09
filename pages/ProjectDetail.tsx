
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_MATERIALS } from '../constants';
import { servicosService } from '../services/servicosService';
import { Servico } from '../types/Servico';

const ProjectDetail: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const data = await servicosService.getAll();
      setServicos(data.filter(s => s.foto_url)); // Only show services with photos
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
            <span>Gestão de Obras iNFRA</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Setor 3</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Construção de Alojamento Setor 3</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs uppercase">
            <button className="px-4 py-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm text-primary">Preventiva</button>
            <button className="px-4 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Corretiva</button>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/20 transition-all uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">download_for_offline</span>
            Relatório PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Gravidade (G)</span>
            <span className="material-symbols-outlined text-red-500">warning</span>
          </div>
          <div className="text-4xl font-black text-red-500">5</div>
          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tight">Danos Críticos Identificados</p>
        </div>

        <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Urgência (U)</span>
            <span className="material-symbols-outlined text-amber-500">schedule</span>
          </div>
          <div className="text-4xl font-black text-amber-500">4</div>
          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tight">Prazo de Início: Imediato</p>
        </div>

        <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tendência (T)</span>
            <span className="material-symbols-outlined text-emerald-500">trending_up</span>
          </div>
          <div className="text-4xl font-black text-emerald-500">5</div>
          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tight">Piora rápida sem ação</p>
        </div>

        <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-center">
          <div className="text-center">
            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">ID DO PROJETO</div>
            <div className="font-mono text-lg font-black text-primary">PRJ-2023-084</div>
            <div className="flex items-center justify-center gap-1 mt-2 text-slate-400">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-[10px] font-black uppercase">Pacaraima, RR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="xl:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h3 className="font-black text-xs uppercase tracking-widest">Cronograma da Empresa</h3>
            </div>
            <div className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-full uppercase">68% Concluído</div>
          </div>
          <div className="p-6 overflow-x-auto custom-scrollbar">
            <div className="min-w-[600px] space-y-4">
              <div className="flex text-[10px] font-black text-slate-400 uppercase mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">
                <div className="w-1/4">Atividade</div>
                <div className="flex-1 grid grid-cols-4 text-center">
                  <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 text-xs font-black truncate pr-4 uppercase tracking-tight">Fundação e Solo</div>
                <div className="flex-1 relative h-7 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                  <div className="absolute inset-0 w-full bg-emerald-500 rounded-full opacity-30"></div>
                  <div className="absolute inset-0 w-full flex items-center px-4 text-[9px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">Concluído</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 text-xs font-black truncate pr-4 uppercase tracking-tight">Estrutura Alvenaria</div>
                <div className="flex-1 relative h-7 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                  <div className="absolute inset-0 w-[85%] bg-primary rounded-full opacity-30"></div>
                  <div className="absolute inset-0 w-[85%] flex items-center px-4 text-[9px] font-black text-primary uppercase tracking-widest">85% em andamento</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 text-xs font-black truncate pr-4 uppercase tracking-tight">Instalação Elétrica</div>
                <div className="flex-1 relative h-7 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                  <div className="absolute inset-y-0 left-[40%] w-[30%] bg-amber-500 rounded-full opacity-30"></div>
                  <div className="absolute inset-y-0 left-[40%] w-[30%] flex items-center px-4 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest text-center">Aguardando Material</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/4 text-xs font-black truncate pr-4 uppercase tracking-tight">Acabamento Final</div>
                <div className="flex-1 relative h-7 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Início Previsto: Maio</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark flex flex-col shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory</span>
              <h3 className="font-black text-xs uppercase tracking-widest">Materiais Empregados</h3>
            </div>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">filter_list</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white dark:bg-card-dark border-b border-slate-100 dark:border-border-dark z-10">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Qtd</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {MOCK_MATERIALS.map((mat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors">
                    <td className="p-4 text-xs font-bold">{mat.name}</td>
                    <td className="p-4 text-xs text-center font-black">{mat.quantity}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${mat.status === 'OK' ? 'bg-emerald-500' : mat.status === 'BAIXO' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] font-black ${mat.status === 'OK' ? 'text-emerald-600' : mat.status === 'BAIXO' ? 'text-amber-600' : 'text-red-600'}`}>{mat.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden mb-12">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-border-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
            <div>
              <h3 className="font-black text-lg leading-none uppercase tracking-tight">Galeria de Acompanhamento</h3>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase">Registros fotográficos de campo e evidências</p>
            </div>
          </div>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">cloud_upload</span>
            Enviar Foto
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {servicos.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              Nenhum registro fotográfico encontrado
            </div>
          ) : (
            servicos.map((servico) => (
              <Link to={`/servicos/${servico.id}`} key={servico.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-border-dark bg-slate-100 cursor-pointer shadow-sm">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={`${BASE_URL}${servico.foto_url}`}
                  alt={servico.titulo}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-[10px] text-white font-black">{new Date(servico.created_at).toLocaleDateString('pt-BR')}</p>
                  <p className="text-[9px] text-white/70 font-bold uppercase tracking-tight truncate">{servico.titulo}</p>
                </div>
              </Link>
            ))
          )}
          <div
            onClick={() => navigate('/servicos')}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary/50 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/20"
          >
            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Novo Registro</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
