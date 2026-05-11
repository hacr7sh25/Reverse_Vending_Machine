# Smart RVM Web Interface Startup Script
# Make sure your RVM Docker container is running on localhost:9001 first!

Write-Host "🚀 Starting Smart RVM Web Interface..." -ForegroundColor Green
Write-Host ""

# Navigate to the project directory
Set-Location -Path $PSScriptRoot

# Check if virtual environment exists
if (-not (Test-Path ".\.venv")) {
    Write-Host "📦 Virtual environment not found. Creating one..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "✅ Activating virtual environment..." -ForegroundColor Green
& ".\.venv\Scripts\activate.ps1"

# Install requirements
Write-Host "📚 Installing requirements..." -ForegroundColor Green
pip install -r requirements.txt -q

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Smart RVM Web Interface" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Open your browser and go to:" -ForegroundColor Yellow
Write-Host "   http://localhost:5000" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure your RVM Docker container is running!" -ForegroundColor Red
Write-Host "   It should be accessible at: http://localhost:9001" -ForegroundColor Red
Write-Host ""
Write-Host "✋ Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Run Flask app
python app.py
