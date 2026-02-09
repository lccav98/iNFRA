$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   iNFRA - Sistema de Gestao" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "1. Iniciando Backend na porta 5001..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "backend"
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendPath -WindowStyle Normal

Write-Host "   Aguardando backend iniciar..." -ForegroundColor Gray
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   OK Backend iniciado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "   AVISO Backend pode nao ter iniciado" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Iniciando Frontend..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $scriptPath -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Aguarde 10 segundos e acesse http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 3
