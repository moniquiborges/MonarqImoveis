#!/bin/bash
set -e

cat << 'EOF' > /tmp/deploy_monarq.php
<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Application;

$application = Application::where('uuid', 'xxvz5rwisf4wtqvwysrdm4x4')->first();
if (!$application) {
    echo "Application not found\n";
    exit(1);
}

$deploymentUuid = new_public_id();
echo "Starting deployment $deploymentUuid for application {$application->name}...\n";

$result = queue_application_deployment(
    application: $application,
    deployment_uuid: $deploymentUuid,
    pull_request_id: 0,
    force_rebuild: true,
    is_api: true,
    no_questions_asked: true,
);

echo "Result: " . json_encode($result) . "\n";
EOF

docker cp /tmp/deploy_monarq.php coolify:/var/www/html/deploy_monarq.php
docker exec coolify php /var/www/html/deploy_monarq.php
