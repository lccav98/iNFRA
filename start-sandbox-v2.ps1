Write-Host "Iniciando Túnel Público v2 (Sem Senha)..." -ForegroundColor Green

# Iniciar Backend Tunnel via SSH (localhost.run)
Start-Job -ScriptBlock {
    ssh -R 80:localhost:5001 nokey@localhost.run
} | Out-Null

# Iniciar Frontend Tunnel via SSH (localhost.run)
Start-Job -ScriptBlock {
    ssh -R 80:localhost:3000 nokey@localhost.run
} | Out-Null

Write-Host "Aguardando conexão com servidor..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Tentar capturar as URLs do output do SSH (difícil via Start-Job, então vamos rodar interativo se possível ou instruir o usuário)
Write-Host "Infelizmente o localhost.run não retorna URLs fixas como o localtunnel." -ForegroundColor Red
Write-Host "Vou abrir duas janelas separadas para você." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -R 80:localhost:5001 nokey@localhost.run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -R 80:localhost:3000 nokey@localhost.run"

Write-Host "Duas novas janelas abriram." -ForegroundColor Green
Write-Host "1. Procure a janela que diz 'tunneled with tls'." -ForegroundColor White
Write-Host "2. Copie os links https://... que aparecerem lá." -ForegroundColor White
Write-Host "Um link será para o Backend (porta 5001) e outro para o Frontend (porta 3000)." -ForegroundColor White

Read-Host "Pressione Enter para fechar esta janela principal"
