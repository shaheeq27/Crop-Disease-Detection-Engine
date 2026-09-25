export interface DiseasePrediction {
  crop: string;
  disease: string;
  probability: number;
  is_healthy: boolean;
}

export interface EngineMetadata {
  model_version: string;
  architecture: string;
  num_classes: number;
  training_seed: number;
  training_data: string;
  external_benchmark_classes: number;
}

export interface DiseaseDetectionResult {
  predictions: DiseasePrediction[];
  inference_time_ms: number;
  metadata: EngineMetadata;
}
