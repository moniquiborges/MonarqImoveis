$env:SSH_ASKPASS = "c:\Users\arino\Documents\PROJETOS\Monarq\scripts\askpass.bat"
$env:SSH_ASKPASS_REQUIRE = "force"
$env:DISPLAY = "dummy:0"

ssh -p 22022 -o StrictHostKeyChecking=no -o ConnectTimeout=15 root@143.95.166.167 "$($args -join ' ')"
