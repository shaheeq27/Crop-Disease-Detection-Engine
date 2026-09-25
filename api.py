from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from disease_detection import DiseaseDetectionEngine, DiseaseDetectionResult, ImageProcessingError

app = FastAPI(title="Crop Disease Detection Engine API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = DiseaseDetectionEngine()

@app.post("/analyze-image", response_model=DiseaseDetectionResult)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze a crop leaf image for disease."""
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed types: jpeg, png, webp.")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

    try:
        result = engine.predict(content)
        return result
    except ImageProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
