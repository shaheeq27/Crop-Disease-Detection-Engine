'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, Leaf, Activity, Info, AlertTriangle } from 'lucide-react';
import { DiseaseDetectionResult, DiseasePrediction } from '@/types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Note: Assuming the FastAPI backend is running on port 8000
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Analysis failed");
      }

      const data: DiseaseDetectionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <header className="text-center py-8">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Leaf className="w-10 h-10 text-[var(--color-primary)]" />
          <h1 className="text-4xl font-bold tracking-tight">
            Crop <span className="text-[var(--color-primary)]">Disease</span> Detection
          </h1>
        </div>
        <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
          Upload an image of a crop leaf. The AI will analyze it to detect potential diseases based on its phase 6 production model.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Image Upload & Preview */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileImage className="w-5 h-5 text-[var(--color-primary)]" />
            Image Selection
          </h2>

          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[var(--color-background)]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
              <p className="text-lg font-medium mb-1">Click to upload image</p>
              <p className="text-sm text-[var(--color-text-muted)]">JPEG, PNG, WEBP (Max 10MB)</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-[var(--color-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Crop preview" className="object-cover w-full h-full" />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={clearSelection}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 px-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
                >
                  Choose Another
                </button>
                {!result && (
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 rounded-lg bg-[var(--color-primary)] text-black font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Activity className="w-5 h-5" /> Analyze Image</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
          />
        </div>

        {/* Right Column: Analysis Results */}
        <div className="flex flex-col gap-6">
          {result ? (
            <>
              {/* Primary Prediction */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-dim)] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Primary Prediction</h2>
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-serif text-white">{result.predictions[0].disease}</h3>
                    <div className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${result.predictions[0].is_healthy ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-dim)]' : 'border-[var(--color-warning)] text-[var(--color-warning)] bg-[var(--color-warning)]/10'}`}>
                      {result.predictions[0].is_healthy ? 'Healthy' : 'Disease Detected'}
                    </div>
                  </div>
                  <p className="font-mono text-sm text-[var(--color-text-muted)]">CROP: {result.predictions[0].crop.toUpperCase()}</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-muted)]">Raw Softmax Probability</span>
                    <span className="font-mono text-white">{(result.predictions[0].probability * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--color-background)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                      style={{ width: `${result.predictions[0].probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Alternative Predictions */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Ranked Alternatives</h2>
                <div className="space-y-4">
                  {result.predictions.slice(1, 5).map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                      <div>
                        <p className="text-white text-sm font-medium">{p.crop} - {p.disease}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{p.is_healthy ? 'Healthy' : 'Disease'}</p>
                      </div>
                      <div className="font-mono text-sm text-[var(--color-text-muted)]">
                        {(p.probability * 100).toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inference Metadata */}
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Info className="w-4 h-4" />
                  <span className="font-semibold">Engine Metadata</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-xs">
                  <div>Inference Time: <span className="text-white">{result.inference_time_ms.toFixed(1)}ms</span></div>
                  <div>Model: <span className="text-white">{result.metadata.architecture}</span></div>
                  <div>Version: <span className="text-white">{result.metadata.model_version}</span></div>
                  <div>Classes: <span className="text-white">{result.metadata.num_classes}</span></div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] border border-[var(--color-border)] border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 text-[var(--color-text-muted)] bg-[var(--color-surface)]/30">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-white/50">Awaiting Image</p>
              <p className="text-sm mt-2 max-w-[250px]">Upload an image and run analysis to see the predictions here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
