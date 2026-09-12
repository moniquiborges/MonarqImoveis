$env:SSH_ASKPASS = "c:\Users\arino\Documents\PROJETOS\Monarq\scripts\askpass.bat"
$env:SSH_ASKPASS_REQUIRE = "force"
$env:DISPLAY = "dummy:0"

$files = @(
    @{ local = "next.config.ts"; remote = "/opt/monarq/next.config.ts" },
    @{ local = "src\lib\utils.ts"; remote = "/opt/monarq/src/lib/utils.ts" },
    @{ local = "src\lib\services\propertyService.ts"; remote = "/opt/monarq/src/lib/services/propertyService.ts" },
    @{ local = "src\app\api\media\upload-image\route.ts"; remote = "/opt/monarq/src/app/api/media/upload-image/route.ts" },
    @{ local = "src\app\api\media\upload-video\route.ts"; remote = "/opt/monarq/src/app/api/media/upload-video/route.ts" },
    @{ local = "src\app\api\properties\save\route.ts"; remote = "/opt/monarq/src/app/api/properties/save/route.ts" },
    @{ local = "src\components\property\PropertyGallery.tsx"; remote = "/opt/monarq/src/components/property/PropertyGallery.tsx" },
    @{ local = "src\components\property\PropertyCard.tsx"; remote = "/opt/monarq/src/components/property/PropertyCard.tsx" },
    @{ local = "src\components\property\adapters.ts"; remote = "/opt/monarq/src/components/property/adapters.ts" },
    @{ local = "src\components\home\CampoGrandeSection.tsx"; remote = "/opt/monarq/src/components/home/CampoGrandeSection.tsx" },
    @{ local = "src\components\home\FeaturedDevelopments.tsx"; remote = "/opt/monarq/src/components/home/FeaturedDevelopments.tsx" },
    @{ local = "src\components\home\RuralSection.tsx"; remote = "/opt/monarq/src/components/home/RuralSection.tsx" },
    @{ local = "src\components\admin\ImageUpload.tsx"; remote = "/opt/monarq/src/components/admin/ImageUpload.tsx" },
    @{ local = "src\app\admin\(dashboard)\imoveis\page.tsx"; remote = "/opt/monarq/src/app/admin/(dashboard)/imoveis/page.tsx" },
    @{ local = "src\app\admin\(dashboard)\empreendimentos\page.tsx"; remote = "/opt/monarq/src/app/admin/(dashboard)/empreendimentos/page.tsx" },
    @{ local = "src\app\admin\(dashboard)\rural\page.tsx"; remote = "/opt/monarq/src/app/admin/(dashboard)/rural/page.tsx" }
)

foreach ($f in $files) {
    Write-Host "Sending $($f.local) -> $($f.remote)..."
    scp -P 22022 -o StrictHostKeyChecking=no $f.local "root@143.95.166.167:$($f.remote)"
}

Write-Host "Rebuilding and restarting app container on VPS..."
ssh -p 22022 -o StrictHostKeyChecking=no root@143.95.166.167 "cd /opt/monarq && docker compose build app && docker compose up -d app"
