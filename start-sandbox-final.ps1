Write-Host "Iniciando Túnel Final (Localhost.run)..." -ForegroundColor Green

# 1. Matar processos antigos
taskkill /F /IM ssh.exe 2>$null

# 2. Iniciar Backend com Título
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { [Console]::Title = 'BACKEND - PORTA 5001'; Write-Host '--------------------------------' -ForegroundColor Red; Write-Host '   BACKEND (API) - COPIE ESTE LINK   ' -ForegroundColor Red; Write-Host '--------------------------------' -ForegroundColor Red; ssh -o StrictHostKeyChecking=no -R 80:localhost:5001 nokey@localhost.run }"

# 3. Iniciar Frontend com Título
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { [Console]::Title = 'FRONTEND - PORTA 3000'; Write-Host '--------------------------------' -ForegroundColor Green; Write-Host '   FRONTEND (SITE) - ACESSE ESTE    ' -ForegroundColor Green; Write-Host '--------------------------------' -ForegroundColor Green; ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run }"

Write-Host "Duas janelas abriram." -ForegroundColor Yellow
Write-Host "Cada uma tem um título (BACKEND ou FRONTEND)." -ForegroundColor White
Write-Host "Copie o link da janela 'BACKEND' para configurar o sistema." -ForegroundColor Cyan

Read-Host "Pressione Enter para fechar"
