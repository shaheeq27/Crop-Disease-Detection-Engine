# 🌿 Crop Disease Detection Engine
> A standalone deep-learning system for detecting crop diseases from leaf images using **PyTorch, ResNet-18, FastAPI, and Next.js**.
Built as the computer-vision component of **AgriNova**, this repository packages the trained disease-detection model into a complete, independently runnable application.
## ✨ What It Does
Upload a crop leaf image and get:
- 🌱 Crop identification
- 🦠 Disease prediction
- 📊 Ranked prediction probabilities
- ⚡ Inference time
- 🧠 Model metadata
- 🖼️ Image preview and analysis UI
```text
Leaf Image
    ↓
Next.js Frontend
    ↓
FastAPI API
    ↓
Image Preprocessing
    ↓
ResNet-18
    ↓
12-Class Softmax
    ↓
Ranked Disease Predictions

⸻

📊 Model

	
Architecture	ResNet-18
Classes	12
Training Images	15,968
External Images	~38K
Training Sources	PlantVillage + PlantDoc
Model Version	V6.6
Training Seed	42

The model was trained on 15,968 images across 12 disease classes, with approximately 38K additional external images used for robustness analysis and independent evaluation.

The external images were not used as additional training data.

Supported Crops

Crop	Conditions
🌶️ Chili	Bacterial Spot, Healthy
🌽 Maize	Healthy, Northern Leaf Blight
🥔 Potato	Early Blight, Healthy, Late Blight
🍅 Tomato	Bacterial Spot, Early Blight, Healthy, Late Blight, Septoria Leaf Spot

⸻

🧠 Inference Pipeline

Images are processed using the same pipeline used by the trained model:

RGB Conversion
      ↓
Resize 256
      ↓
Center Crop 224×224
      ↓
ToTensor
      ↓
ImageNet Normalization
      ↓
ResNet-18
      ↓
12-Class Softmax

Normalization:

mean = [0.485, 0.456, 0.406]
std  = [0.229, 0.224, 0.225]

The engine automatically uses:

Apple Silicon (MPS)
        ↓
      CUDA
        ↓
       CPU

⸻

🖥️ Application

The repository includes a complete web interface.

User Flow

Upload Leaf
     ↓
Preview Image
     ↓
Analyze Image
     ↓
Disease Detection
     ↓
Primary Prediction
     ↓
Ranked Alternatives

The frontend is built with Next.js + TypeScript, while the model is exposed through a lightweight FastAPI service.

⸻

📁 Project Structure

Crop-Disease-Detection-Engine/
│
├── disease_detection/
│   ├── engine.py
│   ├── preprocessor.py
│   ├── schemas.py
│   └── exceptions.py
│
├── models/
│   ├── robust_best_model.pth
│   └── class_mapping.json
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── globals.css
│       │   └── layout.tsx
│       └── types/
│           └── index.ts
│
├── api.py
├── inference.py
├── test_engine.py
├── test_api.py
├── requirements.txt
└── README.md

⸻

🚀 Run Locally

1. Clone

git clone https://github.com/shaheeq27/Crop-Disease-Detection-Engine.git
cd Crop-Disease-Detection-Engine

2. Backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Start FastAPI:

uvicorn api:app --reload --port 8000

3. Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open:

http://localhost:3000

⸻

🧪 Testing

Run the backend test suite:

pytest

The tests cover:

* Image preprocessing
* Invalid image handling
* Model initialization
* Class mapping
* 12-class inference
* Probability normalization
* Prediction ordering
* Healthy-class detection
* API upload validation

Current validation:

6 passed

The complete upload → API → model → result flow has also been verified in a real browser environment.

⸻

📊 Prediction Output

Example:

{
  "crop": "Maize",
  "disease": "Northern Leaf Blight",
  "probability": 0.94,
  "is_healthy": false
}

The API also returns inference timing and model metadata.

Note: probability is the model’s raw softmax probability. It is not a calibrated confidence score.

⸻

🛠️ Tech Stack

Machine Learning

* Python
* PyTorch
* TorchVision
* ResNet-18
* Pillow

Backend

* FastAPI
* Uvicorn
* Pydantic

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Testing

* Pytest

⸻

⚠️ Scope

This is a 12-class image classification system.

It currently does not perform:

* Disease segmentation
* Disease severity estimation
* Diagnosis outside the supported classes
* Probability calibration

Performance may vary for images that differ substantially from the training and evaluation distributions.

⸻

🌱 AgriNova

This engine was developed as part of AgriNova, a broader precision-agriculture platform.

It is maintained separately so the disease-detection model can be independently tested, demonstrated, deployed, and integrated into other agricultural applications.

⸻

Built with PyTorch + FastAPI + Next.js 🌱

### One thing I'd add later
Once we have the UI running and looking final, we should put **1–2 screenshots near the top**. That's going to make the GitHub repo feel *way* more complete than another wall of README text.
For now, this README accurately represents what we've actually built — **no fake frontend claims, no inflated model claims, no unnecessary fluff.**