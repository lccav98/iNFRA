import React from 'react';

interface SettingsProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">Ajustes</h1>
            <p className="text-slate-500 mb-8">Personalize sua experiência no iNFRA.</p>

            <div className="grid gap-6">
                {/* Aparência */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">palette</span>
                        Aparência
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Modo Escuro</p>
                            <p className="text-sm text-slate-500">Alterne entre temas claro e escuro para maior conforto visual.</p>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${darkMode ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </section>

                {/* Notificações (Mock) */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">notifications</span>
                        Notificações
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">Alertas de Sistema</p>
                                <p className="text-sm text-slate-500">Receba notificações sobre atualizações e manutenções.</p>
                            </div>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                            </div>
                        </div>
                        <hr className="border-slate-100 dark:border-border-dark" />
                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">Novos Serviços</p>
                                <p className="text-sm text-slate-500">Notificar quando um novo serviço for registrado (Em breve).</p>
                            </div>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dados (System) */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">storage</span>
                        Sistema
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Cache Local</p>
                            <p className="text-sm text-slate-500">Limpar dados temporários armazenados no navegador.</p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            Limpar Cache
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
