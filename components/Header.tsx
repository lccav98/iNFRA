
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MATERIALS } from '../mocks/logisticsData';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, title }) => {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  // Logic to count alerts
  const criticalItems = MOCK_MATERIALS.filter(m => m.status === 'CRITICAL');
  const lowItems = MOCK_MATERIALS.filter(m => m.status === 'LOW');
  const alertCount = criticalItems.length + lowItems.length;

  const handleNotificationClick = () => {
    if (alertCount > 0) {
      navigate('/logistica', { state: { tab: 'inventory', filter: 'CRITICAL' } });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    // Fixed: changed 'SHORT' to 'short' to match Intl.DateTimeFormatOptions type definition
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-border-dark flex items-center justify-between px-8 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Sincronizado
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="bg-slate-100 dark:bg-card-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64 text-slate-900 dark:text-slate-200"
            placeholder="Buscar projetos..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-card-dark transition-colors"
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={handleNotificationClick}
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-card-dark transition-colors relative"
            title={alertCount > 0 ? `${alertCount} alertas de estoque` : 'Sem notificações'}
          >
            <span className={`material-symbols-outlined ${alertCount > 0 ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>notifications</span>
            {alertCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 bg-emergency-red rounded-full border-2 border-white dark:border-background-dark flex items-center justify-center text-[8px] font-bold text-white">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-border-dark"></div>

        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-500 font-bold uppercase">HORA LOCAL (BV)</p>
          <p className="text-xs font-black uppercase tracking-tight">
            {formatTime(time)} - {formatDate(time)}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
