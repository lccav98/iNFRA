import React from 'react';

const Support: React.FC = () => {
    const handleContact = (method: string) => {
        alert(`Redirecionando para contato via ${method}...`);
        // Aqui entraria a lógica real de redirecionamento (mailto, link whatsapp api, etc)
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">Suporte e Ajuda</h1>
            <p className="text-slate-500 mb-8">Precisa de ajuda? Entre em contato com a equipe de desenvolvimento.</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Contato Direto */}
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Canais de Atendimento</h2>
                    <div className="space-y-4">
                        <button
                            onClick={() => handleContact('WhatsApp')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                            <div className="h-10 w-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-700 dark:text-green-300">chat</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold">WhatsApp Oficial</p>
                                <p className="text-xs opacity-80">Resposta em até 2 horas</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleContact('Email')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-700 dark:text-blue-300">mail</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold">Email Suporte</p>
                                <p className="text-xs opacity-80">suporte@infra-opac.mil.br</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Reportar Erro */}
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Reportar Problema</h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Relatório enviado com sucesso! Obrigado pela colaboração.'); }}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Título do Erro</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Ex: Erro ao salvar serviço"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent text-sm h-32 resize-none"
                                placeholder="Descreva o que aconteceu..."
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors text-sm">
                            Enviar Relatório
                        </button>
                    </form>
                </div>
            </div>

            {/* Sobre */}
            <div className="mt-8 text-center border-t border-slate-200 dark:border-border-dark pt-8">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Sobre o Sistema</p>
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300">Versão 2.4.12-MIL (Stable)</span>
                </div>
                <p className="text-xs text-slate-400 mt-4 max-w-md mx-auto">
                    Desenvolvido exclusivamente para a Operação Acolhida - Força-Tarefa Logística Humanitária.
                    Uso restrito e monitorado.
                </p>
            </div>
        </div>
    );
};

export default Support;
