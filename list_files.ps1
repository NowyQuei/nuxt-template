# Define the directories to exclude
$excludeDirs = @('.nuxt', '.output', 'node_modules')

# Get the current directory
$baseDir = Get-Location

# Recursively list all files while properly excluding specified directories
$files = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object {
    # Get the full directory path of the file
    $fileDir = $_.DirectoryName

    # Check if any of the excluded directories exist in the full path
    -not ($excludeDirs | Where-Object { $fileDir -match "\\$_(\\|$)" })
}

# Ensure output is displayed
if ($files.Count -eq 0) {
    Write-Output "No matching files found."
}
else {
    # Output the relative file paths
    $files | ForEach-Object { 
        $relativePath = $_.FullName.Replace("$baseDir\", "")
        Write-Output $relativePath
    }
}
