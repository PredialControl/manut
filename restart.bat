@echo off
echo 🔄 Reiniciando servidor...
echo.

echo 📋 Finalizando processos Node.js...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos Node.js finalizados
) else (
    echo ℹ️ Nenhum processo Node.js encontrado
)

echo.
echo 🧹 Limpando cache do Next.js...
if exist ".next" (
    rmdir /s /q .next >nul 2>&1
    echo ✅ Cache do Next.js limpo
) else (
    echo ℹ️ Cache do Next.js não encontrado
)

echo.
echo 🚀 Iniciando servidor...
npm run dev 