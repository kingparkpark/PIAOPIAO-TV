@echo off
chcp 65001 >nul
echo ==========================================
echo       朴朴TV - TMDB 更新推送脚本
echo ==========================================
echo.
echo 正在准备推送代码到 GitHub...
echo.

cd /d "%~dp0"

echo 1. 设置主分支名称...
git branch -m master main >nul 2>&1

echo 2. 添加所有更改...
git add .

echo 3. 提交更改...
git commit -m "feat: Replace Douban with TMDB API" >nul 2>&1

echo 4. 开始推送 (如果卡住，请检查网络/VPN)...
echo.
git push origin main --force

if %errorlevel% neq 0 (
    echo.
    echo [错误] 推送失败！
    echo ------------------------------------------
    echo 可能的原因：
    echo 1. 网络连接 GitHub 失败 (请开启 VPN/代理)
    echo 2. 未登录 GitHub (请在弹出的窗口中登录)
    echo.
) else (
    echo.
    echo [成功] 代码已成功推送到 GitHub！
    echo.
)

pause
