import React from 'react';
import styles from './DiagnosisResult.module.css';
import { DiseasePrediction } from '@/types';
import { Card } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Leaf, Bug } from 'lucide-react';

interface DiagnosisResultProps {
  prediction: DiseasePrediction;
  imagePreviewUrl?: string | null;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ prediction, imagePreviewUrl }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card className={styles.container}>
        {imagePreviewUrl && (
          <div className={styles.imageColumn}>
            <img src={imagePreviewUrl} alt="Analyzed crop" className={styles.analyzedImage} />
          </div>
        )}

        <div className={styles.detailsColumn}>
          <div className={styles.header}>
            <h2 className={styles.diseaseName}>
              {prediction.is_healthy ? 'Crop Appears Healthy' : prediction.disease}
            </h2>
            <Badge variant="ai" style={{ backgroundColor: 'rgba(52, 152, 219, 0.2)', color: '#3498db' }}>
              Model Probability: {(prediction.probability * 100).toFixed(1)}%
            </Badge>
          </div>

          {prediction.is_healthy && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf size={20} />
              <span>No signs of disease detected.</span>
            </div>
          )}

          {!prediction.is_healthy && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(241, 196, 15, 0.1)', borderRadius: '8px', color: '#f1c40f', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span>Primary disease prediction identified.</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
