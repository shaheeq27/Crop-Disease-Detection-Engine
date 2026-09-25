# 🌿 Crop Disease Detection Engine

> A standalone deep-learning engine for identifying crop diseases from leaf images using **PyTorch + ResNet-18**.

Developed as the computer-vision component of **AgriNova**, this repository isolates the production disease-detection pipeline into a reusable and independently deployable engine.

---

## ✨ Overview

The engine takes a leaf image and returns ranked disease predictions across **12 crop-health classes**.

```text
Leaf Image
    │
    ▼
RGB Conversion
    │
    ▼
Resize 256 → Center Crop 224×224
    │
    ▼
ImageNet Normalization
    │
    ▼
ResNet-18
    │
    ▼
12-Class Softmax
    │
    ▼
Ranked Disease Predictions
```

### Key Numbers

| | |
|---|---|
| 🧠 Architecture | ResNet-18 |
| 🌱 Classes | 12 |
| 🖼️ Training Images | **15,968** |
| 🔬 External Evaluation | **~38K images** |
| 🌾 Training Sources | PlantVillage + PlantDoc |
| 🎯 Training Seed | 42 |
| ⚙️ Model Version | V6.6 |

The ~38K external images were used for **robustness analysis and independent evaluation**, not as additional training data.

---

## 🌾 Supported Crops

| Crop | Conditions |
|---|---|
| 🌶️ **Chili** | Bacterial Spot, Healthy |
| 🌽 **Maize** | Healthy, Northern Leaf Blight |
| 🥔 **Potato** | Early Blight, Healthy, Late Blight |
| 🍅 **Tomato** | Bacterial Spot, Early Blight, Healthy, Late Blight, Septoria Leaf Spot |

**12 classes in total.**

---

## 🧠 Model & Inference

The engine uses a **ResNet-18** backbone with a custom 12-class classification head.

### Preprocessing

Every image follows the same preprocessing pipeline:

```text
PIL Image
   ↓
RGB Conversion
   ↓
Resize(256)
   ↓
CenterCrop(224)
   ↓
ToTensor()
   ↓
ImageNet Normalization
   ↓
[1, 3, 224, 224]
```

Normalization:

```python
mean = [0.485, 0.456, 0.406]
std  = [0.229, 0.224, 0.225]
```

### Hardware

The engine automatically selects:

```text
Apple Silicon (MPS)
        ↓
      CUDA
        ↓
       CPU
```

---

## 📊 Prediction Output

The engine returns predictions ranked by probability.

Example:

```json
{
  "crop": "Maize",
  "disease": "Northern Leaf Blight",
  "probability": 0.94,
  "is_healthy": false
}
```

The result also contains inference timing and model metadata.

> **Note:** `probability` is the model's raw softmax probability. It is **not a calibrated confidence score**.

---

## 🧪 Evaluation & Robustness

The model was trained on **15,968 images across 12 classes**.

To examine behavior beyond the primary training distribution, approximately **38K additional external images** were used for robustness analysis and independent evaluation.

The evaluation considers variations such as:

- Lighting
- Background complexity
- Image quality
- Leaf orientation
- Resolution
- Field conditions
- Visual variation across imagery

This provides a broader assessment than evaluating only on images from the primary training distribution.

---

## 📁 Project Structure

```text
Crop-Disease-Detection-Engine/
│
├── disease_detection/
│   ├── engine.py          # Model loading & inference
│   ├── preprocessor.py    # Image preprocessing
│   ├── schemas.py         # Prediction schemas
│   └── exceptions.py      # Engine exceptions
│
├── models/
│   ├── robust_best_model.pth
│   └── class_mapping.json
│
├── inference.py           # Standalone inference entry point
├── test_engine.py         # Engine tests
├── requirements.txt
└── .gitignore
```

---

## 🚀 Quick Start

### Clone

```bash
git clone https://github.com/shaheeq27/Crop-Disease-Detection-Engine.git
cd Crop-Disease-Detection-Engine
```

### Create Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Inference

```bash
python inference.py <path-to-image>
```

Example:

```bash
python inference.py sample_leaf.jpg
```

---

## 🧪 Testing

Run the test suite:

```bash
pytest test_engine.py
```

The current suite covers:

- Image preprocessing
- Invalid image handling
- Model initialization
- Class mapping
- Full 12-class inference
- Probability normalization
- Prediction ordering
- Healthy-class detection
- Deterministic inference

Current validation:

```text
4 passed
```

---

## 🧩 Standalone by Design

This repository contains only the reusable disease-detection inference layer.

It does **not** depend on:

- PostgreSQL
- SQLAlchemy
- FastAPI
- Authentication
- Farm records
- Crop history
- AgriNova database services
- Frontend code

The separation allows the model to be independently tested, deployed, integrated, or replaced without depending on the rest of the AgriNova platform.

---

## 🛠️ Technology Stack

```text
Python
├── PyTorch
├── TorchVision
├── Pillow
├── Pydantic
└── Pytest
```

---

## ⚠️ Scope

This is a **12-class image classification engine**.

It currently does not perform:

- Pixel-level disease segmentation
- Disease severity estimation
- Diagnosis outside the supported classes
- Probability calibration

Performance can also vary when images differ substantially from the training and evaluation distributions.

---

## 🌱 AgriNova

This engine is part of **AgriNova**, a broader precision-agriculture platform combining machine learning, environmental information, crop intelligence, and agricultural decision support.

The disease-detection component is maintained separately here so that the underlying computer-vision system can evolve independently.

---

## 📌 Future Directions

- Probability calibration
- Additional crops and diseases
- Larger field-condition datasets
- Improved out-of-distribution detection
- Disease localization and severity estimation
- Edge/mobile inference optimization

---

**Built with Python + PyTorch 🌱**
