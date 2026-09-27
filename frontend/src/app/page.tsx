'use client';

import React, { useState } from 'react';
import { DetectionHeader } from '@/components/disease/DetectionHeader';
import { ImageUpload } from '@/components/disease/ImageUpload';
import { AnalyzingState } from '@/components/disease/AnalyzingState';
import { DiagnosisResult } from '@/components/disease/DiagnosisResult';
import { DiseaseDetectionResult } from '@/types';

export default function DetectPage() {
  const [stage, setStage] = useState<'initial' | 'analyzing' | 'result'>('initial');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiseaseDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectImage = (file: File) => {
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    
    setStage('analyzing');
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Analysis failed");
      }

      const data: DiseaseDetectionResult = await response.json();
      setAnalysisResult(data);
      setStage('result');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      setStage('initial');
    }
  };

  return (
    <div style={{
      width: 'calc(100% - 32px)',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '48px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }} className="md:w-[calc(100%-64px)]">

      

      {stage === 'initial' && (
        <div style={{
          background: 'rgba(20, 26, 20, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

          {error && (
            <div style={{
              background: 'rgba(255, 60, 60, 0.1)',
              border: '1px solid rgba(255, 60, 60, 0.3)',
              color: '#ff6b6b',
              padding: '16px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>Analysis Failed</h4>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>{error}</p>
              </div>
            </div>
          )}

          <DetectionHeader />

          <ImageUpload
            imagePreviewUrl={imagePreviewUrl}
            onImageSelect={selectImage}
            onImageClear={clearImage}
            onStartAnalysis={startAnalysis}
          />
        </div>
      )}

      {stage === 'analyzing' && imagePreviewUrl && (
        <AnalyzingState imagePreviewUrl={imagePreviewUrl} />
      )}

      {stage === 'result' && analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <button 
            onClick={() => {
              setStage('initial');
              clearImage();
            }}
            style={{
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              fontWeight: 500
            }}
          >
            ← Analyze Another Image
          </button>
          
          <DiagnosisResult
            prediction={analysisResult.predictions[0]}
            imagePreviewUrl={imagePreviewUrl}
          />
          
          {/* Fallback to show alternatives since they aren't in the original UI */}
          <div style={{
            background: 'rgba(20, 26, 20, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>Alternative Predictions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analysisResult.predictions.slice(1, 5).map((p, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px'
                }}>
                  <span style={{ color: 'white' }}>{p.crop} - {p.disease}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{(p.probability * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
            
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)'
            }}>
              <span>Inference Time: {analysisResult.inference_time_ms.toFixed(1)}ms</span>
              <span>Model: {analysisResult.metadata.architecture} (v{analysisResult.metadata.model_version})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
