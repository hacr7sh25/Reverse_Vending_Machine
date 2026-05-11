from flask import Flask, render_template, request, jsonify
import requests
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
RVM_API_URL = "http://localhost:9001/rvm-nyu70/1"
RVM_API_KEY = os.getenv("RVM_API_KEY")

if not RVM_API_KEY:
    raise RuntimeError("Set the RVM_API_KEY environment variable before running the app")

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/scan', methods=['POST'])
def scan():
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400
        
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Send to RVM API
        with open(filepath, 'rb') as image_file:
            response = requests.post(
                RVM_API_URL,
                params={"api_key": RVM_API_KEY},
                files={"file": image_file}
            )
        
        if response.status_code == 200:
            result = response.json()
            
            # Read the image and convert to base64 for display
            with open(filepath, 'rb') as img:
                image_data = base64.b64encode(img.read()).decode('utf-8')
            
            return jsonify({
                'success': True,
                'inference_id': result.get('inference_id'),
                'class': result.get('predictions', [{}])[0].get('class', 'Unknown'),
                'confidence': result.get('predictions', [{}])[0].get('confidence', 0),
                'time': result.get('time', 0),
                'image': f'data:image/{filename.rsplit(".", 1)[1].lower()};base64,{image_data}',
                'image_width': result.get('image', {}).get('width', 0),
                'image_height': result.get('image', {}).get('height', 0)
            })
        else:
            return jsonify({
                'success': False,
                'error': f'RVM API Error: {response.status_code}'
            }), response.status_code
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Check if RVM API is accessible"""
    try:
        response = requests.get('http://localhost:9001/health', timeout=2)
        return jsonify({'rvm_api': 'running' if response.status_code == 200 else 'error'})
    except:
        return jsonify({'rvm_api': 'unavailable'})

if __name__ == '__main__':
    print("🚀 Starting Smart RVM Web Interface...")
    print("📍 Open your browser at http://localhost:5000")
    print("⚠️  Make sure your RVM Docker container is running on localhost:9001")
    app.run(debug=True, port=5000)
