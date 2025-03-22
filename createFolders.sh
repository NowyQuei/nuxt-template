#!/bin/bash

# Define the folder structure
folders=(
    "app"
    "app/assets"
    "app/components"
    "app/composables"
    "app/layouts"
    "app/middleware"
    "app/pages"
    "app/plugins"
    "app/utils"
    "content"
    "layers"
    "modules"
    "shared"
    "public"
    "server"
    "server/api"
    "server/middleware"
    "server/plugins"
    "server/routes"
    "server/utils"
)

# Loop through and create folders if they don't exist
for folder in "${folders[@]}"; do
    if [ ! -d "$folder" ]; then
        mkdir -p "$folder"
        echo "Created: $folder"
    else
        echo "Exists: $folder"
    fi
done

echo "Folder structure setup complete."
