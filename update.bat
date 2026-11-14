@echo off
chcp 65001 >nul
REM ===== Cap nhat bao cao NG ERP len Git + Cloudflare =====
REM 1) Tim file NG_ERP_Report_*.html moi nhat trong thu muc Downloads
REM 2) Chep vao public\index.html
REM 3) Commit + push -> GitHub Actions tu deploy len Cloudflare Pages
cd /d "%~dp0"
set "SRC="
for /f "delims=" %%F in ('dir /b /o-d "%USERPROFILE%\Downloads\NG_ERP_Report_*.html" 2^>nul') do (
  if not defined SRC set "SRC=%USERPROFILE%\Downloads\%%F"
)
if not defined SRC (
  echo [!] Khong tim thay file NG_ERP_Report_*.html trong Downloads.
  echo     Hay bam "Tai HTML moi nhat" tren bao cao truoc.
  pause & exit /b 1
)
echo Dang dung file: %SRC%
copy /y "%SRC%" "public\index.html" >nul
git add -A
git commit -m "Cap nhat bao cao NG ERP %date% %time:~0,5%"
git push
echo.
echo [OK] Da day len GitHub. Cloudflare se tu cap nhat sau khoang 1 phut.
pause
