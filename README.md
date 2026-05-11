````markdown
# ♻️ Smart Reverse Vending Machine (RVM)

AI-Powered Waste Classification and Reward System using Flask, Docker, and Computer Vision.

---

## 📌 Project Overview

The Smart Reverse Vending Machine (RVM) is an AI-powered waste classification system designed to automate recyclable waste segregation using image recognition.  

The system allows users to upload an image of waste material and receive:
- Real-time waste classification
- Confidence score prediction
- Reward point simulation
- Interactive dashboard feedback

This project combines:
- Machine Learning
- Full Stack Web Development
- Docker Deployment
- Computer Vision
- Sustainable Recycling Concepts

---

# 🚀 Key Features

✅ AI-based waste classification  
✅ Real-time prediction system  
✅ Flask backend integration  
✅ Responsive frontend UI  
✅ Reward point simulation  
✅ Docker-based deployment  
✅ Scan history tracking  
✅ Dark mode support  
✅ Fast inference performance  
✅ ONNX-compatible deployment pipeline  

---

# 🧠 Model Information

The system uses a trained image classification model based on transfer learning techniques.

### 📊 Model Performance
- Validation Accuracy: 96.7%
- Inference Time: ~0.3–0.5 seconds
- Dataset Size: ~8,700 images

### 🗂️ Waste Categories
- Plastic
- Paper
- Glass
- Metal
- Organic
- Hazardous

---

# 🌐 Hosted Model

Public Roboflow Model:

[Roboflow RVM Model](https://universe.roboflow.com/harsh-vardhan-jaiswal/rvm-nyu70)

---

# 📸 Project Screenshots

## Smart RVM Architecture

![Architecture](screenshots/Architecture.png)

---

## Plastic Waste Detection

![Plastic Detection](screenshots/Plastic_detection.png)

---

## Glass Waste Detection

![Glass Detection](screenshots/Glass_detection.png)

---

## Metal Waste Detection

![Metal Detection](screenshots/Metal_detection.png)

# 📄 Project Documents

- [Final Project Report](documents/PCL_Report_updated.pdf)
- [Project Presentation PPT](documents/PCL_ppt.pdf)

# 🏗️ System Architecture

```text
Frontend (HTML/CSS/JS)
        ↓
Flask Backend API
        ↓
Dockerized ML Inference Engine
        ↓
ResNet34 / ONNX Classification Model
        ↓
Prediction Result + Reward Points
````

---

# 🛠️ Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Python
* Flask
* Flask-CORS

## AI / ML

* ResNet34
* Transfer Learning
* ONNX Runtime
* Roboflow

## Deployment

* Docker
* PowerShell Automation Scripts

---

# 📁 Project Structure

```text
Reverse_Vending_Machine/
│
├── static/                # CSS, JS, assets
├── templates/             # HTML frontend
├── uploads/               # Uploaded test images
├── app.py                 # Flask backend
├── run_model.py           # Model API testing
├── requirements.txt       # Python dependencies
├── run.ps1                # PowerShell run helper
├── start.ps1              # Quick startup script
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/hacr7sh25/Reverse_Vending_Machine.git
cd Reverse_Vending_Machine
```

---

## 2️⃣ Create Virtual Environment

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Configuration

The application uses environment variables for API security.

## Set API Key (PowerShell)

```powershell
$env:RVM_API_KEY="YOUR_API_KEY"
```

⚠️ Never upload `.env` files or API keys to GitHub.

---

# ▶️ Run the Application

## Start Flask Server

```bash
python app.py
```

Open browser:

```text
http://localhost:5000
```

---

# 🐳 Docker Support

To run the model using Docker:

```bash
docker run -p 9001:9001 <your-rvm-image>
```

Make sure Docker Desktop is running before starting the application.

---

# 📸 Application Workflow

1. Upload waste image
2. Backend processes image
3. ML model predicts waste category
4. Result displayed with:

   * confidence score
   * reward points
   * processing time

---

# 📈 Future Enhancements

* Real-time webcam detection
* IoT hardware integration
* QR-based reward redemption
* Mobile application support
* YOLO-based object detection
* Smart bin automation

---

# 👨‍💻 Team Contributions

## Harsh

Model training, backend integration, Docker deployment, frontend-backend connectivity, and debugging.

## Rohith

Frontend implementation, UI testing, API testing, and preprocessing support.

## Brayon

Documentation, dataset organization, testing support, and report preparation.

## Aryan

Research work, workflow documentation, presentation preparation, and validation support.

## Jayavardhan

Requirement analysis, presentation coordination, result recording, and documentation assistance.

---

# 📚 Academic Context

This project was developed as part of:

* Project Centric Learning (PCL)
* 6th Semester Engineering Project
* AI & Machine Learning Domain

---

# 📄 License

This project is licensed under the MIT License.

---

# 🌱 Final Note

The Smart Reverse Vending Machine demonstrates how AI and full-stack deployment technologies can be combined to create practical and scalable sustainability solutions for modern waste management systems.

```
```
