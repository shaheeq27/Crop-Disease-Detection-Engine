import argparse
from disease_detection.engine import DiseaseDetectionEngine

def main():
    parser = argparse.ArgumentParser(description="Run disease detection inference on an image.")
    parser.add_argument("image_path", help="Path to the image file.")
    args = parser.parse_args()

    engine = DiseaseDetectionEngine()
    
    with open(args.image_path, "rb") as f:
        image_bytes = f.read()
        
    result = engine.predict(image_bytes)
    
    print(f"Inference Time: {result.inference_time_ms:.2f} ms")
    print("Top Predictions:")
    for p in result.predictions[:3]:
        print(f"  {p.crop} - {p.disease}: {p.probability:.4f} (Healthy: {p.is_healthy})")

if __name__ == "__main__":
    main()
