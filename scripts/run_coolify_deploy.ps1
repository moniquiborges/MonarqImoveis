$env:SSH_ASKPASS = "c:\Users\arino\Documents\PROJETOS\Monarq\scripts\askpass.bat"
$env:SSH_ASKPASS_REQUIRE = "force"
$env:DISPLAY = "dummy:0"

Write-Host "Enviando trigger_coolify.sh para a VPS..."
scp -P 22022 -o StrictHostKeyChecking=no scripts\trigger_coolify.sh "root@143.95.166.167:/tmp/trigger_coolify.sh"

Write-Host "Executando trigger_coolify.sh na VPS..."
ssh -p 22022 -o StrictHostKeyChecking=no root@143.95.166.167 "chmod +x /tmp/trigger_coolify.sh && /tmp/trigger_coolify.sh"
