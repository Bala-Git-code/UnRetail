# PowerShell script to download and start Meilisearch locally on Windows
$MeiliExe = Join-Path $PSScriptRoot "meilisearch.exe"
$DownloadUrl = "https://github.com/meilisearch/meilisearch/releases/download/v1.9.0/meilisearch-windows-amd64.exe"

if (-not (Test-Path $MeiliExe)) {
    Write-Host "[INFO] Meilisearch binary not found. Downloading v1.9.0..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $MeiliExe -UserAgent "Mozilla/5.0"
    Write-Host "[SUCCESS] Meilisearch downloaded successfully to $MeiliExe" -ForegroundColor Green
} else {
    Write-Host "[INFO] Meilisearch binary found." -ForegroundColor Green
}

Write-Host "[START] Starting Meilisearch on http://localhost:7700..." -ForegroundColor Yellow
Write-Host "[INFO] Master Key: masterKey" -ForegroundColor Yellow
& $MeiliExe --master-key="masterKey" --db-path (Join-Path $PSScriptRoot "data.ms")
