# 🌿 Crop Disease Detection Engine

> A standalone AI system for detecting crop diseases from leaf images using **ResNet-18, PyTorch, FastAPI, and Next.js**.

The **Crop Disease Detection Engine** is a production-oriented computer-vision system developed as part of **AgriNova**. It combines a trained deep-learning model with a lightweight inference API and an interactive web interface.

Upload a crop leaf → analyze it → receive ranked disease predictions with model metadata.

---

## ✨ Overview

The system is designed around a simple inference pipeline:

```text
                    LEAF IMAGE
                        │
                        ▼
              ┌──────────────────┐
              │  Next.js Frontend │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    FastAPI API   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Image Processing │
              │ Resize + Crop    │
              │ Normalization    │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    ResNet-18     │
              │   12 Classes     │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Softmax Scores  │
              └────────┬─────────┘
                       │
                       ▼
             Ranked Predictions
```

### What the application provides

- 🌱 Crop and disease prediction
- 📊 Ranked prediction probabilities
- 🖼️ Leaf image preview
- ⚡ Inference-time measurement
- 🧠 Model metadata
- 🔬 12-class classification
- 🌐 Interactive web interface
- 🧪 Automated backend and inference tests

---

# 🧠 Model

The detection engine uses a **ResNet-18** convolutional neural network with a custom classification head containing **12 output classes**.

| Property | Value |
|---|---|
| Architecture | **ResNet-18** |
| Model Version | **V6.6** |
| Classes | **12** |
| Training Images | **15,968** |
| External Images | **~38K** |
| Training Sources | PlantVillage + PlantDoc |
| Training Seed | **42** |
| Input Size | **224 × 224** |

The model was trained on **15,968 images across 12 disease classes**, with approximately **38K additional external images** used for robustness analysis and independent evaluation.

The external images were **not used as additional training data**.

---

# 🌾 Supported Crops

The current model recognizes the following crop-health classes:

| Crop | Supported Conditions |
|---|---|
| 🌶️ **Chili** | Bacterial Spot, Healthy |
| 🌽 **Maize** | Healthy, Northern Leaf Blight |
| 🥔 **Potato** | Early Blight, Healthy, Late Blight |
| 🍅 **Tomato** | Bacterial Spot, Early Blight, Healthy, Late Blight, Septoria Leaf Spot |

**12 classes in total.**

---

# 🔬 Image Processing

Every image follows a fixed preprocessing pipeline before inference:

```text
Input Image
     │
     ▼
RGB Conversion
     │
     ▼
Resize → 256
     │
     ▼
Center Crop → 224 × 224
     │
     ▼
ToTensor
     │
     ▼
ImageNet Normalization
     │
     ▼
[1, 3, 224, 224]
     │
     ▼
ResNet-18
```

### Normalization

```python
mean = [0.485, 0.456, 0.406]
std  = [0.229, 0.224, 0.225]
```

The inference engine automatically selects the available accelerator:

```text
Apple Silicon (MPS)
        ↓
      CUDA
        ↓
       CPU
```

---

# 📊 Prediction Output

The model produces a probability distribution across all 12 classes and returns predictions ranked from highest to lowest probability.

Example:

```json
{
  "crop": "Maize",
  "disease": "Northern Leaf Blight",
  "probability": 0.94,
  "is_healthy": false
}
```

The complete response also contains:

```text
Prediction Results
Inference Time
Model Version
Architecture
Number of Classes
Training Metadata
```

> **Important:** `probability` represents the model's raw softmax probability. It is **not a calibrated confidence score**.

---

# 🖥️ Web Application

The repository includes a complete web interface built specifically for the detection engine.

### User Flow

```text
Upload Leaf Image
        ↓
Preview Image
        ↓
Analyze Image
        ↓
FastAPI Request
        ↓
ResNet-18 Inference
        ↓
Primary Prediction
        ↓
Ranked Alternatives
        ↓
Model Metadata
```

The interface is designed around a structured analytical layout rather than a generic dashboard.

### Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

### Backend

```text
FastAPI
Uvicorn
Pydantic
Python
```

---

# 📐 Architecture

```text
┌──────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                  │
│                                                      │
│  Image Upload → Preview → Analyze → Results          │
└──────────────────────────┬───────────────────────────┘
                           │
                           │ HTTP POST
                           ▼
┌──────────────────────────────────────────────────────┐
│                     FASTAPI API                      │
│                                                      │
│              POST /analyze-image                     │
│                                                      │
│  • File validation                                   │
│  • 10 MB size limit                                  │
│  • JPEG / PNG / WEBP                                 │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│              DISEASE DETECTION ENGINE                │
│                                                      │
│  Preprocessing → ResNet-18 → Softmax → Ranking       │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│                       MODEL                          │
│                                                      │
│              robust_best_model.pth                  │
│                                                      │
│                  12 disease classes                  │
└──────────────────────────────────────────────────────┘
```

---

# 📁 Project Structure

```text
Crop-Disease-Detection-Engine/
│
├── disease_detection/
│   ├── __init__.py
│   ├── engine.py
│   ├── preprocessor.py
│   ├── schemas.py
│   └── exceptions.py
│
├── models/
│   ├── class_mapping.json
│   └── robust_best_model.pth
│
├── frontend/
│   ├── public/
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
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/shaheeq27/Crop-Disease-Detection-Engine.git

cd Crop-Disease-Detection-Engine
```

---

## 2. Set Up the Python Environment

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Start the Backend

From the project root:

```bash
uvicorn api:app --reload --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

The main endpoint is:

```text
POST /analyze-image
```

---

## 4. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Testing

The backend includes automated tests for both the ML engine and FastAPI layer.

Run:

```bash
pytest
```

Current validation:

```text
6 passed
```

### Test Coverage

The test suite covers:

- Image preprocessing
- Image validation
- Invalid image handling
- Model initialization
- Class mapping
- Full 12-class inference
- Probability normalization
- Prediction ordering
- Healthy-class detection
- API upload validation
- API response structure

The complete browser flow has also been verified:

```text
Browser
   ↓
Frontend
   ↓
FastAPI
   ↓
ResNet-18
   ↓
Prediction
   ↓
Frontend Result
```

---

# ⚡ Standalone Inference

The engine can also be used without the web interface.

Example:

```bash
python inference.py path/to/leaf_image.jpg
```

This provides direct access to the underlying disease-detection engine.

The separation allows the model to be integrated into other applications without requiring the frontend.

---

# 🛠️ Technology Stack

### Machine Learning

- Python
- PyTorch
- TorchVision
- ResNet-18
- Pillow

### Backend

- FastAPI
- Uvicorn
- Pydantic
- Python Multipart

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Testing

- Pytest

---

# ⚠️ Scope & Limitations

This system is a **12-class image classification engine**.

It currently does not perform:

- Pixel-level disease segmentation
- Disease severity estimation
- Disease localization
- Probability calibration
- Diagnosis outside the supported classes

Model performance may vary when images differ substantially from the training and evaluation distributions, such as significantly different crops, diseases, environments, image quality, or field conditions.

The predictions should therefore be interpreted as **model classifications**, not as a replacement for professional agricultural diagnosis.

---

# 🌱 AgriNova

This engine was developed as the computer-vision component of **AgriNova**, a broader precision-agriculture platform.

The disease-detection system is maintained separately so that the underlying model can be:

- Independently tested
- Demonstrated through its own UI
- Deployed independently
- Integrated into other applications
- Improved without coupling it to the main AgriNova platform

---

# 🔮 Future Directions

Potential extensions include:

- Probability calibration
- Additional crop and disease classes
- Larger field-condition datasets
- Improved out-of-distribution detection
- Disease localization
- Disease severity estimation
- Edge and mobile inference optimization

---

## 📌 Summary

```text
                 CROP DISEASE DETECTION ENGINE

              ┌─────────────────────────────┐
              │       Leaf Image Input      │
              └──────────────┬──────────────┘
                             ↓
              ┌─────────────────────────────┐
              │       Image Preprocessing   │
              └──────────────┬──────────────┘
                             ↓
              ┌─────────────────────────────┐
              │          ResNet-18          │
              │         12 Classes          │
              └──────────────┬──────────────┘
                             ↓
              ┌─────────────────────────────┐
              │      Ranked Predictions     │
              └──────────────┬──────────────┘
                             ↓
              ┌─────────────────────────────┐
              │       FastAPI + Next.js     │
              │       Interactive UI        │
              └─────────────────────────────┘
```

**Built with PyTorch · FastAPI · Next.js · 🌱**