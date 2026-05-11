# Reverse_Vending_Machine
```md
# Reverse Vending Machine

Flask web app for uploading images and sending them to a local RVM inference API.

## Overview

This project provides a simple web interface for:
- uploading an image
- sending it to a local reverse vending machine model API
- displaying the inference result

## Model

This app is designed to work with an RVM classification model.
The public hosted model is available at:
https://universe.roboflow.com/harsh-vardhan-jaiswal/rvm-nyu70

## Files included

- `app.py` — Flask backend
- `static/` — client-side JavaScript and styles
- `templates/` — HTML template
- `requirements.txt` — Python dependencies
- `run_model.py` — example local API call script
- `run.ps1` / `start.ps1` — optional Windows PowerShell helpers

## Setup

1. Clone the repository or download the files.
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

## Environment

The app reads the API key from an environment variable.

Create a `.env` file or set the variable in your shell:

```powershell
$env:RVM_API_KEY="YOUR_API_KEY"
```

Do not commit `.env` or any secret keys to GitHub.

## Run

```powershell
python app.py
```

Then open:

```
http://localhost:5000
```

## Notes

- app.py uses `RVM_API_KEY = os.getenv("RVM_API_KEY")`
- run_model.py should not contain a hardcoded API key before sharing
- Ignore local files and folders like:
  - .venv
  - uploads
  - `.env`
  - `__pycache__/`

## License

MIT
