# Sistema iNFRA - Gestão de Infraestrutura e Logística

> Plataforma integrada para monitoramento, controle logístico e gestão de infraestrutura operacional.

---

## 📌 Visão Geral

O **iNFRA** é uma solução web projetada para centralizar o acompanhamento de demandas logísticas, inventário de recursos, alocação de infraestrutura e relatórios gerenciais em tempo real.

### Principais Módulos
- **Painel de Controle (Dashboard):** Visão executiva de disponibilidade de recursos e alertas operacionais.
- **Gestão de Infraestrutura:** Acompanhamento de instalações, manutenção e capacidades de acolhimento.
- **Controle Logístico:** Rastreamento de remessas, materiais, suprimentos e ordens de serviço.
- **Integração Backend:** Conexão com API REST dedicada (`iNFRA-backend`) e persistência segura em banco de dados relacional.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualização de Dados:** Lucide Icons & Victory Charts
- **Comunicação:** Axios / Fetch API

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar o repositório
```bash
git clone https://github.com/lccav98/iNFRA.git
cd iNFRA
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo de exemplo e preencha as variáveis:
```bash
cp .env.example .env
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
O frontend estará acessível em `http://localhost:5173`.

---

## 🔐 Segurança e Boas Práticas

- Arquivos `.env` e chaves privadas nunca são versionados no Git.
- Todos os pacotes devem ser instalados localmente (`npm install`), sem commitar `node_modules`.
- Comunicação segura com o backend via HTTPS/TLS em ambiente de produção.
