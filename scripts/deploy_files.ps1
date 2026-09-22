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
    @{ local = "src\app\admin\(dashboard)\rural\page.tsx"; remote = "/opt/monarq/src/app/admin/(dashboard)/rural/page.tsx" },
    @{ local = "src\lib\labels.ts"; remote = "/opt/monarq/src/lib/labels.ts" },
    @{ local = "src\types\database.ts"; remote = "/opt/monarq/src/types/database.ts" },
    @{ local = "src\types\index.ts"; remote = "/opt/monarq/src/types/index.ts" },
    @{ local = "src\components\property\RuralCatalogView.tsx"; remote = "/opt/monarq/src/components/property/RuralCatalogView.tsx" },
    @{ local = "src\components\home\SearchModule.tsx"; remote = "/opt/monarq/src/components/home/SearchModule.tsx" },
    @{ local = "src\components\property\UrbanCatalogView.tsx"; remote = "/opt/monarq/src/components/property/UrbanCatalogView.tsx" },
    @{ local = "src\components\property\UrbanPropertyDetailView.tsx"; remote = "/opt/monarq/src/components/property/UrbanPropertyDetailView.tsx" },
    @{ local = "src\app\(site)\imoveis\campo-grande\page.tsx"; remote = "/opt/monarq/src/app/(site)/imoveis/campo-grande/page.tsx" },
    @{ local = "src\app\(site)\venda-seu-imovel\actions.ts"; remote = "/opt/monarq/src/app/(site)/venda-seu-imovel/actions.ts" },
    @{ local = "src\app\(site)\venda-seu-imovel\page.tsx"; remote = "/opt/monarq/src/app/(site)/venda-seu-imovel/page.tsx" },
    @{ local = "supabase\schema_completo.sql"; remote = "/opt/monarq/supabase/schema_completo.sql" },
    @{ local = "supabase\migrations\20260913000001_expand_rural_state_enum.sql"; remote = "/opt/monarq/supabase/migrations/20260913000001_expand_rural_state_enum.sql" },
    @{ local = "supabase\migrations\20260915000001_add_chacara_rancho_sitio_to_rural_activity.sql"; remote = "/opt/monarq/supabase/migrations/20260915000001_add_chacara_rancho_sitio_to_rural_activity.sql" },
    @{ local = "src\components\layout\Header.tsx"; remote = "/opt/monarq/src/components/layout/Header.tsx" },
    @{ local = "src\components\layout\nav-data.ts"; remote = "/opt/monarq/src/components/layout/nav-data.ts" },
    @{ local = "supabase\migrations\20260922000001_document_property_types_terreno_loteamento.sql"; remote = "/opt/monarq/supabase/migrations/20260922000001_document_property_types_terreno_loteamento.sql" }
)

foreach ($f in $files) {
    Write-Host "Sending $($f.local) -> $($f.remote)..."
    scp -P 22022 -o StrictHostKeyChecking=no $f.local "root@143.95.166.167:$($f.remote)"
}

Write-Host "Acionando build oficial no Coolify via git/Traefik..."
scp -P 22022 -o StrictHostKeyChecking=no scripts\trigger_coolify.sh "root@143.95.166.167:/tmp/trigger_coolify.sh"
ssh -p 22022 -o StrictHostKeyChecking=no root@143.95.166.167 "chmod +x /tmp/trigger_coolify.sh && /tmp/trigger_coolify.sh"

