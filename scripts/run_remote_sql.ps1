param (
    [Parameter(Mandatory=$true)]
    [string]$SqlFile
)

$env:SSH_ASKPASS = "c:\Users\arino\Documents\PROJETOS\Monarq\scripts\askpass.bat"
$env:SSH_ASKPASS_REQUIRE = "force"
$env:DISPLAY = "dummy:0"

$content = Get-Content -Raw $SqlFile

$content | ssh -p 22022 -o StrictHostKeyChecking=no root@143.95.166.167 "docker exec -i monarq-db psql -U postgres -d postgres"
