import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================');
console.log('   iNFRA - Sistema de Gestao');
console.log('========================================\n');

// Start Backend
console.log('1. Iniciando Backend...');
const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
});

backend.on('error', (err) => {
    console.error('Erro ao iniciar backend:', err);
});

// Wait 3 seconds then start frontend
setTimeout(() => {
    console.log('\n2. Iniciando Frontend...');
    const frontend = spawn('npm', ['run', 'dev'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    frontend.on('error', (err) => {
        console.error('Erro ao iniciar frontend:', err);
    });
}, 3000);

// Handle exit
process.on('SIGINT', () => {
    console.log('\n\nEncerrando servidores...');
    process.exit();
});

console.log('\n========================================');
console.log('Para parar os servidores, pressione Ctrl+C');
console.log('========================================\n');
