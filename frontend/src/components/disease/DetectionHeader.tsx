'use client';
import React from 'react';
import styles from './DetectionHeader.module.css';

export const DetectionHeader: React.FC = () => {
  return (
    <div className={styles.headerContainer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. AGRINOVA INTELLIGENCE (Eyebrow) */}
      <div style={{ 
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#7FBF24',
        opacity: 0.85,
        marginBottom: '24px'
      }}>
        AGRINOVA'S INTELLIGENCE UNIT
      </div>

      {/* 2. Existing Heading (Task Layer) */}
      <h1 className={styles.title} style={{ 
        margin: '0 0 12px 0', 
        lineHeight: 1.05,
        fontSize: 'clamp(34px, 5vw, 48px)'
      }}>
        Crop <span style={{ color: '#7FBF24' }}>Disease</span> Detection
      </h1>
      
      {/* 3. Existing Subtitle */}
      <p className={styles.subtitle} style={{ maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
        Upload or capture a crop image and our AI will analyze it and provide accurate diagnosis
      </p>

    </div>
  );
};
