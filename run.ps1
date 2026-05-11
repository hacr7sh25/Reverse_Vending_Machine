# RVM Model Runner Script
# Change to the script directory
Set-Location -Path 'C:\Users\HP\Documents\Coding\dataset\rvm machine'

# Run the Python script using the virtual environment
& '.\.venv\Scripts\python.exe' run_model.py

# Keep the terminal window open to see the output
Write-Host "`nScript execution completed. Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
