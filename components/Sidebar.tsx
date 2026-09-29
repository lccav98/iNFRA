
import React from 'react';
import { NavLink } from 'react-router-dom';
import { USER_AVATAR } from '../constants';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Projetos', icon: 'construction', path: '/projects' },
    { label: 'Logística', icon: 'local_shipping', path: '/logistics' },
    { label: 'Pessoal', icon: 'group', path: '/personnel' },
    { label: 'Relatórios', icon: 'assessment', path: '/reports' },
    { label: 'Serviços', icon: 'add_a_photo', path: '/servicos' },
  ];

  return (
    <>
      {/* Backdrop para dispositivos móveis */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside className={`w-64 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">engineering</span>
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight tracking-tighter text-primary">iNFRA</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Centro de Operações de Engenharia</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              title="Fechar menu"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-card-dark'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}

        <div className="mt-8 px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Configurações</p>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 py-2 transition-colors text-left ${isActive ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`
            }
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm font-medium">Ajustes</span>
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 py-2 transition-colors text-left ${isActive ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`
            }
          >
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="text-sm font-medium">Suporte</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-border-dark">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-card-dark p-3 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
            <img alt="Cap. Silva" src={USER_AVATAR} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">Cap. Silva</p>
            <p className="text-[10px] text-slate-500 truncate font-semibold">Oficial de Engenharia</p>
          </div>
          <button className="material-symbols-outlined text-slate-400 text-sm hover:text-emergency-red">logout</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
