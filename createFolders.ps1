# Define the folder structure
$folders = @(
    "app",
    "app/assets",
    "app/components",
    "app/composables",
    "app/layouts",
    "app/middleware",
    "app/pages",
    "app/plugins",
    "app/utils",
    "content",
    "layers",
    "modules",
    "shared",
    "public",
    "server",
    "server/api",
    "server/middleware",
    "server/plugins",
    "server/routes",
    "server/utils"
)

# Loop through and create folders if they don't exist
foreach ($folder in $folders) {
    if (-Not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Created: $folder"
    } else {
        Write-Host "Exists: $folder"
    }
}

Write-Host "Folder structure setup complete."
