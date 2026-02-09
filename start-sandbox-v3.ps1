Write-Host "Iniciando Túnel V3 (Configuração Premium)..." -ForegroundColor Green

# 1. Verificar/Gerar Chave SSH (Necessário para nomes personalizados no Serveo)
$KeyPath = "$HOME/.ssh/id_rsa_infra"
if (-not (Test-Path $KeyPath)) {
    Write-Host "Gerando identidade única para o túnel..." -ForegroundColor Yellow
    if (-not (Test-Path "$HOME/.ssh")) { New-Item -ItemType Directory -Force -Path "$HOME/.ssh" | Out-Null }
    ssh-keygen -t rsa -b 4096 -f $KeyPath -N "" -q
    Write-Host "Identidade criada." -ForegroundColor Green
}

# 2. Matar processos antigos para liberar portas
taskkill /F /IM ssh.exe 2>$null

# 3. Iniciar Túneis
# Nomes desejados (tente mudar se der conflito)
$BackendName = "infra-backend"
$FrontendName = "infra-start" 

Write-Host "Abrindo conexões..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -i '$KeyPath' -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R $BackendName:80:localhost:5001 serveo.net"

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -i '$KeyPath' -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R $FrontendName:80:localhost:3000 serveo.net"

Write-Host "`n---------------------------------------------------" -ForegroundColor Yellow
Write-Host " VERIFIQUE NAS JANELAS PRETAS SE OS NOMES FORAM ACEITOS " -ForegroundColor Yellow
Write-Host "---------------------------------------------------"
Write-Host "Se der certo, seus links serão:"
Write-Host "Backend: https://$BackendName.serveo.net" -ForegroundColor Cyan
Write-Host "Frontend: https://$FrontendName.serveo.net" -ForegroundColor Cyan
Write-Host "`nSe aparecer algo como 'https://a1b2c3...serveo.net', use aquele link."

Read-Host "Pressione Enter para fechar"
