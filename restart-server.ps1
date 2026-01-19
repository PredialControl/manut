# Script para reiniciar o servidor Next.js de forma limpa
Write-Host "🔄 Reiniciando servidor..." -ForegroundColor Yellow

# 1. Finalizar todos os processos Node.js
Write-Host "📋 Finalizando processos Node.js..." -ForegroundColor Cyan
taskkill /f /im node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Processos Node.js finalizados" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Nenhum processo Node.js encontrado" -ForegroundColor Blue
}

# 2. Aguardar um pouco para garantir que os processos foram finalizados
Start-Sleep -Seconds 2

# 3. Limpar cache do Next.js
Write-Host "🧹 Limpando cache do Next.js..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✅ Cache do Next.js limpo" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Cache do Next.js não encontrado" -ForegroundColor Blue
}

# 4. Limpar cache do npm (opcional)
Write-Host "🧹 Limpando cache do npm..." -ForegroundColor Cyan
npm cache clean --force 2>$null
Write-Host "✅ Cache do npm limpo" -ForegroundColor Green

# 5. Reinstalar dependências (opcional - descomente se necessário)
# Write-Host "📦 Reinstalando dependências..." -ForegroundColor Cyan
# npm install
# Write-Host "✅ Dependências reinstaladas" -ForegroundColor Green

# 6. Iniciar o servidor
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan
npm run dev

Write-Host "✅ Servidor iniciado com sucesso!" -ForegroundColor Green
Write-Host "🌐 Acesse: http://localhost:3000" -ForegroundColor Green 