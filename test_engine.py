import pytest
import io
import torch
from PIL import Image
from disease_detection.engine import DiseaseDetectionEngine
from disease_detection.preprocessor import ImagePreprocessor
from disease_detection.exceptions import ImageProcessingError, ModelLoadError

@pytest.fixture
def dummy_image_bytes():
    image = Image.new('RGB', (300, 300), color='red')
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    return img_byte_arr.getvalue()

def test_preprocessor(dummy_image_bytes):
    preprocessor = ImagePreprocessor()
    tensor = preprocessor.process(dummy_image_bytes)
    assert isinstance(tensor, torch.Tensor)
    assert tensor.shape == (1, 3, 224, 224)

def test_preprocessor_invalid_image():
    preprocessor = ImagePreprocessor()
    with pytest.raises(ImageProcessingError):
        preprocessor.process(b"not an image")

def test_engine_initialization():
    engine = DiseaseDetectionEngine()
    assert engine.model is not None
    assert len(engine.idx_to_class) == 12

def test_engine_inference(dummy_image_bytes):
    engine = DiseaseDetectionEngine()
    result = engine.predict(dummy_image_bytes)
    
    assert result.metadata.num_classes == 12
    assert len(result.predictions) == 12
    
    # Check probabilities sum up to ~1.0
    total_prob = sum(p.probability for p in result.predictions)
    assert pytest.approx(total_prob, 0.01) == 1.0
