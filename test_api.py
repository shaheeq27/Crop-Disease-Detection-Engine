import pytest
from fastapi.testclient import TestClient
import io
from PIL import Image
from api import app

client = TestClient(app)

def test_analyze_image():
    # Create a dummy image
    image = Image.new('RGB', (300, 300), color='red')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()

    response = client.post(
        "/analyze-image",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "predictions" in data
    assert "inference_time_ms" in data
    assert "metadata" in data
    assert len(data["predictions"]) == 12

def test_invalid_file_type():
    response = client.post(
        "/analyze-image",
        files={"file": ("test.txt", b"not an image", "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]
