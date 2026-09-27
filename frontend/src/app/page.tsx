'use client';

import React, { useState, useRef } from 'react';
import { Upload, Activity, AlertCircle } from 'lucide-react';
import { DiseaseDetectionResult } from '@/types';

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

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("UNSUPPORTED FORMAT: USE JPEG, PNG, OR WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("FILE SIZE EXCEEDS 10MB LIMIT.");
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
      const response = await fetch('http://127.0.0.1:8000/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "ANALYSIS FAILED. SERVER ERROR.");
      }

      const data: DiseaseDetectionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "NETWORK ERROR. CONNECTION REFUSED.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-[var(--font-sans)] text-[var(--color-text-primary)]">
      
      {/* 1. HEADER (Minimal) */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[var(--color-accent-green)]"></div>
            <span className="font-mono text-sm tracking-widest uppercase font-semibold">
              Crop Health AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-green)]"></span>
            </span>
            <span className="font-mono text-xs text-[var(--color-text-secondary)] uppercase">Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* 2. HERO / INTRO */}
        <section className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl font-medium tracking-tight">Crop Health Analysis</h1>
          <p className="text-[var(--color-text-secondary)] text-base">
            Identify disease patterns from crop leaf imagery using phase 6 inference models.
          </p>
        </section>

        {/* ERROR STATE */}
        {error && (
          <div className="w-full bg-[var(--color-danger-dim)] border border-[var(--color-danger)] p-4 flex items-center gap-3 text-[var(--color-danger)] font-mono text-sm uppercase">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* 3. UPLOAD STATE (Only shows if no image is selected) */}
        {!previewUrl && (
          <section 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-elevated)] hover:border-[var(--color-accent-muted)] transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 group"
          >
            <div className="p-4 bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] group-hover:border-[var(--color-accent-muted)] transition-colors">
              <Upload className="w-6 h-6 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-green)]" />
            </div>
            <div className="text-center flex flex-col gap-1">
              <span className="font-medium text-lg">Initialize Analysis Workspace</span>
              <span className="font-mono text-xs text-[var(--color-text-tertiary)] uppercase">Supported: JPEG, PNG, WEBP (Max 10MB)</span>
            </div>
          </section>
        )}

        {/* 4. AFTER IMAGE UPLOAD (The Result Grid) */}
        {previewUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: 5/12 Image Anchor */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="w-full aspect-[4/3] bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] relative overflow-hidden flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previewUrl} 
                  alt="Subject" 
                  className="w-full h-full object-contain filter contrast-[0.95]" 
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={clearSelection}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-elevated)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
                >
                  Clear Workspace
                </button>
                {!result && (
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider border border-[var(--color-accent-green)] bg-[var(--color-accent-green-dim)] text-[var(--color-accent-green)] hover:bg-[var(--color-accent-muted)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><Activity className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      "Execute Analysis"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: 7/12 Analysis Data */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {!result && isAnalyzing && (
                <div className="h-full min-h-[300px] border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] flex flex-col items-center justify-center text-[var(--color-text-tertiary)] gap-4">
                  <Activity className="w-8 h-8 animate-pulse text-[var(--color-accent-muted)]" />
                  <span className="font-mono text-xs uppercase tracking-widest">Running Inference...</span>
                </div>
              )}

              {!result && !isAnalyzing && (
                <div className="h-full min-h-[300px] border border-[var(--color-border-subtle)] border-dashed flex flex-col items-center justify-center text-[var(--color-text-tertiary)] gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest">Awaiting Execution</span>
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                  
                  {/* 5. PRIMARY RESULT */}
                  <div className="border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-8 flex flex-col gap-8">
                    
                    <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">Primary Detection</span>
                        <h2 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] mt-2">
                          {result.predictions[0].disease}
                        </h2>
                        <span className="text-lg text-[var(--color-text-secondary)]">
                          Host: {result.predictions[0].crop}
                        </span>
                      </div>
                      
                      <div className={`px-3 py-1 font-mono text-xs uppercase font-bold border ${result.predictions[0].is_healthy ? 'border-[var(--color-accent-green)] text-[var(--color-accent-green)]' : 'border-[var(--color-danger)] text-[var(--color-danger)] bg-[var(--color-danger-dim)]'}`}>
                        {result.predictions[0].is_healthy ? 'Healthy' : 'Disease Flagged'}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-end">
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">Raw Softmax Probability</span>
                        <span className="font-mono text-2xl text-[var(--color-text-primary)]">
                          {(result.predictions[0].probability * 100).toFixed(2)}%
                        </span>
                      </div>
                      
                      {/* Mathematical Progress Bar */}
                      <div className="h-2 w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)]">
                        <div 
                          className="h-full bg-[var(--color-accent-green)] transition-all duration-1000 ease-out"
                          style={{ width: `${result.predictions[0].probability * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* 6. ALTERNATIVES (Table Layout) */}
                  <div className="flex flex-col">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 border-b border-[var(--color-border-subtle)] pb-2">Ranked Alternatives</span>
                    
                    <div className="flex flex-col border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)]">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-elevated)] font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
                        <div className="col-span-2">Rank</div>
                        <div className="col-span-7">Prediction</div>
                        <div className="col-span-3 text-right">Probability</div>
                      </div>
                      
                      {/* Table Rows */}
                      {result.predictions.slice(1, 5).map((p, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--color-border-subtle)] last:border-0 text-sm items-center">
                          <div className="col-span-2 font-mono text-[var(--color-text-tertiary)]">
                            {String(idx + 2).padStart(2, '0')}
                          </div>
                          <div className="col-span-7 flex flex-col">
                            <span className="text-[var(--color-text-primary)]">{p.crop} - {p.disease}</span>
                          </div>
                          <div className="col-span-3 text-right font-mono text-[var(--color-text-secondary)]">
                            {(p.probability * 100).toFixed(2)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. MODEL INFORMATION (Metadata) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border-strong)] border border-[var(--color-border-strong)]">
                    <div className="bg-[var(--color-bg-surface)] p-4 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-text-tertiary)]">Architecture</span>
                      <span className="font-mono text-xs text-[var(--color-text-primary)]">{result.metadata.architecture}</span>
                    </div>
                    <div className="bg-[var(--color-bg-surface)] p-4 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-text-tertiary)]">Version</span>
                      <span className="font-mono text-xs text-[var(--color-text-primary)]">{result.metadata.model_version}</span>
                    </div>
                    <div className="bg-[var(--color-bg-surface)] p-4 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-text-tertiary)]">Classes</span>
                      <span className="font-mono text-xs text-[var(--color-text-primary)]">{result.metadata.num_classes}</span>
                    </div>
                    <div className="bg-[var(--color-bg-surface)] p-4 flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-text-tertiary)]">Inference Time</span>
                      <span className="font-mono text-xs text-[var(--color-text-primary)]">{result.inference_time_ms.toFixed(1)} ms</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
