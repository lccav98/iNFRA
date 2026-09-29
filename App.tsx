import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import FutureProjectsPage from './pages/FutureProjects';
import ReportsPage from './pages/Reports';
import ProjectDetail from './pages/ProjectDetail';
import ServiceFeed from './pages/ServiceFeed';
import ServiceDetail from './pages/ServiceDetail';
import PersonnelPage from './pages/Personnel';
import LogisticsPage from './pages/Logistics';
import Settings from './pages/Settings';
import Support from './pages/Support';

const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fecha o menu móvel ao navegar entre rotas
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Painel de Controle iNFRA';
      case '/projects':
        return 'Gestão de Projetos';
      case '/logistics':
        return 'Logística de Materiais';
      case '/personnel':
        return 'Gestão de Efetivo';
      case '/reports':
        return 'Relatórios e Análises';
      case '/servicos':
        return 'Serviços de Engenharia';
      case '/settings':
        return 'Configurações do Sistema';
      case '/support':
        return 'Central de Suporte';
      default:
        return 'iNFRA - Centro de Operações de Engenharia';
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
      <main className="w-full md:ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          title={getPageTitle()}
          onToggleSidebar={() => setMobileMenuOpen(prev => !prev)}
        />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<FutureProjectsPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/servicos" element={<ServiceFeed />} />
            <Route path="/servicos/:id" element={<ServiceDetail />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/support" element={<Support />} />
          </Routes >
        </div >

        <footer className="mt-auto p-8 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest gap-4">
          <div className="flex gap-6">
            <span>© 2026 Força-Tarefa Logística Humanitária</span>
            <span className="hidden sm:inline">Operação Acolhida - iNFRA Dashboard</span>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_4px_#137fec]"></span>
              Sistema Estável
            </span>
            <span>V. 2.4.12-MIL</span>
          </div>
        </footer>
      </main >
    </div >
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
