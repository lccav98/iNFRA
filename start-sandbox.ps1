Write-Host "Iniciando Túnel Público..." -ForegroundColor Green

# Iniciar Backend Tunnel em background
Start-Job -ScriptBlock {
    npx localtunnel --port 5001 --subdomain infra-backend-sandbox
} | Out-Null

# Iniciar Frontend Tunnel em background
Start-Job -ScriptBlock {
    npx localtunnel --port 3000 --subdomain infra-start-sandbox
} | Out-Null

Write-Host "Aguardando geração das URLs..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "URLs Públicas (Tente acessar):" -ForegroundColor Cyan
Write-Host "Frontend: https://infra-start-sandbox.loca.lt" -ForegroundColor White
Write-Host "Backend: https://infra-backend-sandbox.loca.lt" -ForegroundColor White

Write-Host "`nIMPORTANTE: Na primeira vez que acessar, o localtunnel pedirá uma senha." -ForegroundColor Red
Write-Host "A senha é o IP público da máquina servidora." -ForegroundColor Red
Write-Host "Para descobrir sua senha/IP, acesse: https://loca.lt/mytunnelpassword" -ForegroundColor Yellow

Read-Host "Pressione Enter para fechar (os túneis continuarão rodando em background se não fechar o terminal)"
