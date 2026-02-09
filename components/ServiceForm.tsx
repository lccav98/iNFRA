
import React, { useState, useRef, useEffect } from 'react';

interface ServiceFormData {
    titulo: string;
    descricao: string;
    localizacao: string;
    gravidade: number;
    urgencia: number;
    tendencia: number;
    status: string;
}

interface ServiceFormProps {
    initialData?: ServiceFormData;
    initialPhotoPreview?: string | null;
    onSubmit: (formData: FormData) => Promise<void>;
    submitLabel?: string;
    onCancel?: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    initialData,
    initialPhotoPreview,
    onSubmit,
    submitLabel = 'Enviar Relatório',
    onCancel
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [botoes, setBotoes] = useState<ServiceFormData>({
        titulo: '',
        descricao: '',
        localizacao: '',
        gravidade: 3,
        urgencia: 3,
        tendencia: 3,
        status: 'Pendente',
        ...initialData
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialPhotoPreview) {
            setPreview(initialPhotoPreview);
        }
    }, [initialPhotoPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', botoes.titulo);
        formData.append('descricao', botoes.descricao);
        formData.append('localizacao', botoes.localizacao);
        formData.append('gravidade', String(botoes.gravidade));
        formData.append('urgencia', String(botoes.urgencia));
        formData.append('tendencia', String(botoes.tendencia));
        formData.append('status', botoes.status);
        if (foto) {
            formData.append('foto', foto);
        }

        await onSubmit(formData);
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 100) return 'bg-red-600';
        if (priority >= 60) return 'bg-orange-500';
        if (priority >= 30) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const priority = botoes.gravidade * botoes.urgencia * botoes.tendencia;

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-border-dark p-6 space-y-6">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Título da Ocorrência</label>
                <input
                    type="text"
                    required
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none font-medium"
                    placeholder="Ex: Buraco na via principal"
                    value={botoes.titulo}
                    onChange={(e) => setBotoes({ ...botoes, titulo: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Descrição Detalhada</label>
                <textarea
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none text-sm"
                    rows={3}
                    placeholder="Descreva o problema, equipamentos necessários, etc..."
                    value={botoes.descricao}
                    onChange={(e) => setBotoes({ ...botoes, descricao: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Localização</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">location_on</span>
                    <input
                        type="text"
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none text-sm"
                        placeholder="Ex: Próximo ao Rondon 3"
                        value={botoes.localizacao}
                        onChange={(e) => setBotoes({ ...botoes, localizacao: e.target.value })}
                    />
                </div>
            </div>

            {/* GUT Classification */}
            <div className="space-y-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">Classificação GUT</h3>

                <div className="grid grid-cols-1 gap-6">
                    {/* Gravidade */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Gravidade (Impacto)</label>
                            <span className="bg-slate-100 dark:bg-background-dark px-2 py-0.5 rounded text-xs font-black text-primary">{botoes.gravidade}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                            value={botoes.gravidade}
                            onChange={(e) => setBotoes({ ...botoes, gravidade: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-1">
                            <span>Sem danos</span>
                            <span>Extremamente grave</span>
                        </div>
                    </div>

                    {/* Urgência */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Urgência (Prazo)</label>
                            <span className="bg-slate-100 dark:bg-background-dark px-2 py-0.5 rounded text-xs font-black text-primary">{botoes.urgencia}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                            value={botoes.urgencia}
                            onChange={(e) => setBotoes({ ...botoes, urgencia: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-1">
                            <span>Pode esperar</span>
                            <span>Imediato</span>
                        </div>
                    </div>

                    {/* Tendência */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Tendência (Evolução)</label>
                            <span className="bg-slate-100 dark:bg-background-dark px-2 py-0.5 rounded text-xs font-black text-primary">{botoes.tendencia}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                            value={botoes.tendencia}
                            onChange={(e) => setBotoes({ ...botoes, tendencia: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-1">
                            <span>Estável</span>
                            <span>Piora rápida</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-background-dark p-4 rounded-xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Prioridade Total</span>
                        <span className={`px-4 py-1.5 rounded-lg text-white font-black text-lg shadow-sm ${getPriorityColor(priority)}`}>
                            {priority}
                        </span>
                    </div>
                </div>
            </div>

            {/* Photo Upload */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Evidência Fotográfica</label>
                <div
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <div className="relative w-full">
                            <img src={preview} alt="Preview" className="w-full max-h-64 rounded-lg object-contain" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <span className="text-white font-bold text-sm">Trocar Foto</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center group-hover:scale-105 transition-transform">
                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Toque para adicionar foto</p>
                            <p className="text-xs text-slate-400 mt-1">Carregar da galeria ou câmera</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;
